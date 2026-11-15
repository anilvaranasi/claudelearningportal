import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Learner role. Grant it to users who may open the portal and use Claude search.
// The name must match the string in the @acl / experienceAcls rules exactly.
export const userRole = Role({
    name: 'x_ibmin_claudel.user',
    description: 'Claude Learning Portal user: can open the portal and use Claude search.',
})
