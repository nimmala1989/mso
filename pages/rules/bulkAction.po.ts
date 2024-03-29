import { expect, Page } from "@playwright/test";
import { CommonActions } from "../../utilities/common";
import { Comment } from '../common/comment.po';

export class BulkActions {
    page: Page
    comment: Comment

    constructor(page: Page) {
        this.page = page
        this.comment = new Comment(page)
    }

    async waitForBulkActionToDisapper() {
        await this.page.locator('#dropdownBulkMenu').waitFor({state: 'hidden'})
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
        await this.page.locator('button:has-text("Delete")').click();
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
        await this.page.locator('#expirationCheckbox .mat-checkbox-layout .mat-checkbox-inner-container').click();
        let warnDate = CommonActions.getFutureDate("Days", 10)
        let expirationDate = CommonActions.getFutureDate("Months", 10)
        await this.page.fill('[id="expiryWarnInst"]', warnDate)
        await this.page.locator('[id="expiryDeactivateInst"]').fill(expirationDate)
        return {"warnDate": warnDate, "expirationDate": expirationDate}
    }

    async clickSave() {
        await this.page.locator('button:has-text("Apply Changes")').click();
        await this.page.click('app-modal-footer button:has-text("Proceed")')
    }

    async commentAndSave(comment: string = "created rule with automation script") {
        await this.comment.enterComment(comment);
        await this.page.locator('button:has-text("Submit")').click();
    }

    async commentAllAndSave(comment: string = "created rule with automation script") {
        let outdatedScope = this.page.locator('app-modal-footer button:has-text("Proceed")')
        if(await outdatedScope.isVisible({timeout: 5000})) {
            await outdatedScope.click()
        }
        await this.page.fill('section:has-text("Comment (optional)") textarea', comment);
        await this.page.click('button:has-text("Submit")')
    }

    async waitForActionCompleteMessage(expectedMessage: string = 'Action successfully completed') {
        let message = this.page.locator('snack-bar-container simple-snack-bar > span')
        expect(await message.textContent()).toBe(expectedMessage)
    }
}