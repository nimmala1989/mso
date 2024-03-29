import { expect, Page } from '@playwright/test';
import { Common } from './common.po'
import { Comment } from '../common/comment.po'
import { CommonActions } from '../../utilities/common';

export class Create {

    page: Page
    data: any
    comment: Comment
    form: Common

    constructor(page: Page) {
        this.page = page
        this.data = ''
        this.comment = new Comment(page)
        this.form = new Common(this.page, 'create')
    }

    async openRulesPopup() {
        await this.page.waitForSelector('mat-dialog-container #rule-form-container', { state: 'detached' })
        await this.page.click('button:has-text("Create a rule")', { force: true });
    }

    async closeRulesPopup() {
        await this.page.locator('[aria-label="Close"]').click();
        await this.page.locator('button:has-text("Yes")').click();
    }

    async instantiate() {
        await this.form.instantiate()
    }

    async enterName(name: string = `Testing - ${CommonActions.randomString(4)}`) {
        await this.form.ruleName.enter(name);
    }

    async selectRuleGroup(groupToSelect: string) {
        await this.form.ruleGroup.select(groupToSelect);
    }

    async enterDescription(desc: string = `Creating rules with automation - ${CommonActions.randomString(4)}`) {
        await this.form.description.enter(desc);
    }

    async enterPercentages(measure: number, min: number, max: number) {
        await this.form.type.select('Percent');
        await this.form.measure.enter(measure.toString());
        await this.form.betweenMin.enter(min.toString());
        await this.form.betweenMax.enter(max.toString());
    }

    async enterEvent(lotNumber: number, eventToSelect: string) {
        await this.form.type.select('Event');
        await this.form.measure.enterLot(lotNumber.toString());
        await this.form.event.select(eventToSelect)
    }

    async enterTime(time: number) {
        await this.form.type.select('Time');
        await this.form.measure.enterTime(time.toString());
    }

    async enterAdvancedSettings(min: number, max: number, noOfLogs: number) {
        await this.form.advancedSettings.select()
        await this.form.advancedSettings.enterMinimumConsecutiveSkips(min.toString())
        await this.form.advancedSettings.enterMaximumConsecutiveSkips(max.toString())
        await this.form.advancedSettings.enterNumberOfLogsForHistory(noOfLogs.toString())
    }

    async enterExpirationDates(warn: string, expire: string | undefined) {
        await this.form.expiration.select()
        await this.form.expiration.enterWarn(warn)
        if (expire) {
            await this.form.expiration.enterExpire(expire)
        }
    }

    async selectDecision(value: "All" | "Tag" | "Skip") {
        await this.form.decision.select()
        await this.form.decision.selectDecisionType(value)
    }

    async selectProdValue(value: string | number = 0) {
        await this.form.counter.selectSettings('Prod')
        await this.form.counter.selectProd(value);
    }

    async selectToolsSettingAndValue(value: string | number = 0) {
        await this.form.counter.selectSettings('Tool')
        await this.form.counter.selectTool(value);
    }

    async submit() {
        await this.form.createButton.click();
    }

    async addProcessLinks(main: string | number = 0, sampling: string | number = 1) {
        await this.form.processLinks.open()
        await this.form.processLinks.selectMainProcess(main)
        await this.form.processLinks.selectSamplingProcess(sampling)
        await this.form.processLinks.clickOk()
    }

    async selectGlobalTagConditions() {
        await this.form.globalTagConditions(0).selectCheckbox()
    }

    async addTagCondition(conditionToAdd: string | number = 0) {
        await this.form.tagConditions(conditionToAdd).add()
    }

    async addDependentProcesses(samplingProcess: string | number = 0, dependentProcess: string | number = 0) {
        await this.form.dependentProcess.add(samplingProcess, dependentProcess)
    }

    async addProcessSubs(samplingProcess: string | number = 0) {
        await this.form.processSubs.add(samplingProcess)
    }

    async percentageRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue('EACH')
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async eventRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterEvent(5, 'EVENT1000115581')
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectToolsSettingAndValue(1)
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async timeRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterTime(5)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue()
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async processLink() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue()
        await this.addProcessLinks()
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async ruleWithAllFields() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue()
        await this.addProcessLinks()
        await this.addTagCondition()
        // await this.selectGlobalTagConditions()
        await this.addDependentProcesses()
        await this.addProcessSubs()
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async verifyDuplicateRuleErrorMessage(ruleName: string) {
        await this.form.instantiate()
        await this.form.ruleName.enter(ruleName)
        const errorMessage = await this.page.textContent('[for="smpRuleName"] + div mat-error span[class="ng-star-inserted"]')
        expect(errorMessage).toEqual('Rule name is already taken')
    }

    async tryToCreateRuleWithWrongPercentageAndVerifyError() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(252, 234, 455)
        const invalidPercentageError: string | null = await this.page.textContent('app-percent-condition app-error-text >> nth=0')
        expect(invalidPercentageError!.trim()).toEqual('Invalid percentage')
    }

    async advanceSettingsErrorMessages() {
        const self = this;
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        return {
            async verifyMinimumCannotBeGreaterThanMaximum() {
                await self.enterAdvancedSettings(23, 4, 1)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Minimum can not be greater than maximum')
            },
            async verifyPercentageMustBeBetweenMinAndMax() {
                await self.enterAdvancedSettings(24, 33, 34)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Percent must be between min and max')
            },
            async verifyMaximumCannotBeGreaterThanLot() {
                await self.enterAdvancedSettings(24, 33, 25)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Maximum can not be greater than lot history')
            },
            async verifyMinimumCannotBeGreaterThanLot() {
                await self.enterAdvancedSettings(4, 8, 2)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Minimum can not be greater than lot history')
            }
        }
    }

    async expirationErrorMessages() {
        const self = this;
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Metrology')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", -2)
        return {
            async verifyEmptyExpireDateErrorMessage() {
                await self.enterExpirationDates(warnDate, undefined)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('If a warning date is entered an expiration date is required')
            },
            async verifyWarningAndExpirationDateCannotBeSame() {
                await self.enterExpirationDates(warnDate, warnDate)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Warning date must be before the expiration date')
            },
            async verifyWarningDateMustBeBeforeExpirationDate() {
                await self.enterExpirationDates(warnDate, expirationDate)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage!.trim()).toEqual('Expiration date must be in the future')
            }
        }
    }
}