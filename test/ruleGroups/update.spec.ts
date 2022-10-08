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
        tempData.Description = await create.description.enter("testing")
        tempData.DynamicSkipWIPLimit = await create.dynamicSkipWIPLimit.enter(34)
        tempData.ToolMSOGroup = (await create.msoToolGroup.select(1))!
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

    test.skip("Update and Verify Rule Group Color text", async () => {
        await create.color.verify(tempData.color)
        updatedData.color = await create.color.selectRandomColor()
        await create.color.verify(updatedData.color)
    })

    test("Update and Verify Rule Group Description text", async () => {
        await create.description.verify(tempData.Description)
        updatedData.Description = await create.description.enter("new Description value")
        await create.description.verify(updatedData.Description)
    })

    test("Update and Verify Rule Group Dynamic Skip WIP Limit text", async () => {
        await create.dynamicSkipWIPLimit.verify(tempData.DynamicSkipWIPLimit)
        updatedData.DynamicSkipWIPLimit = await create.dynamicSkipWIPLimit.enter(234)
        await create.dynamicSkipWIPLimit.verify(updatedData.DynamicSkipWIPLimit)
    })

    test("Delete, Update and Verify Rule Group Tool MSO Group text", async () => {
        await create.msoToolGroup.verify(tempData.ToolMSOGroup)
        updatedData.ToolMSOGroup = (await create.msoToolGroup.select(1))!
        await create.msoToolGroup.verify(updatedData.ToolMSOGroup)

        await create.msoToolGroup.removeAndVerify()
    })

    test("Update and Verify Rule Group Links require tag condition boolean", async () => {
        await create.linkRequireTagCondition.verify(tempData.Linksrequiretagcondition)
        updatedData.Linksrequiretagcondition = await create.linkRequireTagCondition.uncheck()
        await create.linkRequireTagCondition.verify(updatedData.Linksrequiretagcondition)
    })

    test("Update and Verify Rule Group Dynamic tool status condition boolean", async () => {
        await create.dynamicToolStatusCondition.verify(tempData.Dynamictoolstatuscondition)
        updatedData.Dynamictoolstatuscondition = await create.dynamicToolStatusCondition.uncheck()
        await create.dynamicToolStatusCondition.verify(updatedData.Dynamictoolstatuscondition)
    })

    test.afterAll(async () => {
        await ruleGroupApis.deleteRuleGroup(tempData.id, authorizationToken)
    })
})