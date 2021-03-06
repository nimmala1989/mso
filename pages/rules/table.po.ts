import { Page } from "@playwright/test"

export class Table {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectByName(ruleName: string) {
        const matDrawer = await this.page.isVisible('mat-drawer[mode="side"]')
        if (!matDrawer) {
            await this.page.click(`td.mat-column-NAME span.rule-name:has-text("${ruleName}")`)
        }
        await this.page.waitForSelector('mat-drawer[mode="side"]')
    }

    async selectCheckboxByName(ruleName: string) {
        await this.page.click(`td.mat-column-NAME:has-text("${ruleName}") mat-checkbox`)
    }

    async waitForRuleToDisappear(ruleName: string) {
        await this.page.waitForSelector(`td.mat-column-NAME span.rule-name:has-text("${ruleName}")`, { state: "hidden" })
    }
}