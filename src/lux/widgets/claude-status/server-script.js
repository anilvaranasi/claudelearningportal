// Reports whether Claude is configured on this instance, and on request runs a
// real connection test. Returns booleans, the model name and result codes only:
// the API key and the API response body never reach the client.
export default function server(data, _options, input) {
  data.configured = !!gs.getProperty('x_ibmin_claudel.claude_api_key', '');
  data.model = gs.getProperty('x_ibmin_claudel.claude_model', 'claude-sonnet-5-5');

  if (!input || input.action !== 'test') {
    return;
  }

  // One minimal call: max_tokens 1, a one-word prompt. Same endpoint and
  // headers as the Otto search, so a pass here means Otto can reach Claude too.
  // Result codes: ok | not_configured | unauthorized | api_error | unreachable.
  var apiKey = gs.getProperty('x_ibmin_claudel.claude_api_key', '');
  if (!apiKey) {
    data.testResult = 'not_configured';
    return;
  }

  var baseUrl = gs.getProperty(
    'x_ibmin_claudel.claude_base_url',
    'https://api.servicesessentials.ibm.com'
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
        model: data.model,
        max_tokens: 1,
        messages: [{role: 'user', content: 'ping'}]
      })
    );
    request.setHttpTimeout(20000);

    var status = request.execute().getStatusCode();
    data.httpStatus = status;
    if (status >= 200 && status < 300) {
      data.testResult = 'ok';
    } else {
      // Log the status only: bodies can echo the request.
      gs.error('claude-status: connection test returned HTTP ' + status);
      data.testResult =
        status === 401 || status === 403 ? 'unauthorized' : 'api_error';
    }
  } catch (e) {
    gs.error('claude-status: connection test failed: ' + e.message);
    data.testResult = 'unreachable';
  }
}
