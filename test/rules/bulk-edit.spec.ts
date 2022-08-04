import { Page, test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Post } from "../../pages/apis/post";
import { Login } from '../../pages/login.po';
import { BulkActions, EditOrView, Table } from '../../pages/rules';
import { Comment, CustomWaits } from '../../pages/common';

test.describe("On Rules Page", async () => {
    let current_page: Page
    let login: Login
    let editOrView: EditOrView
    let table: Table
    let authorizationToken: string
    let post: Post
    let bulkActions: BulkActions
    let comment: Comment
    let customWaits: CustomWaits
    let rulesData: { name: string, id: string }[] = []

    test.beforeEach(async ({ page }) => {
        current_page = page
        login = new Login(page);
        editOrView = new EditOrView(page);
        table = new Table(page);
        post = new Post()
        bulkActions = new BulkActions(page)
        comment = new Comment(page)
        customWaits = new CustomWaits(page)

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

    test("Perform bulk edit and verify all the rules are updated", async () => {
        await bulkActions.selectEdit()
        await bulkActions.editExpirationDate()
        await bulkActions.clickSave()
        await bulkActions.commentAndSave()
    })

    test("Perform bulk delete and verify all the rules are delete", async () => {
        await bulkActions.selectDelete()
        await bulkActions.commentAllAndSave()
    })

    test("Perform bulk disable and verify all the rules are disabled", async () => {

    })

    test("Perform bulk enable and verify all the rules are enabled", async () => {

    })

    test.afterAll(async () => {
        await editOrView.deleteRulesCreateByAutomation(authorizationToken)
    })
})