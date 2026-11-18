import '@servicenow/sdk/global'
import { Table, ReferenceColumn } from '@servicenow/sdk/core'

// One row per Claude search. The otto-search server script counts a user's rows from
// the last hour to enforce the per-user limit. Time comes from the platform column
// sys_created_on, so the table only needs to store who searched. The query text is
// deliberately not stored.
export const searchLog = Table({
    name: 'x_ibmin_claudel_search_log',
    label: 'Claude Search Log',
    schema: {
        user: ReferenceColumn({
            label: 'User',
            referenceTable: 'sys_user',
            mandatory: true,
        }),
    },
    display: 'user',
    // Only the server script writes here. Admins can read it for usage data.
    allowWebServiceAccess: false,
    accessibleFrom: 'package_private',
    readRoles: ['admin'],
    createRoles: ['admin'],
    writeRoles: ['admin'],
    deleteRoles: ['admin'],
})
