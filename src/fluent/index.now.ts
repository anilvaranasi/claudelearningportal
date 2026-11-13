import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

// Claude API key. Declared WITHOUT a value on purpose: the secret is never in
// source control. An admin sets the value on each instance (DEV, PROD) under
// System Properties > x_ibmin_claudel.claude_api_key.
// password2 properties are encrypted at rest; isPrivate keeps the record out of
// update sets so the key cannot travel between instances by accident.
export const claudeApiKey = Property({
    $id: Now.ID['claude_api_key'],
    name: 'x_ibmin_claudel.claude_api_key',
    type: 'password2',
    description: 'API key for the Claude API endpoint (https://api.servicesessentials.ibm.com). Set per instance; never commit.',
    isPrivate: true,
})

// Non-secret Claude settings. Admins can change them per instance without a
// redeploy. The model default matches the "sonnet" alias in the team's Claude
// Code settings for api.servicesessentials.ibm.com.
export const claudeBaseUrl = Property({
    $id: Now.ID['claude_base_url'],
    name: 'x_ibmin_claudel.claude_base_url',
    type: 'string',
    value: 'https://api.servicesessentials.ibm.com',
    description: 'Base URL of the Anthropic-compatible Claude API. The widget calls <base>/v1/messages.',
})

export const claudeModel = Property({
    $id: Now.ID['claude_model'],
    name: 'x_ibmin_claudel.claude_model',
    type: 'string',
    value: 'claude-sonnet-5-5',
    description: 'Claude model ID used by the chat widget.',
})

export const claudeMaxTokens = Property({
    $id: Now.ID['claude_max_tokens'],
    name: 'x_ibmin_claudel.claude_max_tokens',
    type: 'integer',
    value: 2048,
    description: 'Maximum output tokens per Claude reply.',
})
