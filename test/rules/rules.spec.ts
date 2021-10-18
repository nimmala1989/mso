import { test } from '@playwright/test';
import { pageUrl } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';
import { Create } from '../../pages/rules/create.po';
import { EditOrView } from '../../pages/rules/editOrView.po';
import { Table } from '../../pages/rules/table.po';

test.describe("On Rules Page", async () => {
    let login: Login
    let rules: Rules
    let create: Create
    let editOrView: EditOrView
    let table: Table

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        create = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);

        await page.goto(pageUrl, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()
    })

    test.describe('Create a new rule', async () => {
        test("Create a percent rule with mandatory fields and verify it is created", async ({ page }) => {
            await rules.openRulesPopup()
            await create.percentageRule()
            await table.selectByName(create.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await editOrView.verifyName(create.data.name)
        })

        test("Create a event rule with mandatory fields and verify it is created", async ({ page }) => {
            await rules.openRulesPopup()
            await create.eventRule()
            await table.selectByName(create.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await editOrView.verifyName(create.data.name)
        })

        test("Create a time rule with mandatory fields and verify it is created", async ({ page }) => {
            await rules.openRulesPopup()
            await create.timeRule()
            await table.selectByName(create.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await editOrView.verifyName(create.data.name)
        })

        test("Create a rule including process links and verify it is created", async ({ page }) => {
            await rules.openRulesPopup()
            await create.processLink()
            await table.selectByName(create.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await editOrView.verifyName(create.data.name)

        })
    })

    test.describe('For Negative scenarios', async () => {
        test("Check that rules with duplicate name cannot be created", async ({ page }) => {
            await rules.openRulesPopup()
            await create.percentageRule()
            await table.selectByName(create.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await rules.openRulesPopup()
            await create.verifyDuplicateRuleErrorMessage(create.data.name)
        })

        test("Check that error displayed with wrong percentage", async ({ page }) => {
            await rules.openRulesPopup()
            await create.tryToCreateRuleWithWrongPercentageAndVerifyError()
        })

        test.describe('For Advance Settings', async () => {

            test('Verify Maximum Cannot be greater than lot error', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.advanceSettingsErrorMessages();
                errorMessages.verifyMaximumCannotBeGreaterThanLot()
            })

            test('Verify minimum Cannot be greater than lot error', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.advanceSettingsErrorMessages();
                errorMessages.verifyMinimumCannotBeGreaterThanLot()
            })

            test('Verify minimum cannot be greater than maximum', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.advanceSettingsErrorMessages();
                errorMessages.verifyMinimumCannotBeGreaterThanMaximum()
            })

            test('Verify percentage must be between min and max', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.advanceSettingsErrorMessages();
                errorMessages.verifyPercentageMustBeBetweenMinAndMax()
            })
        })

        test.describe('For Expiration field', async () => {

            test('Verify Expiration date cannot be empty', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.expirationErrorMessages();
                errorMessages.verifyEmptyExpireDateErrorMessage()
            })
            test('Verify Warning and expiration dates cannot be same', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.expirationErrorMessages();
                errorMessages.verifyWarningAndExpirationDateCannotBeSame()
            })
            test('Verify Warning date must be before expiration date', async ({ page }) => {
                await rules.openRulesPopup();
                const errorMessages = await create.expirationErrorMessages();
                errorMessages.verifyWarningDateMustBeBeforeExpirationDate()
            })
        })
    })

    test.describe('Update an existing rule', async () => {

        test.only('Update rule name and verify', async ({ page }) => {
            await rules.openRulesPopup()
            await createOrUpdate.percentageRule()
            await table.selectByName(createOrUpdate.data.name)
            await page.waitForSelector('mat-drawer[mode="side"]')
            await editOrView.verifyName(createOrUpdate.data.name)
            await createOrUpdate.enterName()
        })
    })
})


