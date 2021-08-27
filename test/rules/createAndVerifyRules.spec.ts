import { test, expect } from '@playwright/test';
import { pageUrl } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';

test.describe("On Rules Page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl, { timeout: 120000, waitUntil: 'load' })
    })

    test("Create a rule with mandatory fields", async ({ page }) => {
        const login: Login = new Login(page);
        const rules: Rules = new Rules(page);
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.openRulesPopup()
        await rules.createNewRule()
    })
})


