import { Page, expect } from "@playwright/test";
import { Common } from "./common.po";

export class EditOrView {
    
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async verifyName(expectedName: string) {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        expect(await form.ruleName.getValue()).toEqual(expectedName)
    }
}