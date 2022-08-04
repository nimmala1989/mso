import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Create } from '../../pages/tagsCondition/create.po'
import { Comment, CustomWaits } from '../../pages/common';

test.describe("On Rules Page", async () => {
    let login: Login 
    let customWaits: CustomWaits
    let tagCondition: Create;
    let authorizationToken: any

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        customWaits = new CustomWaits(page);
        tagCondition =  new Create(page);

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

    test('Create Tag conditions and verify', async() => {
        await tagCondition.navigateToPage()
        await tagCondition.openCreatePopup()
        await tagCondition.enterName("testing")
        await tagCondition.selectType("Never")
        await tagCondition.selectEnable()
        // await tagCondition.enterExpiration('7/22/2022')
        const contextFields = await tagCondition.openContexts()
        await contextFields.selectProd('PRD100321280')
        await contextFields.clickOk()
        await tagCondition.submit()
        await tagCondition.enterComment()
    })
})


