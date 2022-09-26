import { Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import { Context } from "./context-dialogue.po";
import { AssignedProcesses } from "./assigned-processes-dialogue.po";
import { AssignedRules } from "./assigned-rules-dialogue.po";

const actions: Action = new Action()

/**
 * Functions and Locators for Create Dialogue
 */

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
        name = `${name} - ${CommonActions.randomString(4)}`
        await this.page.fill('#tagName', `${name}`);
        return name;
    }

    async selectType(valueToSelect: string) {
        await this.page.click('#tagType');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        return valueToSelect;
    }

    private async getCheckboxByName(forCheckbox: 'Expiration' | 'Enable') {
        return this.page.waitForSelector(`div label:has-text("${forCheckbox}") + div mat-checkbox label span`)
    }

    async selectEnable() {
        const enableCheckbox = await this.getCheckboxByName('Enable')
        await enableCheckbox.check()
        return true
    }

    async unselectEnable() {
        const enableCheckbox = await this.getCheckboxByName('Enable')
        await enableCheckbox.uncheck()
        return false
    }

    async enterExpiration(expirationDate: string) {
        const expirationCheckbox = await this.getCheckboxByName('Expiration')
        await expirationCheckbox.check()
        await this.page.fill('input[formcontrolname="tagExpiration"]', expirationDate)
        return expirationDate
    }

    /**
     * Open Tag conditions Contexts dialog box
     * @returns the object to access the fields
     */
    async openContexts() {
        await this.page.click('div label:has-text("Contexts") + div a')
        return new Context(this.page);
    }

    /**
     * Open Tag conditions Assigned Processes dialog box
     * @returns the object to access the fields
     */
    async openAssignedProcesses() {
        await this.page.click('div label:has-text("Assigned Processes") + div a')
        return new AssignedProcesses(this.page);
    }

    /**
     * Open Tag conditions Assigned Rules dialog box
     * @returns the object to access the fields
     */
    async openAssignedRules() {
        await this.page.click('div label:has-text("Assigned Rules") + div a')
        return new AssignedRules(this.page);
    }

    async submit() {
        await this.page.click('button:has-text("Submit")');
    }

    async enterComment() {
        await this.page.click('textarea');
        await this.page.fill('textarea', 'testing here');
        await this.page.click('mat-dialog-container:has-text("Comment") button:has-text("Submit")');
        // await this.page.click('#mat-dialog-2 button:has-text("Submit")');
    }
}