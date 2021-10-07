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
        await this.form.ruleGroup.select('Defect Inspect');
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

    async enterExpirationDates(warn: Date, expire: Date) {
        let warnDateToString = `${warn.getMonth() +  1}/${warn.getDate()}/${warn.getFullYear()}`
        let expireDateToString = `${expire.getMonth() +  1}/${expire.getDate()}/${expire.getFullYear()}`
        await this.form.expiration.select()
        await this.form.expiration.enterWarn(warnDateToString)
        await this.form.expiration.enterExpire(expireDateToString)
    }

    async selectDecision(value: "All" | "Tag" | "Skip") {
        await this.form.decision.select()
        await this.form.decision.selectDecisionType('All')
    }

    async selectProdValue(value: string | 'EACH') {
        await this.form.counter.selectSettings('Prod')
        await this.form.counter.selectProd('EACH');
    }

    async selectToolsSettingAndValue(value: string | 'EACH') {
        await this.form.counter.selectSettings('Tool')
        await this.form.counter.selectTool(value);
    }

    async submit() {
        await this.form.createButton.click();
    }

    async percentageRule() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        await this.enterAdvancedSettings(2, 4, 23)
        await this.enterExpirationDates(new Date('2/17/2022'), new Date('3/17/2022'))
        await this.selectDecision('All')
        await this.selectProdValue('Each')
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
        await this.enterExpirationDates(new Date('2/17/2022'), new Date('3/17/2022'))
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
        await this.enterExpirationDates(new Date('2/17/2022'), new Date('3/17/2022'))
        await this.selectDecision('All')
        await this.selectProdValue('Each')
        await this.submit()
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
        this.data = this.form.newRuleData;
    }

    async verifyDuplicateRuleErrorMessage(ruleName: string) {
        await this.form.instantiate()
        await this.form.ruleName.enter(ruleName)
        await this.page.keyboard.press('Tab')
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
        const invalidRangeError: string = await this.page.textContent('app-percent-condition app-error-text >> nth=1')
        expect(invalidPercentageError.trim()).toEqual('Invalid percentage')
        expect(invalidRangeError.trim()).toEqual('Invalid percentage range')
    }

    async advanceSettingsErrorMessages() {
        await this.instantiate()
        await this.enterName()
        await this.selectRuleGroup('Defect Inspect')
        await this.enterDescription()
        await this.enterPercentages(25, 4, 50)
        return {
            async verifyMinimumCannotBeGreaterThanMaximum() {
                await this.enterAdvancedSettings(23, 4, 1)
                const errorMessage = await this.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Minimum can not be greater than maximum')
            },
            async verifyPercentageMustBeBetweenMinAndMax() {
                await this.enterAdvancedSettings(24, 33, 34)
                const errorMessage = await this.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Percent must be between min and max')
            },
            async verifyMaximumCannotBeGreaterThanLot() {
                await this.enterAdvancedSettings(24, 33, 25)
                const errorMessage = await this.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Maximum can not be greater than lot history')
            },
            async verifyMinimumCannotBeGreaterThanLot() {
                await this.enterAdvancedSettings(4, 8, 2)
                const errorMessage = await this.page.textContent('span.error-text span')
                expect(errorMessage.trim()).toEqual('Minimum can not be greater than lot history')
            }
        }   
    }
}