import { Page } from "@playwright/test";

export class Rules {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitForPageLoad() {
        await this.page.waitForSelector('.spinner-border', { state: "hidden" })
        await this.page.waitForSelector('app-filter-select-single')
    }
    async openRulesPopup() {
        await this.page.waitForSelector('mat-dialog-container #rule-form-container', {state: 'detached'})
        await this.page.click('button:has-text("Create a rule")', {force: true});
    }
}