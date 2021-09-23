import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";

const actions: Action = new Action()
const commonActions: CommonActions = new CommonActions();

export class Table {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectByName(name: string) {
        this.page.click(`mat-cell.mat-column-NAME span:has-text("${name}")`)
    }
}