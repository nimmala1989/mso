import { Locator, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import RuleGroupLocators from "./locators";

const actions: Action = new Action()

/**
 * Functions and Locators for Create Dialogue
 */

export class Create {

    page: Page
    ruleGroupLocators: RuleGroupLocators
    base: Locator;

    constructor(page: Page) {
        this.page = page
        this.ruleGroupLocators = new RuleGroupLocators()
        this.base = this.page.locator(this.ruleGroupLocators.create_dialogue)
    }

    async navigateToPage() {
        await Promise.all([
            this.page.click(this.ruleGroupLocators.ruleGroup_link)
        ]);
    }

    async openCreatePopup() {
        await this.page.click(this.ruleGroupLocators.openCreateDialogue_button);
        this.base = this.page.locator(this.ruleGroupLocators.create_dialogue)
    }

    async enterId(value: string) {
        value = `${value} - ${CommonActions.randomString(4)}`
        await this.base.locator(this.ruleGroupLocators.id_textbox).fill(value)
        return value;
    }

    async enterDisplay(value: string) {
        value = `${value} - ${CommonActions.randomString(4)}`
        await this.base.locator(this.ruleGroupLocators.display_textbox).fill(value)
        return value;
    }

    async selectRandomColor(colorcode: string = '#7a2a2a') {
        await this.base.locator(this.ruleGroupLocators.color_textbox).click()
        await this.page.fill(this.ruleGroupLocators.color_input, colorcode)
        await this.page.click(this.ruleGroupLocators.color_ok_button)
    }

    async enterDescription(value: string) {
        await this.base.locator(this.ruleGroupLocators.description_textbox).fill(value)
        return value;
    }
    
    async enterDynamicSkipWIPLimit(value: number) {
        await this.base.locator(this.ruleGroupLocators.dynamicSkipWipLimit_textbox).fill(value.toString())
        return value;
    }
    
    async selectMSOToolGroup(valueToSelect: string | number = 1) {
        await this.base.locator(this.ruleGroupLocators.toolMsoGroup_dropdown).click()
        if (typeof (valueToSelect) == 'number') {
            await actions.select.byIndex(valueToSelect, this.page)
        } else {
            await actions.select.byText(valueToSelect, this.page)
        }
        return valueToSelect;
    }

    get linkRequireTagCondition() {
        const self = this
        const checkbox =  this.base.locator(this.ruleGroupLocators.linksReqAllowedTagCond_checkbox)
        return {
            async check() {
                let status = await checkbox.isChecked()
                if (!status)
                    await checkbox.click();
                return true
            },
            async uncheck() {
                let status = await checkbox.isChecked()
                if (status)
                    await checkbox.click();
                return false
            }
        }
    }

    get dynamicToolStatusCondition() {
        const self = this
        const checkbox =  this.base.locator(this.ruleGroupLocators.dynamicToolStatusCond_checkbox)
        return {
            async check() {
                let status = await checkbox.isChecked()
                if (!status)
                    await checkbox.click();
                return true
            },
            async uncheck() {
                let status = await checkbox.isChecked()
                if (status)
                    await checkbox.click();
                return false
            }
        }
    }

    async submit() {
        await this.base.locator(this.ruleGroupLocators.submit_create_button).click()
    }

    async enterComment() {
        await this.page.click('textarea');
        await this.page.fill('textarea', 'testing here');
        await this.page.click('mat-dialog-container:has-text("Comment") button:has-text("Submit")');
        // await this.page.click('#mat-dialog-2 button:has-text("Submit")');
    }
}