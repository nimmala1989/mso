import got from "got/dist/source";
import { Endpoints } from '../../config/setup';

export class APIs {

    async getWaivers() {
        const res = await got(`${Endpoints.baseUrl}${Endpoints.getWaivers()}`)
        return JSON.parse(res.body);
    }

    async getWaiverId(byDescription: string) {
        const res = await this.getWaivers()
        for(let record of res) {
            if (record["description"] == byDescription) {
                return record["waiverId"]
            }
        }
    }

    async deleteWaiveer(name: string, auth: string) {
        const id = await this.getWaiverId(name)
        const { data } = await got.delete({
            url: `${Endpoints.baseUrl}${Endpoints.deleteWaiver(id)}`,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "access-control-allow-origin": "*",
                "authorization": auth,
                "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "transaction-info": "eyBjaGFuZ2VUeXBlOiAiREVMRVRFIFJVTEUiLCBjaGFuZ2VEZXNjcmlwdGlvbjogIkRlbGV0ZSBydWxlIFRlc3RpbmcgLSBCSXJtICg5NjQyKSIsIGNvbW1lbnQ6ICJzZGZzZGZkc2ZzZGYiIH0=",
                "Referer": "https://fpsdev7.inficonims.com/mso20/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).json()
        return data;
    }
}