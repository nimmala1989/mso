import { Page, test } from '@playwright/test';
import { Endpoints } from '../../config/setup'
import { Login } from '../../pages/login.po';
import { Rules } from '../../pages/rules/rules.po';
import { Create } from '../../pages/rules/create.po';
import { EditOrView } from '../../pages/rules/editOrView.po';
import { Table } from '../../pages/rules/table.po';
import { Post } from "../../pages/apis/post"
import { BulkActions } from "../../pages/rules/bulkAction.po"

test.describe("On Rules Page", async () => {
    let current_page: Page
    let login: Login
    let rules: Rules
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string
    let post: Post
    let bulkActions: BulkActions
    let rulesData: { name: string, id: string }[] = []

    test.beforeEach(async ({ page }) => {
        current_page = page
        login = new Login(page);
        rules = new Rules(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        post = new Post()
        bulkActions = new BulkActions(page)
        page.on('request', async request => {
            let allHeaders = await request.allHeaders()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication('qauser1', 'monozukuri')
        await login.selectClient('FAB2')
        await rules.waitForPageLoad()

        // Create rule 1
        let rule1 = await post.createRuleWithPostRequest(authorizationToken)
        let rule2 = await post.createRuleWithPostRequest(authorizationToken)
        let rule3 = await post.createRuleWithPostRequest(authorizationToken)
        rulesData.push(rule1);
        rulesData.push(rule2);
        rulesData.push(rule3);
        await current_page.reload()
        await table.selectCheckboxByName(rulesData[0].name)
        await table.selectCheckboxByName(rulesData[1].name)
        await table.selectCheckboxByName(rulesData[2].name)
    })

    test.only("Perform bulk edit and verify all the rules are updated", async () => {
        await bulkActions.selectEdit()
        await bulkActions.editExpirationDate()
        await bulkActions.clickSave()
        await bulkActions.commentAndSave()
    })

    test("Perform bulk delete and verify all the rules are delete", async () => {

    })

    test("Perform bulk disable and verify all the rules are disabled", async () => {

    })

    test("Perform bulk enable and verify all the rules are enabled", async () => {

    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})