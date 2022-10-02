import { expect, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import { AssignedProcesses } from "./assigned-processes-dialogue.po";
import { AssignedRules } from "./assigned-rules-dialogue.po";
import { Context } from "./context-dialogue.po";

const commonActions = new CommonActions();

/**
 * View Tag condition box on the right side
 * It also contains the functions to update the values
 */

export class EditOrView {

    page: Page
    actions: Action

    constructor(page: Page) {
        this.page = page
        this.actions = new Action()
    }

    get getForm() {
        return this.page.locator('mat-drawer-container mat-drawer.mat-drawer app-tag-conditions-form')
    }

    get name() {
        const field = this.getForm.locator('#tagName')
        return {
            async update(value: string) {
                value = `${value} - ${CommonActions.randomString(4)}`
                await field.fill(value)
                return value
            },
            async verify(value: string) {
                const actualValue = await field.inputValue()
                expect(actualValue).toBe(value)
            }
        }
    }

    get type() {
        const field = this.getForm.locator('#tagType')
        let self = this
        return {
            async update(value: string) {
                await field.click();
                await self.page.click(`div[role="listbox"] >> text=${value}`);
                return value
            },
            async verify(value: string) {
                await expect(field).toHaveText(value)
            }
        }
    }

    get enable() {
        const field = this.getForm.locator('[formcontrolname="enabled"] span.mat-checkbox-inner-container')
        return {
            async check() {
                let status = await field.isChecked()
                if (!status)
                    await field.click();
                return true
            },
            async uncheck() {
                let status = await field.isChecked()
                if (status)
                    await field.click();
                return false
            },
            async verify(isChecked: boolean) {
                await expect(field).toBeChecked({ checked: isChecked })
            }
        }
    }

    get expiration() {
        const field = this.getForm.locator('[formcontrolname="expirationCheckbox"] span.mat-checkbox-inner-container')
        const inputField = this.getForm.locator('[formcontrolname="tagExpiration"]')
        return {
            async check() {
                let status = await field.isChecked()
                if (!status)
                    await field.click();
                return true
            },
            async uncheck() {
                let status = await field.isChecked()
                if (status)
                    await field.click();
                return false
            },
            async verify(isChecked: boolean) {
                expect(field).toBeChecked({ checked: isChecked })
            },
            async input(value: string) {
                await inputField.fill(value)
                return value
            },
            async verifyInput(value: string) {
                const actualValue = await inputField.inputValue()
                expect(actualValue).toBe(value)
            }
        }
    }

    get context() {
        const field = this.getForm.locator('[formarrayname="contexts"]')
        const self = this
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            },
            async removeContextAndVerify(byIndex: number) {
                let recordCount = await field.locator("div div .fa-minus-circle").count()
                await field.locator(`div div:nth-child(${byIndex}) .fa-minus-circle`).click()
                let updatedCecordCount = await field.locator("div div .fa-minus-circle").count()
                expect(recordCount - 1).toEqual(updatedCecordCount)
            },
            async addNewContext() {
                let recordCount = await field.locator("div div .fa-minus-circle").count()
                await self.page.click('div label:has-text("Contexts") + div a')
                const contextFields = new Context(self.page);
                await contextFields.selectProd(1)
                await contextFields.clickOk()
                let updatedCecordCount = await field.locator("div div .fa-minus-circle").count()
                expect(recordCount + 1).toEqual(updatedCecordCount)
                return await contextFields.getSelectedContext() || ""
            }
        }
    }

    get assignedProcesses() {
        const field = this.getForm.locator('span div:has-text("Assigned Processes") ~ [class="form-row"]')
        const self = this
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            },
            async removeAssignedProcessesAndVerify() {
                let recordCount = await field.locator(".fa-minus-circle").count()
                await field.locator(`.fa-minus-circle`).click()
                let updatedCecordCount = await field.locator(".fa-minus-circle").count()
                expect(recordCount - 1).toEqual(updatedCecordCount)
            },
            async addNewAssignedProcesses() {
                let recordCount = await field.locator(".fa-minus-circle").count()
                await self.page.click('div label:has-text("Assigned Processes") + div a')
                const assignedProcess = new AssignedProcesses(self.page);
                await assignedProcess.selectSamplingProcess(2)
                await assignedProcess.clickOk()
                let updatedCecordCount = await field.locator(".fa-minus-circle").count()
                expect(recordCount + 1).toEqual(updatedCecordCount)
                return await assignedProcess.getSelectedValues() || ""
            }
        }
    }

    get assignedRules() {
        const field = this.getForm.locator('span div:has-text("Assigned Rules") ~ [class="form-row"]')
        const self = this
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            },
            async removeAssignedRulesAndVerify(byIndex: number) {
                let recordCount = await field.locator('ul > span [class="rule-name"] .fa-minus-circle').count()
                await field.locator(`ul > span:nth-child(${byIndex}) [class="rule-name"] .fa-minus-circle`).click()
                let updatedCecordCount = await field.locator('ul > span [class="rule-name"] .fa-minus-circle').count()
                expect(recordCount - 1).toEqual(updatedCecordCount)
            },
            async addNewAssignedRules(byIndex: number) {
                let recordCount = await field.locator('ul > span [class="rule-name"] .fa-minus-circle').count()
                await self.page.click('div label:has-text("Assigned Rules") + div a')
                const assignedRules = new AssignedRules(self.page);
                await assignedRules.selectSamplingRules(byIndex)
                await assignedRules.clickOk()
                let updatedCecordCount = await field.locator('ul > span [class="rule-name"] .fa-minus-circle').count()
                expect(recordCount + 1).toEqual(updatedCecordCount)
                return await assignedRules.getSelectedValues() || ""
            }
        }
    }

    async saveChanges() {
        await this.page.click('#saveButton')

        // Proceed
        await this.page.click('button:has-text("Proceed")')
        await this.page.click('textarea');
        await this.page.fill('textarea', 'testing here');
        await this.page.click('mat-dialog-container:has-text("Comment") button:has-text("Submit")');

        // check success message
        await expect(this.page.locator("app-alert .alert i ~ span")).toHaveText("Saved Successfully")

        // Close Message
        await this.page.click('[class="close"]')
    }
}