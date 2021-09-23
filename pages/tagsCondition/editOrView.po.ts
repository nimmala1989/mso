import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";

const commonActions = new CommonActions();

export class EditOrView {

    page: Page
    actions: Action

    constructor(page: Page) {
        this.page = page
        this.actions = new Action()
    }

    async getForm() {
        return this.page.waitForSelector('mat-drawer-container mat-drawer.mat-drawer app-tag-conditions-form')
    }

    async name() {
        const form = await this.getForm()
        const name = await form.waitForSelector('#tagName')
        return {
            async enter(value: string) {
               await name.fill(value);
            },
            async verify(value: string) {
                await expect(await form.$eval('id=tagName', el => el["value"])).toEqual(value)
            }
        }
    }
}