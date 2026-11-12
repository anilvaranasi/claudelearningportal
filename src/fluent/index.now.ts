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
