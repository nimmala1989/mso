import { Page, expect } from "@playwright/test";
import { CommonActions } from "../../utilities/common";
import { Common } from "./common.po";
import { Comment } from './comment.po'

export class EditOrView {
    
    page: Page
    comment: Comment

    constructor(page: Page) {
        this.page = page
    }

    async verifyName(expectedName: string) {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        expect(await form.ruleName.getValue()).toEqual(expectedName)
    }

    async udpateName(name: string = `Testing - ${CommonActions.randomString(4)}`) {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        await form.ruleName.enter(name)
        await this.page.keyboard.press('Tab');
    }

    async clickSave() {
        await this.page.click('#saveButton');
    }

    async commentAndSave() {
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
    }
}