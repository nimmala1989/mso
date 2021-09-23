import { Page } from "@playwright/test";

export class Comment {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async enterComment(commentToEnter: string) {
        await this.page.fill('section:has-text("Comment (required)") textarea', commentToEnter);
    }

    async submit() {
        await this.page.click('button:has-text("Submit")');
    }
}