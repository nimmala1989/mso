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

    test.beforeEach(async ({ page }) => {
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
    })

    test("Create a percent rule with mandatory fields and verify it is created", async () => {
        await create.openRulesPopup()
        await create.percentageRule()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test("Create a event rule with mandatory fields and verify it is created", async () => {
        await create.openRulesPopup()
        await create.eventRule()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test("Create a time rule with mandatory fields and verify it is created", async () => {
        await create.openRulesPopup()
        await create.timeRule()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test("Create a rule including process links and verify it is created", async () => {
        await create.openRulesPopup()
        await create.processLink()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test('Create a rule with all the fields and verify it is created', async () => {
        await create.openRulesPopup()
        await create.ruleWithAllFields()
        await table.selectByName(create.data.name)
        await editOrView.verifyName(create.data.name)
    })

    test.afterEach(async () => {
        let id1 = await editOrView.getRuleId(create.data.name)
        await editOrView.deleteRules(id1, authorizationToken)
    })
})