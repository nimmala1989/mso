import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Comment, CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { Create, Table, APIs } from '../../pages/ruleGroups';

test.describe.serial("On Rules Group Page", async () => {
    let login: Login
    let create: Create
    let authorizationToken: string
    let comment: Comment
    let customWaits: CustomWaits
    let table: Table
    let ruleGroupApis: APIs
    let tempData = { id: "", displayName: "", color: "", Description: "", DynamicSkipWIPLimit: 0, ToolMSOGroup: "", Linksrequiretagcondition: false, Dynamictoolstatuscondition: false }
    let updatedData = { id: "", displayName: "", color: "", Description: "", DynamicSkipWIPLimit: 0, ToolMSOGroup: "", Linksrequiretagcondition: false, Dynamictoolstatuscondition: false }

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        login = new Login(page);
        create = new Create(page);
        comment = new Comment(page)
        customWaits = new CustomWaits(page)
        table = new Table(page)
        ruleGroupApis = new APIs()

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
        await create.navigateToPage()
        await create.openCreatePopup()
        tempData.id = await create.id.enter("testing")
        tempData.displayName = await create.display.enter("testing")
        tempData.color = await create.color.selectRandomColor()
        tempData.Description = await create.enterDescription("testing")
        tempData.DynamicSkipWIPLimit = await create.enterDynamicSkipWIPLimit(34)
        tempData.ToolMSOGroup = (await create.selectMSOToolGroup(1))!
        tempData.Linksrequiretagcondition = await create.linkRequireTagCondition.check()
        tempData.Dynamictoolstatuscondition = await create.dynamicToolStatusCondition.check()
        await create.submit()
        await comment.enterCommentAndSubmit("test rule groups")
        //Verify record is created
        await table.selectRowByName(tempData.id, tempData.displayName)
        await create.openSideDialogue()

    })

    test("Verify Rule Group ID text", async () => {
        await create.id.verify(tempData.id)
    })

    test("Update and Verify Rule Group Display text", async () => {
        await create.display.verify(tempData.displayName)
        updatedData.displayName = await create.display.enter("new display value")
        await create.display.verify(updatedData.displayName)
    })

    test("Update and Verify Rule Group Color text", async () => {
        await create.color.verify(tempData.color)
        updatedData.color = await create.color.selectRandomColor()
        await create.color.verify(updatedData.color)
    })

    test("Update and Verify Rule Group Description text", async () => {

    })

    test("Update and Verify Rule Group Dynamic Skip WIP Limit text", async () => {

    })

    test("Delete, Update and Verify Rule Group Tool MSO Group text", async () => {

    })

    test("Update and Verify Rule Group Links require tag condition text", async () => {

    })

    test("Update and Verify Rule Group Dynamic tool status condition text", async () => {

    })

    test.afterAll(async () => {
        await ruleGroupApis.deleteRuleGroup(tempData.id, authorizationToken)
    })
})