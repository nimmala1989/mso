import { ElementHandle, Page } from "@playwright/test"

export class Action {

    get select() {
        return {
            async valuesFromMutliDropdown(parentLocator: ElementHandle<SVGElement | HTMLElement>, ...valuesToSelect: string[] | number[]) {
                // Open the dropdown
                const dropdownParent = await parentLocator.$('button')
                await dropdownParent?.click()

                // Get all the available options
                const options = await parentLocator.$$(`button + div li`)

                // Select values using rest parameter
                const enterValues = valuesToSelect.map(async (value: any) => {
                    if (typeof value == "string") {
                        const optionByText = await parentLocator.$(`button + div li:has-text("${value}")`)
                        const isSelected = await (await optionByText.$('input')).isChecked()
                        if (!isSelected) {
                            return await optionByText.click()
                        }
                    } else if (typeof value == "number") {
                        const isSelected = await (await options[value].$('input')).isChecked()
                        if (!isSelected) {
                            return await options[value].click()

                        }
                    }
                })
                await Promise.all(enterValues)
            },
            async byIndex(index: number, page: Page) {
                let element = page.locator('div[role="listbox"] [aria-disabled="false"] .mat-option-text').nth(index)
                await element.click()
            },
            async byText(value: string, page: Page) {
                await page.click(`div[role="listbox"] >> text=${value}`);
            }
        }
    }
}