import { expect, Page } from "@playwright/test"

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

    async closeSideModule() {
        const matDrawer = await this.page.isVisible('mat-drawer[mode="side"]')
        if (matDrawer) {
            await this.page.click(`mat-drawer[mode="side"] [aria-label="Close"]`)
        }
        await this.page.waitForSelector('mat-drawer[mode="side"]', { state: "hidden" })
    }

    async selectCheckboxByName(ruleName: string) {
        let checkbox = this.page.locator(`tr:has-text("${ruleName}") mat-checkbox input`)
        if(! await checkbox.isChecked()) {
            await this.page.click(`tr:has-text("${ruleName}") mat-checkbox`)
        }
    }

    async recordIsDisabled(ruleName: string) {
        let row = this.page.locator(`tr:has-text("${ruleName}")`)
        await expect(row).toHaveAttribute('class', 'mat-row cdk-row table-row-height rule-row disabled ng-star-inserted')
    }

    async recordIsEnabled(ruleName: string) {
        let row = this.page.locator(`tr:has-text("${ruleName}")`)
        await expect(row).toHaveAttribute('class', 'mat-row cdk-row table-row-height rule-row disabled ng-star-inserted')
    }

    async waitForRuleToDisappear(ruleName: string) {
        await this.page.waitForSelector(`td.mat-column-NAME span.rule-name:has-text("${ruleName}")`, { state: "hidden" })
    }
}