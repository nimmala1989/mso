import { expect } from '@playwright/test'

export class CommonActions {

    page?: any
    context?: any
    successStatusRegex: RegExp
    failures: boolean = false
    failureStatus: any = new Map()
    failedUrlAndStatus: string[] = []


    constructor(page: any, context?: any) {
        this.page = page
        this.context = context
        this.successStatusRegex = new RegExp('[1-3][0-9][0-9]')
    }

    async loadNewPageAndAssertAllTheNetworkRequests(newPage?: any) {
        if (newPage) {
            this.page = newPage;
        }

        // Url's to avoid
        await this.page.route("**/mini-profiler-resources/results", (request: { fulfill: (arg0: { status: number; contentType: string; body: string }) => any }) => request.fulfill({
            status: 200,
            contentType: 'text/plain',
            body: 'Not Found!'
        }))

        await this.page.route("**/blank.htm", (request: { fulfill: (arg0: { status: number; contentType: string; body: string }) => any }) => request.fulfill({
            status: 200,
            contentType: 'text/plain',
            body: 'Not Found!'
        }))

        await this.page.route("**/images/icon-small-excel.png", (request: { fulfill: (arg0: { status: number; contentType: string; body: string }) => any }) => request.fulfill({
            status: 200,
            contentType: 'text/plain',
            body: 'Not Found!'
        }))

        // Wait for the response to completed and if failed, store the data above
        this.page.on('response', (res: { status: () => { (): any; new(): any; toString: { (): string; new(): any } }; url: () => any }) => {
            // console.log(`${res.url()} -> , ${res.status()}`)
            if (!this.successStatusRegex.test(res.status().toString())) {
                // Mark the failures to be true
                this.failures = true

                // Note down the error codes
                if (this.failureStatus.has(res.status())) {
                    let currentCount = this.failureStatus.get(res.status())
                    this.failureStatus.set(res.status(), ++currentCount)
                } else {
                    this.failureStatus.set(res.status(), 1)
                }

                // store the failed urls with status code
                this.failedUrlAndStatus.push(`${res.url()} -> ${res.status()}`)
            }
        })
    }

    async verifyNetworkRequests() {
        // Verify all the apis have 200 status code
        await this.page.reload()
        expect(this.failedUrlAndStatus).toStrictEqual([])
        expect(this.failures).toBeFalsy()
    }
}
