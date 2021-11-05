import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';
import { Create } from '../../pages/rules/create.po';
import { EditOrView } from '../../pages/rules/editOrView.po';
import { Table } from '../../pages/rules/table.po';

test.describe.only("On Rules Page", async () => {
    let login: Login
    let rules: Rules
    let create: Create
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        create = new Create(page);
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
        await create.processLink()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test('Update rule name and verify', async () => {
        const newName = await editOrView.updateName()
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(newName)
        await editOrView.verifyName(newName)
    })

    test('Update Measure Percent and verify', async () => {
        let [measure, min, max] = [22, 2, 45]
        await editOrView.updateMeasurePercent(measure, min, max)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
        await editOrView.verifyMeasurePercent(measure, min, max)
    })

    test('Update Advance Settings and verify', async () => {
        let [min, max, lot] = [1, 3, 55]
        await editOrView.updateAdvancedSettings(min, max, lot)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
        await editOrView.verifyAdvancedSettings(min, max, lot)
    })

    test('Update Counter Settings and Verify', async () => {
        await editOrView.updateCounterSettings('Prod', 'Tool', 'BACK-T007')
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Process Link Settings and Verify', async () => {
        await editOrView.updateProcessingLinkSettings('STEP1000093143', 'STEP1000177976')
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})