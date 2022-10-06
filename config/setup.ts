
export const Endpoints = {
    baseUrl: "https://fpsdev7.inficonims.com",
    baseEndpoint: '/mso20/#',
    deleteRule: function (id: string) {
        return `/mso20/api/rules/${id}`
    },
    getRules: function (client: string = 'FAB2') {
        return `/mso20/api/rules/facility/${client}`
    },
    createRules: function() {
        return `/mso20/api/rules`
    },
    createTagConditions: function() {
        return `/mso20/api/tagconditions`
    },
    getRulesGroup: function (client: string = 'FAB2') {
        return `/mso20/api/rulegroups/facility/${client}`
    },
    deleteRuleGroup: function (id: string) {
        return `/mso20/api/rulegroups/facility/FAB2/ruleGroup/${id}`
    },
}

export const Credentials = {
    username: "kevin.brieck",
    password: "Inficon@123!"
}