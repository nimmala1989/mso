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

    private get_row_by_tool(name: string) {
        return this.rows.filter({ has: this.page.locator(this.locators.tool_col, { hasText: name }) })
    }

    async selectRowByName(name: string) {
        const matDrawer = await this.page.isVisible(this.locators.sideDialogue)
        if (!matDrawer) {
            await this.get_row_by_tool(name).click()
            await this.page.click('mat-dialog-container button:has-text("Yes")')
        }
        await this.page.waitForSelector(this.locators.sideDialogue)
    }

    async waitForRuleToDisappear(name: string) {
        await this.get_row_by_tool(name).waitFor({ state: "hidden" })
    }
}