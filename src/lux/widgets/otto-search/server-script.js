// "Ask Claude" search: one single-turn call to the Anthropic-compatible Claude API
// (POST <base>/v1/messages). Claude is asked for JSON only:
//   {"answer": string, "suggestions": string[]}
// The API key lives in the private password2 property
// x_ibmin_claudel.claude_api_key and never reaches the browser.
// On failure the script returns data.errorCode only; the widget maps it to a
// translated message, so no user-facing English is built here.
export default function server(data, _options, input) {
  if (!input || input.action !== 'search') {
    return;
  }

  var MAX_QUERY_CHARS = 1000;
  var MAX_SUGGESTIONS = 3;
  var MAX_SUGGESTION_CHARS = 200;
  var SYSTEM_PROMPT =
    'You are Claude, a search assistant inside the Claude Learning Portal. ' +
    'Answer the user question in 2 to 4 sentences. Then suggest up to 3 short ' +
    'follow-up prompts the user could ask next. ' +
    'Respond with JSON only, no markdown and no code fences, in exactly this ' +
    'shape: {"answer": string, "suggestions": string[]}. ' +
    'Write the answer and each suggestion as plain text with no markdown or asterisks.';

  var query = typeof input.query === 'string' ? input.query.trim() : '';
  if (!query) {
    data.isError = true;
    data.errorCode = 'bad_request';
    return;
  }
  query = query.slice(0, MAX_QUERY_CHARS);

  var apiKey = gs.getProperty('x_ibmin_claudel.claude_api_key', '');
  if (!apiKey) {
    data.isError = true;
    data.errorCode = 'not_configured';
    return;
  }

  var baseUrl = gs.getProperty(
    'x_ibmin_claudel.claude_base_url',
    'https://api.servicesessentials.ibm.com'
  );
  var model = gs.getProperty('x_ibmin_claudel.claude_model', 'claude-sonnet-5-5');
  // The search only needs a 2 to 4 sentence answer plus three short suggestions, so
  // the property value is capped here. A smaller cap also keeps slow calls short.
  var maxTokens = Math.min(
    parseInt(gs.getProperty('x_ibmin_claudel.claude_max_tokens', '2048'), 10) ||
      2048,
    1024
  );

  try {
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(baseUrl.replace(/\/$/, '') + '/v1/messages');
    request.setHttpMethod('POST');
    request.setRequestHeader('x-api-key', apiKey);
    request.setRequestHeader('anthropic-version', '2023-06-01');
    request.setRequestHeader('content-type', 'application/json');
    request.setRequestBody(
      JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{role: 'user', content: query}]
      })
    );
    // A synchronous call holds a request thread, so keep the wait short.
    request.setHttpTimeout(30000);

    var response = request.execute();
    var status = response.getStatusCode();
    if (status < 200 || status >= 300) {
      // Log the status and Anthropic's error.type only: bodies can echo the
      // user's query.
      gs.error(
        'otto-search: Claude API returned HTTP ' +
          status +
          ' (' +
          errorType(response.getBody()) +
          ')'
      );
      data.isError = true;
      if (status === 401 || status === 403) {
        data.errorCode = 'unauthorized';
      } else if (status === 429) {
        data.errorCode = 'rate_limited';
      } else {
        data.errorCode = 'api_error';
      }
      return;
    }

    var json = JSON.parse(response.getBody());
    var text = '';
    var blocks = json.content || [];
    for (var c = 0; c < blocks.length; c++) {
      if (blocks[c].type === 'text') {
        text += blocks[c].text;
      }
    }

    var parsed = parseAnswerJson(text);
    if (parsed) {
      data.answer = String(parsed.answer);
      data.suggestions = cleanSuggestions(
        parsed.suggestions,
        MAX_SUGGESTIONS,
        MAX_SUGGESTION_CHARS
      );
    } else if (json.stop_reason === 'max_tokens') {
      // The reply was cut off mid-JSON. Showing the fragment would look broken.
      gs.error('otto-search: Claude reply was cut off at max_tokens');
      data.isError = true;
      data.errorCode = 'api_error';
      return;
    } else {
      // Not valid JSON: show the raw text, offer no suggestions.
      data.answer = text.trim();
      data.suggestions = [];
    }
    if (!data.answer) {
      data.isError = true;
      data.errorCode = 'api_error';
    }
  } catch (e) {
    gs.error('otto-search: request failed: ' + e.message);
    data.isError = true;
    data.errorCode = 'api_error';
  }

  // Returns Anthropic's error.type (for example rate_limit_error) or 'unknown'.
  // Only this short type is logged, never the body.
  function errorType(body) {
    try {
      var t = JSON.parse(body).error.type;
      return typeof t === 'string' ? t.slice(0, 60) : 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  // Returns {answer, suggestions} or null. Tolerates code fences and prose
  // around the JSON object.
  function parseAnswerJson(text) {
    var candidate = String(text || '')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '');
    var attempts = [candidate];
    var first = candidate.indexOf('{');
    var last = candidate.lastIndexOf('}');
    if (first !== -1 && last > first) {
      attempts.push(candidate.slice(first, last + 1));
    }
    for (var i = 0; i < attempts.length; i++) {
      try {
        var obj = JSON.parse(attempts[i]);
        if (obj && typeof obj.answer === 'string' && obj.answer.trim()) {
          return obj;
        }
      } catch (e) {
        // try the next candidate
      }
    }
    return null;
  }

  function cleanSuggestions(list, max, maxChars) {
    var out = [];
    if (!Array.isArray(list)) {
      return out;
    }
    for (var i = 0; i < list.length && out.length < max; i++) {
      if (typeof list[i] === 'string' && list[i].trim()) {
        out.push(list[i].trim().slice(0, maxChars));
      }
    }
    return out;
  }
}
