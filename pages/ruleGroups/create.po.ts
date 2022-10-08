import { expect, Locator, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import RuleGroupLocators from "./locators";
// import hexRgb from 'hex-rgb';

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
                const color = CommonActions.hexToRgb(expectedValue)
                await expect(field).toHaveCSS('background-color', `rgb(${color?.r}, ${color?.g}, ${color?.b})`);
            }
        }
    }

    get description() {
        const field = this.base.locator(this.ruleGroupLocators.description_textbox)
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

    get dynamicSkipWIPLimit() {
        const field = this.base.locator(this.ruleGroupLocators.dynamicSkipWipLimit_textbox)
        return {
            async enter(value: number) {
                await field.fill(value.toString())
                return value;
            },
            async verify(expectedValue: number) {
                const actualValue = await field.inputValue()
                expect(actualValue).toBe(expectedValue.toString())
            }
        }
    }

    get msoToolGroup() {
        const field = this.base.locator(this.ruleGroupLocators.toolMsoGroup_dropdown)
        const input_field = this.base.locator(this.ruleGroupLocators.toolMsoGroup_selectedOption)
        const delete_button = this.base.locator(this.ruleGroupLocators.toolMsoGroup_deleteButton)
        const self = this
        return {
            async select(valueToSelect: string | number = 1) {
                await field.click()
                if (typeof (valueToSelect) == 'number') {
                    await actions.select.byIndex(valueToSelect, self.page)
                } else {
                    await actions.select.byText(valueToSelect, self.page)
                }
                return input_field.textContent()
            },
            async verify(expectedValue: string) {
                const actualValue = await input_field.textContent()
                expect(actualValue).toBe(expectedValue.toString())
            },
            async removeAndVerify() {
                await delete_button.click()
                const actualValue = await input_field.textContent()
                expect(actualValue).toBe("")
            }
        }
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
            },
            async verify(expected: boolean) {
                let status = await checkbox.isChecked()
                expect(status).toBe(expected)
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
            },
            async verify(expected: boolean) {
                let status = await checkbox.isChecked()
                expect(status).toBe(expected)
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