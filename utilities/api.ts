
import got from 'got'
import { DateTime } from 'luxon'

export class API {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async lastUpdatedDates() {
        try {
            let response: any = await got(this.baseUrl + '/api/dataLastUpdated');
            response = JSON.parse(response.body)
            return response
        } catch (error) {
            throw new Error(error)
        }
    }
}