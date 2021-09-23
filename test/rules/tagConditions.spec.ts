// import { test } from '@playwright/test';
// import { pageUrl } from '../../config/setup'
// import { Login } from '../../pages/login.po';
// import { Rules } from '../../pages/rules/rules.po';
// import {  } from '../../pages/tagsCondition/index';

// test.describe("On Rules Page", async () => {
//     let login: Login 
//     let rules: Rules
//     let tagCondition: Create;

//     test.beforeEach(async ({ page }) => {
//         login = new Login(page);
//         rules = new Rules(page);
//         tagCondition =  new Create(page);
//         await page.goto(pageUrl, { timeout: 120000, waitUntil: 'load' });
//         await login.loginToTheApplication('qauser1', 'monozukuri')
//         await login.selectClient('FAB2')
//         await rules.waitForPageLoad()
//     })

//     test('Create Tag conditions and verify', async({page}) => {
//         await tagCondition.navigateToPage()
//         await tagCondition.openCreatePopup()
//         await tagCondition.enterName("testing")
//         await tagCondition.selectType("Never")
//         await tagCondition.selectEnable()
//         await tagCondition.enterExpiration('7/22/2022')
//         const contextFields = await tagCondition.openContexts()
//         await contextFields.selectProd('PRD100321280')
//         await contextFields.clickOk()
//         await tagCondition.submit()
//         await tagCondition.enterComment()
//         await 
//     })
// })


