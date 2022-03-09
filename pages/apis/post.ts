import got from "got/dist/source";
import { Endpoints } from '../../config/setup';
import {
    rules_request_data, 
    tagConditions_request_data
} from '../../fixtures'
import { CommonActions } from "../../utilities/common";

export class Post {

    async createRuleWithPostRequest(auth: string, ruleName: string = `Testing - ${CommonActions.randomString(4)}`) {
        rules_request_data!.smpRuleName = ruleName
        const data = await got.post({
            url: `${Endpoints.baseUrl}${Endpoints.createRules()}`,
            headers: {
                "authorization": auth,
                "transaction-info": "eyBjaGFuZ2VUeXBlOiAiREVMRVRFIFJVTEUiLCBjaGFuZ2VEZXNjcmlwdGlvbjogIkRlbGV0ZSBydWxlIFRlc3RpbmcgLSBCSXJtICg5NjQyKSIsIGNvbW1lbnQ6ICJzZGZzZGZkc2ZzZGYiIH0=",
            },
            json: rules_request_data
        })
        return {id: data.body, name: ruleName};
    }

    async createTagConditionWithPostRequest(auth: string, tagName: string = `Testing - ${CommonActions.randomString(4)}`) {
        tagConditions_request_data!.tagConditionName = tagName
        const data = await got.post({
            url: `${Endpoints.baseUrl}${Endpoints.createRules()}`,
            headers: {
                "authorization": auth,
                "transaction-info": "eyBjaGFuZ2VUeXBlOiAiREVMRVRFIFJVTEUiLCBjaGFuZ2VEZXNjcmlwdGlvbjogIkRlbGV0ZSBydWxlIFRlc3RpbmcgLSBCSXJtICg5NjQyKSIsIGNvbW1lbnQ6ICJzZGZzZGZkc2ZzZGYiIH0=",
            },
            json: tagConditions_request_data
        })
        return {id: data.body, name: tagName};
    }
}