
export const Endpoints = {
    baseUrl: "https://fpsdev7.inficonims.com",
    baseEndpoint: '/mso19/#',
    deleteRule: function (id: string) {
        return `/${this.baseEndpoint}/api/rules/${id}`
    },
    getRules: function (client: string = 'FAB2') {
        return `/${this.baseEndpoint}/api/rules/facility/${client}`
    },
    createRules: function() {
        return `/${this.baseEndpoint}/api/rules`
    },
    createTagConditions: function() {
        return `/${this.baseEndpoint}/api/tagconditions`
    }
}

export const Credentials = {
    username: "kevin.brieck",
    password: "Inficon@123!"
}