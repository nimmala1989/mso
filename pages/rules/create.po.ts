import { expect, Page } from '@playwright/test';
import { Common } from './common.po'
import { Comment } from './comment.po'
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

    async instantiate() {
        await this.form.instantiate()
    }

    async enterName(name: string = `Testing - ${CommonActions.randomString(4)}`) {
        await this.form.ruleName.enter(name);
    }

    async selectRuleGroup(groupToSelect: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection' = 'Defect Inspect') {
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
        await this.form.event.select('test_event_2')
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

    async selectProdValue(value: string | 'EACH') {
        await this.form.counter.selectSettings('Prod')
        await this.form.counter.selectProd(value.toUpperCase());
    }

    async selectToolsSettingAndValue(value: string | 'EACH') {
        await this.form.counter.selectSettings('Tool')
        await this.form.counter.selectTool(value);
    }

    async submit() {
        await this.form.createButton.click();
    }

    async addProcessLinks(main: string, sampling: string) {
        await this.form.processLinks.open()
        await this.form.processLinks.selectMainProcess(main)
        await this.form.processLinks.selectSamplingProcess(sampling)
        await this.form.processLinks.clickOk()
    }

    async selectGlobalTagConditions() {
        await this.form.globalTagConditions('Context Test').selectCheckbox()
        await this.form.globalTagConditions('Parameter Test').selectCheckbox()
        await this.form.globalTagConditions('Tag Test All & All').selectCheckbox()
    }

    async addTagCondition(conditionToAdd: string) {
        await this.form.tagConditions(conditionToAdd).add()
    }

    async addDependentProcesses(samplingProcess: string, dependentProcess: string) {
        await this.form.dependentProcess.add(samplingProcess, dependentProcess)
    }

    async addProcessSubs(samplingProcess: string) {
        await this.form.processSubs.add(samplingProcess)
    }

    async percentageRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
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
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterEvent(5, 'test_event_2')
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectToolsSettingAndValue('BACK-T007')
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async timeRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterTime(5)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue('Each')
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async processLink() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue('Each')
        await this.addProcessLinks('STEP1000093143', 'STEP1000099908')
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async ruleWithAllFields() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", 2)
        await this.enterExpirationDates(warnDate, expirationDate)
        await this.selectDecision('All')
        await this.selectProdValue('Each')
        await this.addProcessLinks('STEP1000093143', 'STEP1000099908')
        await this.addTagCondition('0000test1')
        await this.selectGlobalTagConditions()
        await this.addDependentProcesses('STEP1000099908', 'STEP1000093143')
        await this.addProcessSubs('STEP1000093143')
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
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(252, 234, 455)
        const invalidPercentageError: string = await this.page.textContent('app-percent-condition app-error-text >> nth=0')
        expect(invalidPercentageError.trim()).toEqual('Invalid percentage')
    }

    async advanceSettingsErrorMessages() {
        const self = this;
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        return {
            async verifyMinimumCannotBeGreaterThanMaximum() {
                await self.enterAdvancedSettings(23, 4, 1)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Minimum can not be greater than maximum')
            },
            async verifyPercentageMustBeBetweenMinAndMax() {
                await self.enterAdvancedSettings(24, 33, 34)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Percent must be between min and max')
            },
            async verifyMaximumCannotBeGreaterThanLot() {
                await self.enterAdvancedSettings(24, 33, 25)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Maximum can not be greater than lot history')
            },
            async verifyMinimumCannotBeGreaterThanLot() {
                await self.enterAdvancedSettings(4, 8, 2)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Minimum can not be greater than lot history')
            }
        }
    }

    async expirationErrorMessages() {
        const self = this;
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        let warnDate = CommonActions.getFutureDate("Days", 5)
        let expirationDate = CommonActions.getFutureDate("Months", -2)
        return {
            async verifyEmptyExpireDateErrorMessage() {
                await self.enterExpirationDates(warnDate, undefined)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('If a warning date is entered an expiration date is required')
            },
            async verifyWarningAndExpirationDateCannotBeSame() {
                await self.enterExpirationDates(warnDate, warnDate)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Warning date must be before the expiration date')
            },
            async verifyWarningDateMustBeBeforeExpirationDate() {
                await self.enterExpirationDates(warnDate, expirationDate)
                const errorMessage = await self.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Warning date must be before the expiration date')
            }
        }
    }
}