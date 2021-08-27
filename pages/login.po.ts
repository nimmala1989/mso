
import { Page } from "@playwright/test"
export class Login {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async loginToTheApplication(username: string, password: string) {
        const [loginPopup] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.page.waitForNavigation(/*{ url: 'https://demo.finalphasesystems.com/securitynew/Account/Login?ReturnUrl=%2Fsecuritynew%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DINFICON%26redirect_uri%3Dhttps%253A%252F%252Fdemo.finalphasesystems.com%252FMSO%252F%2523%252Fsignin%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520resourceapi%26state%3D6f995fff32f54715962731617c0e35b1%26code_challenge%3DtxyOWbw2JL60v22Slgix1WWUvYvkfpdtGv8Kb0tTDdY%26code_challenge_method%3DS256%26display%3Dpopup%26response_mode%3Dquery' }*/),
            this.page.click('[placement="right"] .fa-sign-in-alt')
        ]);

        await loginPopup.fill('[placeholder="Username"]', 'qauser1');
        await loginPopup.fill('[placeholder="Password"]', 'monozukuri');
        await loginPopup.click('[value="login"]');
        await this.page.waitForLoadState("networkidle", { timeout: 120000 });
    }

    async clickCreateRule() {
        await this.page.click('button')
    }

    async selectClient(client: 'FAB1' | 'FAB2' | 'PTEST' | 'FTEST') {
        await this.page.click(`text=${client}`);
    }
}