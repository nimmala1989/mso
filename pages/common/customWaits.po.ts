import { Page } from "@playwright/test";

export class CustomWaits {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitForFiltersToLoad() {
        await this.page.waitForSelector('.spinner-border', { state: "hidden" })
        await this.page.waitForSelector('app-filter-select-single')
    }
}