
// playwright.config.ts
import type { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {

    name: 'Chrome Stable',
    
    // timeout options
    timeout: 1800000,

    // Number of times to execution tests if failed
    retries: 0,

    // Location of the test cases
    testDir: __dirname,

    // Test files to ignore
    testIgnore: '**/*ignore',

    // Limit the number of workers on CI, use default locally
    workers: process.env.CI ? 2 : 4,

    // Forbid test.only on CI
    forbidOnly: !!process.env.CI,

    reporter: 'html',

    use: {
        // Browser options
        headless: true,
        browserName: 'chromium',
        channel: 'chrome',
        // Artifacts
        screenshot: 'only-on-failure',
        video: {
            mode: 'retain-on-failure', 
            size: { width: 640, height: 480 }
        },
        trace: 'retry-with-trace',

        // Context options
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
};
export default config;