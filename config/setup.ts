
export const Endpoints = {
    baseUrl: "https://fpsdev7.inficonims.com",
    baseEndpoint: '/mso19/#',
    deleteRule: function (id: string) {
        return `/mso19/api/rules/${id}`
    },
    getRules: function (client: string = 'FAB2') {
        return `/mso19/api/rules/facility/${client}`
    },
    createRules: function() {
        return `/mso19/api/rules`
    },
    createTagConditions: function() {
        return `/mso19/api/tagconditions`
    }
}

export const Credentials = {
    username: "kevin.brieck",
    password: "Inficon@123!"
}