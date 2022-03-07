import got from "got/dist/source";
import { Endpoints } from '../../config/setup';
import * as create_request_data from "../../fixtures/create.rules.request.json"
import { CommonActions } from "../../utilities/common";

export class Post {

    async createRuleWithPostRequest(auth: string, ruleName: string = `Testing - ${CommonActions.randomString(4)}`) {
        create_request_data!.smpRuleName = ruleName
        const data = await got.post({
            url: `${Endpoints.baseUrl}${Endpoints.createRules()}`,
            headers: {
                "authorization": auth,
                "transaction-info": "eyBjaGFuZ2VUeXBlOiAiREVMRVRFIFJVTEUiLCBjaGFuZ2VEZXNjcmlwdGlvbjogIkRlbGV0ZSBydWxlIFRlc3RpbmcgLSBCSXJtICg5NjQyKSIsIGNvbW1lbnQ6ICJzZGZzZGZkc2ZzZGYiIH0=",
            },
            json: create_request_data
        })
        return {id: data.body, name: ruleName};
    }
}