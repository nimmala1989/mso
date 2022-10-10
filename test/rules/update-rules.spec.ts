import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Comment, CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { Create, EditOrView, Table } from '../../pages/rules';

test.describe.serial("On Rules Page", async () => {
    let login: Login
    let create: Create
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string
    let comment: Comment
    let customWaits: CustomWaits

    let udpatedData = {name: ""}
    let data = {name: ""}

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        login = new Login(page);
        create = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        comment = new Comment(page)
        customWaits = new CustomWaits(page)
        
        page.on('request', async request => {
            let allHeaders = await request.allHeaders()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication()
        await login.selectClient('FAB2')
        await customWaits.waitForFiltersToLoad()
        await create.openRulesPopup()
        await create.ruleWithAllFields()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test.beforeEach(async () => {
        await table.closeSideModule()
    })

    test('Update rule name and verify', async () => {
        await table.selectByName(create.data.name)
        udpatedData.name = await editOrView.updateName()
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await customWaits.waitForFiltersToLoad()
        await table.selectByName(udpatedData.name)
        await editOrView.verifyName(udpatedData.name)
    })

    test('Update Measure Percent and verify', async () => {
        await table.selectByName(udpatedData.name)
        let [measure, min, max] = [22, 2, 45]
        await editOrView.updateMeasurePercent(measure, min, max)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await customWaits.waitForFiltersToLoad()
        await table.selectByName(create.data.name)
        await editOrView.verifyMeasurePercent(measure, min, max)
    })

    test('Update Advance Settings and verify', async () => {
        await table.selectByName(udpatedData.name)
        let [min, max, lot] = [1, 3, 55]
        await editOrView.updateAdvancedSettings(min, max, lot)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
        await editOrView.verifyAdvancedSettings(min, max, lot)
    })

    test('Update Counter Settings and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateCounterSettings('Prod', 'Tool')
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Process Link Settings and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateProcessingLinkSettings()
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Global Tag conditions and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateGlobalTabCondition()
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Tag conditions and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateTagCondition('0000test1', 2)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Dependent Processes and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateDependentProcess(0, 2)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test('Update Process Subs and Verify', async () => {
        await table.selectByName(udpatedData.name)
        await editOrView.updateProcessSubs(1)
        await editOrView.clickSave()
        await editOrView.commentAndSave()
        await table.selectByName(create.data.name)
    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})