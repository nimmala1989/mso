import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";

const actions: Action = new Action()
const commonActions: CommonActions = new CommonActions();

export class Context {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectValueByIndex(index: number) {
        let element = this.page.locator('div[role="listbox"] [aria-disabled="false"] .mat-option-text').nth(index)
        await element.click()
    }

    async selectProdMsoGroup(valueToSelect: string | number = 0) {
        await this.page.click('#prdMsoGroupEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectProd(valueToSelect: string | number = 0) {
        await this.page.click('#prdEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectRouteMsoGroup(valueToSelect: string | number = 0) {
        await this.page.click('#routeMsoGroupEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectRoute(valueToSelect: string | number = 0) {
        await this.page.click('#routeEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectPlanPriority(valueToSelect: string | number = 0) {
        await this.page.click('#planPriorityNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectLotMsoGroup(valueToSelect: string | number = 0) {
        await this.page.click('#lotMsoGroupEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectLotGroup(valueToSelect: string | number = 0) {
        await this.page.click('#lotGroupEachNa');
        if (typeof (valueToSelect) == 'number') {
            this.selectValueByIndex(valueToSelect)
        } else {
            await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
        }
    }

    async selectLotParameters(name: string, value: string) {
        await this.page.fill('#lotName', name);
        await this.page.fill('#lotValue', value);
    }

    async getSelectedContext() {
        return this.page.textContent('[formarrayname="contexts"]')
    }

    async clickOk() {
        await this.page.click('button:has-text("Ok")')
    }

    async clickCancel() {
        await this.page.click('button:has-text("Cancel")')
    }
}