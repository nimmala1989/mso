
// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {

    name: 'Chrome Stable',

    
    // timeout options
    timeout: 120000,
    globalTimeout: 3000000,

    // Number of times to execution tests if failed
    retries: 0,

    // Location of the test cases
    testDir: __dirname,

    // Test files to ignore
    testIgnore: '**/*ignore',

    // Limit the number of workers on CI, use default locally
    workers: process.env.CI ? 2 : undefined,

    // Forbid test.only on CI
    forbidOnly: !!process.env.CI,

    use: {
        // Browser options
        headless: false,
        browserName: 'chromium',
        channel: 'chrome',
        // Artifacts
        screenshot: 'on',
        video: 'on',
        trace: 'retry-with-trace',

        // Context options
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
};
export default config;