import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Comment, CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { WaiverPage, Table, APIs } from '../../pages/waivers';

test.describe.serial("On Rules Group Page", async () => {
    let login: Login
    let waiver: WaiverPage
    let authorizationToken: string
    let comment: Comment
    let customWaits: CustomWaits
    let table: Table
    let api: APIs
    type WaiverData = {
        [key: string]: any;
    };
    let tempData: WaiverData = { type: "", tool: "", rulename: "", Description: "", present: {}, skip: {}, risk: {} }

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        waiver = new WaiverPage(page);
        comment = new Comment(page)
        customWaits = new CustomWaits(page)
        table = new Table(page)
        api = new APIs()

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
        await page.pause()
    })

    test("Create ", async () => {
        await waiver.navigateToPage()
        await waiver.openCreatePopup()
        tempData.type = await waiver.type.selectPresent()
        tempData.tool = (await waiver.tool.select(0))!
        tempData.rulename = (await waiver.ruleName.select(0))!
        const options = await waiver.presetOptions.selectAllLotsTag()
        tempData.present["expirationDate"] = await options.enterExpiration("3/23/2023")
        tempData.present["hours"] = await options.selectHours("7")
        tempData.present["minute"] = await options.selectMinutes("07")
        tempData.present["meridian"] = await options.selectMeridian("AM")
        tempData.Description = await waiver.description.enter("testing")
        await waiver.submit()
        await comment.enterCommentAndSubmit("test rule groups")
        //Verify record is created
        await table.selectRowByName(tempData.tool)
    })

    test.afterEach(async () => {
        await api.deleteWaiveer(tempData.tool, authorizationToken)
    })
})