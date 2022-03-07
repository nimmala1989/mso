import { Page } from "@playwright/test";
import { CommonActions } from "../../utilities/common";
import { Common } from "./common.po";
import { Comment } from './comment.po';

export class BulkActions {
    page: Page
    comment: Comment

    constructor(page: Page) {
        this.page = page
        this.comment = new Comment(page)
    }

    async openActions() {
        await this.page.click('[id="dropdownBulkMenu"]');
    }

    async selectEdit() {
        await this.openActions()
        await this.page.locator('[aria-labelledby="dropdownBulkMenu"] a:has-text("Edit")').click();
    }

    async selectDelete() {
        await this.openActions()
        await this.page.locator('[aria-labelledby="dropdownBulkMenu"] a:has-text("Delete")').click();
    }

    async selectDisable() {
        await this.openActions()
        await this.page.locator('[aria-labelledby="dropdownBulkMenu"] a:has-text("Disable")').click();
    }

    async selectEnable() {
        await this.openActions()
        await this.page.locator('[aria-labelledby="dropdownBulkMenu"] a:has-text("Enable")').click();
    }

    async editExpirationDate() {
        const form = new Common(this.page, 'read');
        await form.instantiate()
        await form.expiration.select()
        let warnDate = CommonActions.getFutureDate("Days", 10)
        let expirationDate = CommonActions.getFutureDate("Months", 10)
        await form.expiration.enterExpire(expirationDate)
        await form.expiration.enterExpire(warnDate)
        return {"warnDate": warnDate, "expirationDate": expirationDate}
    }

    async clickSave() {
        await this.page.click('#saveButton');
    }

    async commentAndSave(comment: string = "created rule with automation script") {
        await this.comment.enterComment(comment);
        await this.comment.submit();
    }
}