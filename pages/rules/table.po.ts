import { Page } from "@playwright/test"

export class Table {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectByName(ruleName: string) {
        this.page.click(`td.mat-column-NAME span.rule-name:has-text("${ruleName}")`)
    }
}