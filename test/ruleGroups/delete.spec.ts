import { test, BrowserContext } from '@playwright/test';
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
    let context: BrowserContext


    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        const page = await context.newPage();
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

    test("Delete Rule and verify", async () => {
        await create.delete()
        await comment.enterCommentAndSubmit("Delete automated rule group")
        await table.waitForRuleToDisappear(tempData.id, tempData.displayName)
    })
    
    test.afterAll(async ({}) => {
        await context.close()
    })
})