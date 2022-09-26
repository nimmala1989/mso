import { Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";

const actions: Action = new Action()
const commonActions: CommonActions = new CommonActions();

export class AssignedRules {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectValueByIndex(index: number) {
        let element = this.page.locator('div[role="listbox"] [aria-disabled="false"] .mat-option-text').nth(index)
        await element.click()
    }

    async selectSamplingRules(valueToSelect: string | number = 0) {
        await this.page.click('mat-select#smplRule');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async getSelectedValues() {
        return this.page.textContent('span div:has-text("Assigned Rules") ~ [class="form-row"]')
    }

    async clickOk() {
        await this.page.click('button:has-text("Ok")')
    }

    async clickCancel() {
        await this.page.click('button:has-text("Cancel")')
    }
}