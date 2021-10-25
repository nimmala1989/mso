import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup'
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
    let authorizationToken: string

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        rules = new Rules(page);
        create = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        page.on('request', request => {
            let allHeaders = request.headers()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()
    })

    test.describe('Create a new rule', async () => {
        test("Create a percent rule with mandatory fields and verify it is created", async () => {
            await rules.openRulesPopup()
            await create.percentageRule()
            await table.selectByName(create.data.name)
            await editOrView.verifyName(create.data.name)
        })

        test("Create a event rule with mandatory fields and verify it is created", async () => {
            await rules.openRulesPopup()
            await create.eventRule()
            await table.selectByName(create.data.name)
            await editOrView.verifyName(create.data.name)
        })

        test("Create a time rule with mandatory fields and verify it is created", async () => {
            await rules.openRulesPopup()
            await create.timeRule()
            await table.selectByName(create.data.name)
            await editOrView.verifyName(create.data.name)
        })

        test("Create a rule including process links and verify it is created", async () => {
            await rules.openRulesPopup()
            await create.processLink()
            await table.selectByName(create.data.name)
            await editOrView.verifyName(create.data.name)

        })
    })

    test.describe('For Negative scenarios', async () => {
        test("Check that rules with duplicate name cannot be created", async () => {
            await rules.openRulesPopup()
            await create.percentageRule()
            await table.selectByName(create.data.name)
            await rules.openRulesPopup()
            await create.verifyDuplicateRuleErrorMessage(create.data.name)
        })

        test("Check that error displayed with wrong percentage", async () => {
            await rules.openRulesPopup()
            await create.tryToCreateRuleWithWrongPercentageAndVerifyError()
        })

        test.describe('For Advance Settings', async () => {
            test('Verify different error messages', async () => {
                await rules.openRulesPopup();
                const errorMessages = await create.advanceSettingsErrorMessages();
                await errorMessages.verifyMaximumCannotBeGreaterThanLot()
                await errorMessages.verifyMinimumCannotBeGreaterThanLot()
                await errorMessages.verifyMinimumCannotBeGreaterThanMaximum()
                await errorMessages.verifyPercentageMustBeBetweenMinAndMax()
            })
        })

        test.describe('For Expiration field', async () => {

            test('Verify Expiration date cannot be empty', async () => {
                await rules.openRulesPopup();
                const errorMessages = await create.expirationErrorMessages();
                await errorMessages.verifyEmptyExpireDateErrorMessage()
                await errorMessages.verifyWarningAndExpirationDateCannotBeSame()
                await errorMessages.verifyWarningDateMustBeBeforeExpirationDate()
            })
        })
    })

    test.describe('Update an existing rule', async () => {
        test('Update rule name and verify', async () => {
            await rules.openRulesPopup()
            await create.percentageRule()
            await table.selectByName(create.data.name)
            await editOrView.verifyName(create.data.name)
            const newName = await editOrView.updateName()
            await editOrView.clickSave()
            await editOrView.commentAndSave()
            await table.selectByName(newName)
            await editOrView.verifyName(newName)
        })
    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})