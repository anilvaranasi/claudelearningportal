// Calls the Anthropic-compatible Claude API (POST <base>/v1/messages).
// The API key lives in the private password2 property
// x_ibmin_claudel.claude_api_key and never reaches the browser.
// On failure the script returns data.errorCode; the widget maps it to a
// translated message, so no user-facing English is built here.
export default function server(data, _options, input) {
  if (!input || input.action !== 'chat') {
    return;
  }

  var MAX_MESSAGES = 20;
  var MAX_CHARS = 8000;
  var SYSTEM_PROMPT =
    'You are Claude, an assistant inside the Claude Learning Portal on ServiceNow. ' +
    'Help the user learn about Claude and AI. Be clear and concise.';

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
  var maxTokens =
    parseInt(gs.getProperty('x_ibmin_claudel.claude_max_tokens', '2048'), 10) ||
    2048;

  // Validate and trim the conversation sent by the client.
  var incoming = Array.isArray(input.messages) ? input.messages : [];
  var messages = [];
  for (var i = Math.max(0, incoming.length - MAX_MESSAGES); i < incoming.length; i++) {
    var m = incoming[i];
    if (
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim()
    ) {
      messages.push({role: m.role, content: m.content.slice(0, MAX_CHARS)});
    }
  }
  // The API requires the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== 'user') {
    messages.shift();
  }
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    data.isError = true;
    data.errorCode = 'bad_request';
    return;
  }

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
        messages: messages
      })
    );
    request.setHttpTimeout(90000);

    var response = request.execute();
    var status = response.getStatusCode();
    if (status < 200 || status >= 300) {
      // Log status only: the body can echo request content.
      gs.error('claude-chat: Claude API returned HTTP ' + status);
      data.isError = true;
      data.errorCode = status === 401 || status === 403 ? 'unauthorized' : 'api_error';
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
    data.reply = text;
    data.model = json.model || model;
  } catch (e) {
    gs.error('claude-chat: request failed: ' + e.message);
    data.isError = true;
    data.errorCode = 'api_error';
  }
}
