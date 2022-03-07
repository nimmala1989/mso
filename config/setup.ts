
export const Endpoints = {
    baseUrl: "https://fpsdev7.inficonims.com",
    baseEndpoint: '/mso18/#',
    deleteRule: function (id: string) {
        return `/mso18/api/rules/${id}`
    },
    getrules: function (client: string = 'FAB2') {
        return `/mso18/api/rules/facility/${client}`
    },
    createRules: function() {
        return `/mso18/api/rules`
    }
}