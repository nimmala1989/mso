import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';
import { Create } from '../../pages/rules/create.po';
import { EditOrView } from '../../pages/rules/editOrView.po';
import { Table } from '../../pages/rules/table.po';

test.describe("On Rules Page", async () => {
    let login: Login
    let rules: Rules
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string

    let rule1: Create
    let rule2: Create
    let rule3: Create

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        rule1 = new Create(page);
        rule2 = new Create(page);
        rule3 = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        page.on('request', request => {
            let allHeaders = request.headers()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()
        await rules.openRulesPopup()

        // Create rule 1
        await rule1.ruleWithAllFields()
        await table.selectByName(rule1.data.name)
        await editOrView.verifyName(rule1.data.name)
        // Create rule 2
        await rule2.ruleWithAllFields()
        await table.selectByName(rule2.data.name)
        await editOrView.verifyName(rule2.data.name)
        // Create rule 3
        await rule3.ruleWithAllFields()
        await table.selectByName(rule3.data.name)
        await editOrView.verifyName(rule3.data.name)
    })

    test("Perform bulk edit and verify all the rules are updated", async () => {
        await rules.openRulesPopup()
        // await create.percentageRule()
        // await table.selectByName(create.data.name)
        // await editOrView.verifyName(create.data.name)
    })

    test("Perform bulk delete and verify all the rules are delete", async () => {
        await rules.openRulesPopup()
        // await create.eventRule()
        // await table.selectByName(create.data.name)
        // await editOrView.verifyName(create.data.name)
    })

    test("Perform bulk disable and verify all the rules are disabled", async () => {
        await rules.openRulesPopup()
        // await create.timeRule()
        // await table.selectByName(create.data.name)
        // await editOrView.verifyName(create.data.name)
    })

    test("Perform bulk enable and verify all the rules are enabled", async () => {
        await rules.openRulesPopup()
        // await create.processLink()
        // await table.selectByName(create.data.name)
        // await editOrView.verifyName(create.data.name)
    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})