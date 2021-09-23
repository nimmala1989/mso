import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";

const commonActions = new CommonActions();

export class Main {

    page: Page
    actions: Action

    constructor(page: Page) {
        this.page = page
        this.actions = new Action()
    }
}