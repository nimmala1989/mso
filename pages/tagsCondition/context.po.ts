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

    async selectProdMsoGroup(valueToSelect: string) {
        await this.page.click('#prdMsoGroupEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectProd(valueToSelect: string) {
        await this.page.click('#prdEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectRouteMsoGroup(valueToSelect: string) {
        await this.page.click('#routeMsoGroupEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectRoute(valueToSelect: string) {
        await this.page.click('#routeEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectPlanPriority(valueToSelect: string) {
        await this.page.click('#planPriorityNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectLotMsoGroup(valueToSelect: string) {
        await this.page.click('#lotMsoGroupEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectLotGroup(valueToSelect: string) {
        await this.page.click('#lotGroupEachNa');
        await this.page.click(`div[role="listbox"] >> text=${valueToSelect}`);
    }

    async selectLotParameters(name: string, value: string) {
        await this.page.fill('#lotName', name);
        await this.page.fill('#lotValue', value);
    }

    async clickOk() {
        await this.page.click('button:has-text("Ok")')
    }

    async clickCancel() {
        await this.page.click('button:has-text("Cancel")')
    }
}