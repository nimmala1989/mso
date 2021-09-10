import { test } from '@playwright/test';
import { pageUrl } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';

test.describe("On Rules Page", async () => {
    let login: Login 
    let rules: Rules 

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        await page.pause()
        await page.goto(pageUrl, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()
    })

    test("Create a rule with mandatory fields and verify", async ({ page }) => {
        await rules.openRulesPopup()
        await rules.createNewRule()
        await rules.rulesTable.selectByName(rules.newRuleData.name)
        await page.waitForSelector('mat-drawer[mode="side"]')
        await rules.matDrawer.verifyName(rules.newRuleData.name)
    })
})


