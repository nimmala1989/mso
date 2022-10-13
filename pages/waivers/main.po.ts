import { expect, Locator, Page } from "@playwright/test";
import { Action } from '../../utilities/actions';
import { CommonActions } from "../../utilities/common";
import WaiverLocators from "./locators";

const actions: Action = new Action()

export class WaiverPage {

    page: Page
    waiverLocators: WaiverLocators
    base: Locator;

    constructor(page: Page) {
        this.page = page
        this.waiverLocators = new WaiverLocators()
        this.base = this.page.locator(this.waiverLocators.create_dialogue)
    }

    async navigateToPage() {
        await this.page.click(this.waiverLocators.waiver_link)
    }

    async openCreatePopup() {
        await this.page.click(this.waiverLocators.openCreateDialogue_button);
        this.base = this.page.locator(this.waiverLocators.create_dialogue)
    }

    async openSideDialogue() {
        await this.page.locator(this.waiverLocators.sideDialogue).waitFor({ state: "visible" });
        this.base = this.page.locator(this.waiverLocators.sideDialogue)
    }

    get type() {
        const self = this
        return {
            async selectPresent() {
                await self.base.locator(self.waiverLocators.type_preset_button).click()
                return 'Present'
            },
            async selectSkip() {
                await self.base.locator(self.waiverLocators.type_skip_button).click()
                return 'Skip'
            },
            async selectRisk() {
                await self.base.locator(self.waiverLocators.type_risk_button).click()
                return 'Risk'
            },
            async verify(expected: string) {
                await expect(self.base.locator(self.waiverLocators.type_label)).toHaveText(expected)
            }
        }
    }

    get tool() {
        const self = this
        return {
            async select(valueToSelect: string | number = 0) {
                await self.base.locator(self.waiverLocators.tool_dropdown).click()
                if (typeof (valueToSelect) == 'number') {
                    await actions.select.byIndex(valueToSelect, self.page)
                } else {
                    await actions.select.byText(valueToSelect, self.page)
                }
                return self.base.locator(self.waiverLocators.tool_selectedValue).textContent()
            },
            async verify(expectedValue: string) {
                const actualValue = await self.base.locator(self.waiverLocators.tool_selectedValue).textContent()
                expect(actualValue).toBe(expectedValue.toString())
            }
        }
    }

    get ruleName() {
        const self = this
        return {
            async select(valueToSelect: string | number = 0) {
                await self.base.locator(self.waiverLocators.smpRuleName_dropdown).click()
                if (typeof (valueToSelect) == 'number') {
                    await self.page.getByRole('option').nth(valueToSelect).click()
                } else {
                    await self.page.getByRole('option', { name: valueToSelect }).getByText(valueToSelect).click();
                }
                return await self.base.locator(self.waiverLocators.smpRuleName_dropdown).locator('.mat-select-min-line').textContent()
            },
            async verify(expectedValue: string) {
                const actualValue = await self.base.locator(self.waiverLocators.smpRuleName_dropdown).locator('.mat-select-min-line').textContent()
                expect(actualValue).toBe(expectedValue.toString())
            }
        }
    }

    get description() {
        const field = this.base.locator(this.waiverLocators.description_textbox)
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

    get presetOptions() {
        const self = this
        return {
            async selectAllLotsTag() {
                await self.page.pause()
                await self.base.locator('.mat-radio-container .mat-radio-outer-circle').nth(0).click()
                return self.expiration
            },
            async selectNextLotsTag() {
                await self.base.locator(self.waiverLocators.present_tag_next_lots_radioButton).click()
            },
            async selectDelayLotsTag() {
                await self.base.locator(self.waiverLocators.present_tag_DELAY_lots_radioButton).click()
            },
            async verifyAllLotsSelected(isSelected: boolean) {
                const status = await self.base.locator(self.waiverLocators.present_tag_all_lots_radioButton).isChecked()
                expect(status).toBe(isSelected)
            },
            async verifyNextLotsSelected(isSelected: boolean) {
                const status = await self.base.locator(self.waiverLocators.present_tag_next_lots_radioButton).isChecked()
                expect(status).toBe(isSelected)
            },
            async verifyDelayLotsSelected(isSelected: boolean) {
                const status = await self.base.locator(self.waiverLocators.present_tag_DELAY_lots_radioButton).isChecked()
                expect(status).toBe(isSelected)
            },
            async enterDelayCounter(value: string) {
                await self.base.locator(self.waiverLocators.present_tag_DELAY_lots_delayCounter_textbox).fill(value)
            },
            async verifyDelayCounter(value: string) {
                await expect(self.base.locator(self.waiverLocators.present_tag_DELAY_lots_delayCounter_textbox)).toHaveValue(value)
            }
        }
    }

    get skipOptions() {
        const self = this
        return {}
    }

    get riskOptions() {
        const self = this
        return {}
    }

    get expiration() {
        const self = this
        return {
            async enterExpiration(date: string) {
                await self.base.locator(self.waiverLocators.present_tag_all_lots_expiration_textbox).fill(date)
            },
            async verirfyExpiration(value: string) {
                await expect(self.base.locator(self.waiverLocators.present_tag_all_lots_expiration_textbox)).toHaveValue(value)
            },
            async selectHours(valueToSelect: string | number) {
                await self.base.locator(self.waiverLocators.present_tag_all_lots_hoursCrtl_dropdown).click()
                if (typeof (valueToSelect) == 'number') {
                    await actions.select.byIndex(valueToSelect, self.page)
                } else {
                    await actions.select.byText(valueToSelect, self.page)
                }
                return self.base.locator(self.waiverLocators.present_tag_all_lots_hoursCrtl_dropdown).locator('.mat-select-min-line').textContent()
            },
            async verifyHours(expectedValue: string) {
                const actualValue = await self.base.locator(self.waiverLocators.present_tag_all_lots_hoursCrtl_dropdown).locator('.mat-select-min-line').textContent()
                expect(actualValue).toBe(expectedValue)
            },
            async selectMinutes(valueToSelect: string | number) {
                await self.base.locator(self.waiverLocators.present_tag_all_lots_minutesCrtl_dropdown).click()
                if (typeof (valueToSelect) == 'number') {
                    await actions.select.byIndex(valueToSelect, self.page)
                } else {
                    await actions.select.byText(valueToSelect, self.page)
                }
                return self.base.locator(self.waiverLocators.present_tag_all_lots_minutesCrtl_dropdown).locator('.mat-select-min-line').textContent()
            },
            async verifyMinutes(expectedValue: string) {
                const actualValue = await self.base.locator(self.waiverLocators.present_tag_all_lots_minutesCrtl_dropdown).locator('.mat-select-min-line').textContent()
                expect(actualValue).toBe(expectedValue)
            },
            async selectMeridian(value: "AM" | "PM") {
                const loc = self.base.locator(self.waiverLocators.present_tag_all_lots_meridian_button)
                const currentValue = await loc.inputValue()
                if (currentValue != value) {
                    await self.base.locator(self.waiverLocators.present_tag_all_lots_meridian_button).click()
                }
                await expect(loc).toHaveValue(value)
            },
            async verifyMeridianValue(value: "AM" | "PM") {
                const loc = self.base.locator(self.waiverLocators.present_tag_all_lots_meridian_button)
                await expect(loc).toHaveValue(value)
            }
        }
    }
    

    async delete() {
        await this.base.locator(this.waiverLocators.delete_button).click()
        await this.page.click(this.waiverLocators.delete_dialogue_button)
    }

    async submit() {
        await this.base.locator(this.waiverLocators.submit_create_button).click()
    }
}