import { test } from '@playwright/test';
import { pageUrl } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';
import { Create } from '../../pages/rules/create.po';
import { EditOrView } from '../../pages/rules/editOrView.po';
import { Table } from '../../pages/rules/table.po';

test.describe("On Rules Page", async () => {
    let login: Login 
    let rules: Rules
    let create: Create
    let editOrView: EditOrView
    let table: Table

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        create = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);

        await page.goto(pageUrl, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()
    })

    test("Create a percent rule with mandatory fields and verify", async ({ page }) => {
        await rules.openRulesPopup()
        await create.percentageRule()
        await table.selectByName(create.data.name)
        await page.waitForSelector('mat-drawer[mode="side"]')
        await editOrView.verifyName(create.data.name)
    })

    test("Create a event rule with mandatory fields and verify", async ({ page }) => {
        await rules.openRulesPopup()
        await create.eventRule()
        await table.selectByName(create.data.name)
        await page.waitForSelector('mat-drawer[mode="side"]')
        await editOrView.verifyName(create.data.name)
    })

    test("Create a time rule with mandatory fields and verify", async ({ page }) => {
        await rules.openRulesPopup()
        await create.timeRule()
        await table.selectByName(create.data.name)
        await page.waitForSelector('mat-drawer[mode="side"]')
        await editOrView.verifyName(create.data.name)
    })

    test("Check that rules with duplicate name cannot be created", async ({ page }) => {
        await rules.openRulesPopup()
        await create.percentageRule()
        await table.selectByName(create.data.name)
        await page.waitForSelector('mat-drawer[mode="side"]')
        await rules.openRulesPopup()
        await create.verifyDuplicateRuleErrorMessage(create.data.name)
    })

    test.only("Check that error displayed with wrong percentage", async ({ page }) => {
        await rules.openRulesPopup()
        await create.tryToCreateRuleWithWrongPercentageAndVerifyError()
    })
})


