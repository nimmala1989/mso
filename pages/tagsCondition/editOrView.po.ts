import { expect, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";

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
            async enter(value: string) {
                await field.fill(value);
            },
            async verify(value: string) {
                const actualValue = await field.inputValue()
                expect(actualValue).toBe(value)
            }
        }
    }

    get type() {
        const field = this.getForm.locator('#tagType')
        return {
            async enter(value: string) {
                await field.selectOption(value);
            },
            async verify(value: string) {
                await expect(field).toHaveText(value)
            }
        }
    }

    get enable() {
        const field = this.getForm.locator('[formcontrolname="enabled"] input')
        return {
            async check() {
                await field.check();
            },
            async uncheck() {
                await field.uncheck();
            },
            async verify(isChecked: boolean) {
                await expect(field).toBeChecked({ checked: isChecked })
            }
        }
    }

    get expiration() {
        const field = this.getForm.locator('[formcontrolname="expirationCheckbox"] input')
        const inputField = this.getForm.locator('[formcontrolname="tagExpiration"]')
        return {
            async check() {
                await field.check();
            },
            async uncheck() {
                await field.uncheck();
            },
            async verify(isChecked: boolean) {
                expect(field).toBeChecked({ checked: isChecked })
            },
            async input(value: string) {
                await inputField.fill(value)
            },
            async verifyInput(value: string) {
                const actualValue = await inputField.inputValue()
                expect(actualValue).toBe(value)
            }
        }
    }

    get context() {
        const field = this.getForm.locator('[formarrayname="contexts"]')
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            }
        }
    }

    get assignedProcesses() {
        const field = this.getForm.locator('span div:has-text("Assigned Processes") ~ [class="form-row"]')
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            }
        }
    }

    get assignedRules() {
        const field = this.getForm.locator('span div:has-text("Assigned Rules") ~ [class="form-row"]')
        return {
            async verify(verify: string) {
                await expect(field).toHaveText(verify)
            }
        }
    }
}