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
    let tempData = { id: "", displayName: "", color: "" }

    test.beforeEach(async ({ page }) => {
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
    })

    test("Create a percent rule with mandatory fields and verify it is created", async () => {
        await create.navigateToPage()
        await create.openCreatePopup()
        tempData.id = await create.id.enter("testing")
        tempData.displayName = await create.display.enter("testing")
        tempData.color = await create.color.selectRandomColor()
        await create.enterDescription("testing")
        await create.enterDynamicSkipWIPLimit(34)
        await create.selectMSOToolGroup(1)
        await create.linkRequireTagCondition.check()
        await create.dynamicToolStatusCondition.check()
        await create.submit()
        await comment.enterCommentAndSubmit("test rule groups")
        //Verify record is created
        await table.selectRowByName(tempData.id, tempData.displayName)
    })

    test.afterEach(async () => {
        await ruleGroupApis.deleteRuleGroup(tempData.id, authorizationToken)
    })
})