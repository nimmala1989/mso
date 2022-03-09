import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";
import { Context } from "./context.po";

const actions: Action = new Action()

export class Create {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async navigateToPage() {
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://fpsdev7.inficonims.com/mso18/#/facilities/FAB2/tagconditions' }*/),
            this.page.click('text=Tag Conditions')
          ]);
    }

    async openCreatePopup() {
        await this.page.click('button:has-text("Create Tag Condition")');
    }

    async enterName(name: string) {
        return this.page.fill('#tagName', `${name} - ${CommonActions.randomString(4)}`);
    }
    
    async selectType(valueToSelect: string) {
        await this.page.click('#tagType');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    private async getCheckboxByName(forCheckbox: 'Expiration' | 'Enable') {
        return this.page.waitForSelector(`div label:has-text("${forCheckbox}") + div mat-checkbox label span`)
    }

    async selectEnable() {
        const enableCheckbox = await this.getCheckboxByName('Enable')
        await enableCheckbox.check()
    }

    async enterExpiration(expirationDate: string) {
        const expirationCheckbox = await this.getCheckboxByName('Expiration')
        await expirationCheckbox.check()
        await this.page.fill('input[formcontrolname="tagExpiration"]', expirationDate)
    }

    async openContexts() {
        await this.page.click('div label:has-text("Contexts") + div a')
        return new Context(this.page);
    }

    async submit() {
        await this.page.click('button:has-text("Submit")');
    }

    async enterComment() {
        await this.page.click('textarea');
        await this.page.fill('textarea', 'testing here');
        await this.page.click('#mat-dialog-2 button:has-text("Submit")');
    }
}