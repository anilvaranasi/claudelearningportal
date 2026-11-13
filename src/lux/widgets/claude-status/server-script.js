// Reports whether Claude is configured on this instance. Returns booleans and
// the model name only: the API key never reaches the client.
export default function server(data, _options, _input) {
  data.configured = !!gs.getProperty('x_ibmin_claudel.claude_api_key', '');
  data.model = gs.getProperty('x_ibmin_claudel.claude_model', 'claude-sonnet-5-5');
}
