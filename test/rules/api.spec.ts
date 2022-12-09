import { BrowserContext, Page, test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { Post } from "../../pages/apis/post";
import { Login } from '../../pages/login.po';

test.describe.serial("On Rules Page", async () => {
    let current_page: Page
    let login: Login
    let authorizationToken: string
    let post: Post
    let rulesData: { name: string, id: string }[] = []
    let context: BrowserContext

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        const page = await context.newPage();
        current_page = page
        login = new Login(page);
        post = new Post()

        page.on('request', async request => {
            let allHeaders = await request.allHeaders()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication()
        await login.selectClient('FAB2')
        

        // Create rule 1
        let rule1 = await post.createRuleWithPostRequest(authorizationToken)
        let rule2 = await post.createRuleWithPostRequest(authorizationToken)
        let rule3 = await post.createRuleWithPostRequest(authorizationToken)
        rulesData.push(rule1);
        rulesData.push(rule2);
        rulesData.push(rule3);
        await current_page.reload()
    })

    test("Perform bulk edit and verify all the rules are updated", async () => {
        console.log(rulesData)
    })


    test.afterAll(async ({}) => {
        await context.close()
    })
})