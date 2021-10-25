import { Page, expect } from "@playwright/test";
import { CommonActions } from "../../utilities/common";
import { Common } from "./common.po";
import { Comment } from './comment.po';
import { Endpoints } from '../../config/setup';
import got from 'got';


export class EditOrView {

    page: Page
    comment: Comment

    constructor(page: Page) {
        this.page = page
        this.comment = new Comment(page)
    }

    async verifyName(expectedName: string) {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        expect(await form.ruleName.getValue()).toEqual(expectedName)
    }

    async updateName(name: string = `Testing - ${CommonActions.randomString(4)}`) {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        await form.ruleName.enter(name)
        await this.page.keyboard.press('Tab');
        return name;
    }

    async clickSave() {
        await this.page.click('#saveButton');
    }

    async commentAndSave(comment: string = "created rule with automation script") {
        await this.comment.enterComment(comment);
        await this.comment.submit();
    }

    async deleteRulesCreateByAutomation(auth: string) {
        const rules: any = await this.getRules()
        for (let rule of rules) {
            if (rule.smpRuleName.includes('Testing -')) {
                await this.deleteRules(rule.smpRuleId, auth)
                console.log(`Deleted Rule - ${rule.smpRuleId}`)
            }
        }
    }

    async getRules() {
        const res = await got(`${Endpoints.baseUrl}${Endpoints.getrules()}`)
        return JSON.parse(res.body);
    }

    async deleteRules(id: string, auth: string) {
        const { data } = await got.delete({
            url: `${Endpoints.baseUrl}${Endpoints.deleteRule(id)}`,
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
                "Referer": "https://fpsdev7.inficonims.com/mso18/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).json()
        return data;
    }
}