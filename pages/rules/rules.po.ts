import { Page } from "@playwright/test"
import { Action } from '../../utilities/actions'

export class Rules {

    page: Page
    actions: Action

    constructor(page: Page) {
        this.page = page
        this.actions = new Action()
    }

    async openRulesPopup() {
        await this.page.click('button:has-text("Create a rule")');
    }

    async ruleForm(mode: 'create' | 'read') {
        const self = this;
        let form;
        if (mode == 'create') {
            form = await this.page.$('mat-dialog-container #rule-form-container')
        } else {
            form = await this.page.$('#rule-form-container')
        }

        return {
            get ruleName() {
                let el = form.$('id=smpRuleName');
                return {
                    async enter(name: string) {
                        await (await el).fill(name);
                    }
                }
            },
            get ruleGroup() {
                return {
                    async select(groupToSelect: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection') {
                        await (await form.$('id=ruleGroup')).click()
                        await self.page.click(`#ruleGroup-panel mat-option span:has-text("${groupToSelect}")`)
                    },
                }
            },
            get description() {
                return {
                    async enter(description: string) {
                        await (await form.$('[formcontrolname="smpRuleDescription"]')).fill(description);
                    }
                }
            },
            get type() {
                return {
                    async select(groupToSelect: 'Percent' | 'Time' | 'Event') {
                        await (await form.$('id=smpRuleType')).click()
                        await self.page.click(`#smpRuleType-panel mat-option span:has-text("${groupToSelect}")`)
                    },
                }
            },
            get measure() {
                return {
                    async enter(value: string) {
                        const el = await form.$('id=smpRuleCondition');
                        await el.fill(value);
                    }
                }
            },
            get betweenMin() {
                let el = form.$('id=smpRuleDesiredRangeMin');
                return {
                    async enter(value: string) {
                        await (await el).fill(value);
                    }
                }
            },
            get betweenMax() {
                let el = form.$('id=smpRuleConditionMax');
                return {
                    async enter(value: string) {
                        await (await el).fill(value);
                    }
                }
            },
            get advancedSettings() {
                return {
                    async select() {
                        let el = form.$('//label[text()="Advanced Settings"]/preceding-sibling::mat-checkbox//span');
                        await (await el).check();
                    },
                    async enterMinimumConsecutiveSkips(value: string) {
                        const el = await form.$('span:has-text("Minimum consecutive skips") + div input ')
                        await el.fill(value);
                    },
                    async enterMaximumConsecutiveSkips(value: string) {
                        const el = await form.$('span:has-text("Maximum consecutive skips") + div input ')
                        await el.fill(value);
                    },
                    async enterNumberOfLogsForHistory(value: string) {
                        const el = await form.$('span:has-text("Number of lots for history") + div input ')
                        await el.fill(value);
                    },
                }
            },
            get expiration() {
                let el = form.$('[formcontrolname="expirationCheckbox"] span');
                return {
                    async select() {
                        await (await el).check();
                    },
                    async enterWarn(value: string) {
                        const el = await form.$('[formcontrolname="expiryWarnInst"]')
                        await el.fill(value);
                    },
                    async enterExpire(value: string) {
                        const el = await form.$('[formcontrolname="expiryDeactivateInst"]')
                        await el.fill(value);
                    },
                }
            },
            get decision() {
                let el = form.$('[formcontrolname="externalWrite"] span');
                return {
                    async select() {
                        await (await el).check();
                    },
                    async selectDecisionType(value: "All" | "Tag" | "Skip") {
                        await (await form.$('id=decisionsToSend')).click()
                        await self.page.click(`#decisionsToSend-panel mat-option span:has-text("${value}")`)
                    }
                }
            },
            get counter() {
                return {
                    async selectSettings() {
                        await (await form.$('app-counter-settings i')).click();
                        await (await form.$('text=Prod >> span')).click();
                        await (await form.$('button:has-text("Close")')).click();
                        await (await form.$('#mat-select-value-9')).click();
                        await (await form.$('#mat-option-18 span:has-text("EACH")')).click();
                    }
                }
            }
        }
    }

    async createNewRule() {
        const form = await this.ruleForm('create');
        await form.ruleName.enter('Testing');
        await form.ruleGroup.select('Defect Inspect');
        await form.description.enter('Creating rules with automation');
        await form.type.select('Percent');
        await form.measure.enter("25");
        await form.betweenMin.enter("4");
        await form.betweenMax.enter("50");
        await form.advancedSettings.select()
        await form.advancedSettings.enterMinimumConsecutiveSkips("2")
        await form.advancedSettings.enterMaximumConsecutiveSkips("4")
        await form.advancedSettings.enterNumberOfLogsForHistory("55")
        await form.expiration.select()
        await form.expiration.enterWarn('2/17/2022')
        await form.expiration.enterExpire('3/17/2022')
        await form.decision.select()
        await form.decision.selectDecisionType('All')
        await this.page.pause()
        await form.counter.selectSettings()
        await this.page.click('mat-dialog-container[role="dialog"] button:has-text("Create")');
        await this.page.fill('text=Comment (required) Comment must be at least 10 characters >> textarea', 'testing here is this');
        await this.page.click('button:has-text("Submit")');
        // await (await this.identifyForm()).fillRuleName('testing');
        // await (await this.identifyForm()).selectRuleGroup('Defect Inspect')


        // await this.page.click('mat-dialog-container[role="dialog"] >> text=and');
        // // Click text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced Settings E >> #smpRuleConditionMax
        // await this.page.click('text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced Settings E >> #smpRuleConditionMax');
        // // Fill text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced Settings E >> #smpRuleConditionMax
        // await this.page.fill('text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced Settings E >> #smpRuleConditionMax', '24');
        // // Click #mat-checkbox-149 span
        // await this.page.click('#mat-checkbox-149 span');
        // // Click text=Minimum consecutive skipsDefault = 15 >> input
        // await this.page.click('text=Minimum consecutive skipsDefault = 15 >> input');
        // // Fill text=Minimum consecutive skipsDefault = 15 >> input
        // await this.page.fill('text=Minimum consecutive skipsDefault = 15 >> input', '15');
        // // Click text=Maximum consecutive skipsDefault = 23 >> input
        // await this.page.click('text=Maximum consecutive skipsDefault = 23 >> input');
        // // Fill text=Maximum consecutive skipsDefault = 23 >> input
        // await this.page.fill('text=Maximum consecutive skipsDefault = 23 >> input', '23');
        // // Click text=Number of lots for historyDefault = 100 >> input
        // await this.page.click('text=Number of lots for historyDefault = 100 >> input');
        // // Fill text=Number of lots for historyDefault = 100 >> input
        // await this.page.fill('text=Number of lots for historyDefault = 100 >> input', '34');
        // // Click #mat-checkbox-147 span
        // await this.page.click('#mat-checkbox-147 span');
        // // Click [aria-label="Open calendar"]
        // await this.page.click('[aria-label="Open calendar"]');
        // // Click [aria-label="Next month"]
        // await this.page.click('[aria-label="Next month"]');
        // // Click [aria-label="September 1, 2021"] >> text=1
        // await this.page.click('[aria-label="September 1, 2021"] >> text=1');
        // // Click :nth-match([aria-label="Open calendar"], 2)
        // await this.page.click(':nth-match([aria-label="Open calendar"], 2)');
        // // Click [aria-label="Next month"]
        // await this.page.click('[aria-label="Next month"]');
        // // Click [aria-label="September 4, 2021"] >> text=4
        // await this.page.click('[aria-label="September 4, 2021"] >> text=4');
        // // Click #mat-checkbox-148 span
        // await this.page.click('#mat-checkbox-148 span');
        // // Click #mat-select-value-7
        // await this.page.click('#mat-select-value-7');
        // // Click div[role="listbox"] >> text=Tag
        // await this.page.click('div[role="listbox"] >> text=Tag');
        // // Click #mat-input-15
        // await this.page.click('#mat-input-15');
        // // Fill #mat-input-15
        // await this.page.fill('#mat-input-15', '10');
        // // Click #mat-input-16
        // await this.page.click('#mat-input-16');
        // // Fill #mat-input-16
        // await this.page.fill('#mat-input-16', '10');
        // // Click #mat-input-17
        // await this.page.click('#mat-input-17');
        // // Fill #mat-input-17
        // await this.page.fill('#mat-input-17', '10');
        // // Click #mat-input-18
        // await this.page.click('#mat-input-18');
        // // Fill #mat-input-18
        // await this.page.fill('#mat-input-18', '10');
        // // Click text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced SettingsMi >> textarea
        // await this.page.click('text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced SettingsMi >> textarea');
        // // Fill text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced SettingsMi >> textarea
        // await this.page.fill('text=Type:*PercentCondition:*Measure %Desired Range:Between% and% Advanced SettingsMi >> textarea', 'creating rules with automation');
        // // Click text=Counter Settings*0Add Counter >> i
        // await this.page.click('text=Counter Settings*0Add Counter >> i');
        // // Click #mat-checkbox-155 >> text=Prod
        // await this.page.click('#mat-checkbox-155 >> text=Prod');
        // // Click button:has-text("Close")
        // await this.page.click('button:has-text("Close")');
        // // Click text=Counter Settings*0Prod: >> mat-select[role="combobox"] >> :nth-match(div, 4)
        // await this.page.click('text=Counter Settings*0Prod: >> mat-select[role="combobox"] >> :nth-match(div, 4)');
        // // Click text=PRD100321280PRD1005691912PRD1010414383PRD1017562819PRD1020852282PRD1028847623PRD >> span
        // await this.page.click('text=PRD100321280PRD1005691912PRD1010414383PRD1017562819PRD1020852282PRD1028847623PRD >> span');
        // // Click mat-dialog-container[role="dialog"] button:has-text("Create")
        // await this.page.click('mat-dialog-container[role="dialog"] button:has-text("Create")');
        // // Click text=Create rule name×Comment (required)SubmitCancel >> textarea
        // await this.page.click('text=Create rule name×Comment (required)SubmitCancel >> textarea');
        // // Fill text=Create rule name×Comment (required)SubmitCancel >> textarea
        // await this.page.fill('text=Create rule name×Comment (required)SubmitCancel >> textarea', 'adding comment');
        // // Click button:has-text("Submit")
        // await this.page.click('button:has-text("Submit")');
    }
}