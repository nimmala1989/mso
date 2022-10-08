import { expect, Locator, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import RuleGroupLocators from "./locators";
import hexRgb from 'hex-rgb';

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

    async openSideDialogue() {
        await this.page.locator(this.ruleGroupLocators.ruleGroupSideDialogue).waitFor({ state: "visible" });
        this.base = this.page.locator(this.ruleGroupLocators.ruleGroupSideDialogue)
    }

    get id() {
        const field = this.base.locator(this.ruleGroupLocators.id_textbox)
        const label = this.base.locator(this.ruleGroupLocators.ruleGroupSideDialogueLabel)
        return {
            async enter(value: string) {
                value = `${value} - ${CommonActions.randomString(4)}`
                await field.fill(value)
                return value;
            },
            async verify(expectedValue: string) {
                const actualValue = await label.textContent()
                expect(actualValue).toBe(`Rule Group: ${expectedValue}`)
            }
        }
    }

    get display() {
        const field = this.base.locator(this.ruleGroupLocators.display_textbox)
        return {
            async enter(value: string) {
                value = `${value} - ${CommonActions.randomString(4)}`
                await field.fill(value)
                return value;
            },
            async verify(expectedValue: string) {
                const actualValue = await field.inputValue()
                expect(actualValue).toBe(expectedValue)
            }
        }
    }

    get color() {
        const field = this.base.locator(this.ruleGroupLocators.color_textbox)
        const self = this
        return {
            async selectRandomColor(colorcode: string = '#7a2a2a') {
                await field.click()
                await self.page.fill(self.ruleGroupLocators.color_input, colorcode)
                await self.page.click(self.ruleGroupLocators.color_ok_button)
                return colorcode
            },
            async verify(expectedValue: string) {
                const color = hexRgb(expectedValue, {format: 'css'});
                await expect(field).toHaveCSS('background-color', color);
            }
        }
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
        let selectedValue = await this.base.locator(this.ruleGroupLocators.toolMsoGroup_selectedOption).textContent()
        return selectedValue;
    }

    get linkRequireTagCondition() {
        const self = this
        const checkbox = this.base.locator(this.ruleGroupLocators.linksReqAllowedTagCond_checkbox)
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
        const checkbox = this.base.locator(this.ruleGroupLocators.dynamicToolStatusCond_checkbox)
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