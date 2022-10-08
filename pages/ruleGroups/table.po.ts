import { Page } from "@playwright/test"
import RuleGroupLocators from "./locators"

export class Table {
    page: Page
    locators: RuleGroupLocators

    constructor(page: Page) {
        this.page = page
        this.locators = new RuleGroupLocators()
    }

    get table() {
        return this.page.locator(this.locators.table)
    }

    get rows() {
        return this.table.locator(this.locators.rows)
    }

    private get_row_by_name(name: string) {
        return this.rows.filter({ has: this.page.locator(this.locators.display_col, { hasText: name }) })
    }

    async selectRowByName(id: string, display: string) {
        const matDrawer = await this.page.isVisible(this.locators.ruleGroupSideDialogue)
        if (!matDrawer) {
            await this.get_row_by_name(`${display} (${id})`).click()
            await this.page.click('mat-dialog-container button:has-text("Yes")')
            await this.get_row_by_name(`${display} (${id})`).click()
            await this.get_row_by_name(`${display} (${id})`).click()
        }
        await this.page.waitForSelector(this.locators.ruleGroupSideDialogue)
    }

    async waitForRuleToDisappear(id: string, display: string) {
        await this.get_row_by_name(`${display} (${id})`).waitFor({ state: "hidden" })
    }
}