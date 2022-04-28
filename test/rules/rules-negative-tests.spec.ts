import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Comment, CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { Create, EditOrView, Table } from '../../pages/rules';

test.describe.parallel("On Rules Page", async () => {
    let login: Login
    let create: Create
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string
    let comment: Comment
    let customWaits: CustomWaits

    test.beforeEach(async ({ page }) => {
        login = new Login(page);
        create = new Create(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        comment = new Comment(page)
        customWaits = new CustomWaits(page)
        
        page.on('request', async request => {
            let allHeaders = await request.allHeaders()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await customWaits.waitForFiltersToLoad()
    })

    test("Check that rules with duplicate name cannot be created", async () => {
        const listOfExistingRules = await editOrView.getRules()
        await create.openRulesPopup()
        await create.verifyDuplicateRuleErrorMessage(listOfExistingRules[0].smpRuleName)
    })

    test("Check that error displayed with wrong percentage", async () => {
        await create.openRulesPopup()
        await create.tryToCreateRuleWithWrongPercentageAndVerifyError()
    })

    test('Verify different error messages', async () => {
        await create.openRulesPopup();
        const errorMessages = await create.advanceSettingsErrorMessages();
        await errorMessages.verifyMaximumCannotBeGreaterThanLot()
        await errorMessages.verifyMinimumCannotBeGreaterThanLot()
        await errorMessages.verifyMinimumCannotBeGreaterThanMaximum()
        await errorMessages.verifyPercentageMustBeBetweenMinAndMax()
    })

    test('Verify Expiration date cannot be empty', async () => {
        await create.openRulesPopup();
        const errorMessages = await create.expirationErrorMessages();
        await errorMessages.verifyEmptyExpireDateErrorMessage()
        await errorMessages.verifyWarningAndExpirationDateCannotBeSame()
        await errorMessages.verifyWarningDateMustBeBeforeExpirationDate()
    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})