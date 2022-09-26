import { expect, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";

const actions: Action = new Action()
const commonActions: CommonActions = new CommonActions();

/**
 * functions to the Tag conditions to records
 */

export class Table {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    get viewForm() {
        return this.page.locator('mat-drawer-container mat-drawer.mat-drawer app-tag-conditions-form')
    }

    async selectByName(name: string) {
        let form = await this.viewForm.isVisible()
        if (!form) {
            await this.page.click(`mat-cell.mat-column-NAME span:has-text("${name}")`)
        }
        await expect(this.viewForm).toBeVisible()
    }
}