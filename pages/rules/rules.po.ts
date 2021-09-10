import { ElementHandle, expect, Page } from "@playwright/test"
import { Action } from '../../utilities/actions'
import { CommonActions } from "../../utilities/common";

const commonActions = new CommonActions();

export class Rules {

    page: Page
    actions: Action
    newRuleData: {
        name: string,
        ruleGroup: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection',
        description: string
    }

    constructor(page: Page) {
        this.page = page
        this.actions = new Action()
        this.newRuleData = {
            name: '',
            ruleGroup: 'Defect Inspect',
            description: ''
        }
    }

    async waitForPageLoad() {
        await this.page.waitForSelector('.spinner-border', { state: "hidden" })
        await this.page.waitForSelector('app-filter-select-single')
    }
    async openRulesPopup() {
        await this.page.click('button:has-text("Create a rule")');
    }

    async ruleForm(mode: 'create' | 'read') {
        const self = this;
        let form: ElementHandle<SVGElement | HTMLElement>;
        if (mode == 'create') {
            form = await this.page.waitForSelector('mat-dialog-container #rule-form-container')
        } else {
            form = await this.page.waitForSelector('#rule-form-container')
        }

        return {
            get ruleName() {
                let el = form.waitForSelector('id=smpRuleName');
                return {
                    async enter(name: string) {
                        self.newRuleData.name = name;
                        await (await el).fill(name);
                    },
                    async getValue() {
                        return form.$eval('id=smpRuleName', el => el["value"]);
                    }
                }
            },
            get ruleGroup() {
                return {
                    async select(groupToSelect: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection') {
                        self.newRuleData.ruleGroup = groupToSelect;
                        await (await form.waitForSelector('id=ruleGroup')).click()
                        await self.page.click(`#ruleGroup-panel mat-option span:has-text("${groupToSelect}")`)
                    },
                }
            },
            get description() {
                return {
                    async enter(description: string) {
                        self.newRuleData.description = description;
                        await (await form.waitForSelector('[formcontrolname="smpRuleDescription"]')).fill(description);
                    }
                }
            },
            get type() {
                return {
                    async select(groupToSelect: 'Percent' | 'Time' | 'Event') {
                        await (await form.waitForSelector('id=smpRuleType')).click()
                        await self.page.click(`#smpRuleType-panel mat-option span:has-text("${groupToSelect}")`)
                    },
                }
            },
            get measure() {
                return {
                    async enter(value: string) {
                        const el = await form.waitForSelector('id=smpRuleCondition');
                        await (await el).fill('');
                        await el.fill(value);
                    }
                }
            },
            get betweenMin() {
                let el = form.waitForSelector('id=smpRuleDesiredRangeMin');
                return {
                    async enter(value: string) {
                        await (await el).fill('');
                        await (await el).fill(value);
                    }
                }
            },
            get betweenMax() {
                let el = form.waitForSelector('id=smpRuleConditionMax');
                return {
                    async enter(value: string) {
                        await (await el).fill('');
                        await (await el).fill(value);
                    }
                }
            },
            get advancedSettings() {
                return {
                    async select() {
                        let el = form.waitForSelector('//label[text()="Advanced Settings"]/preceding-sibling::mat-checkbox//span');
                        await (await el).check();
                    },
                    async enterMinimumConsecutiveSkips(value: string) {
                        const el = await form.waitForSelector('span:has-text("Minimum consecutive skips") + div input ')
                        await el.fill('');
                        await el.fill(value);
                    },
                    async enterMaximumConsecutiveSkips(value: string) {
                        const el = await form.waitForSelector('span:has-text("Maximum consecutive skips") + div input ')
                        await el.fill('');
                        await el.fill(value);
                    },
                    async enterNumberOfLogsForHistory(value: string) {
                        const el = await form.waitForSelector('span:has-text("Number of lots for history") + div input ')
                        await el.fill('');
                        await el.fill(value);
                    },
                }
            },
            get expiration() {
                let el = form.waitForSelector('[formcontrolname="expirationCheckbox"] span');
                return {
                    async select() {
                        await (await el).check();
                    },
                    async enterWarn(value: string) {
                        const el = await form.waitForSelector('[formcontrolname="expiryWarnInst"]')
                        await el.fill(value);
                    },
                    async enterExpire(value: string) {
                        const el = await form.waitForSelector('[formcontrolname="expiryDeactivateInst"]')
                        await el.fill(value);
                    },
                }
            },
            get decision() {
                let el = form.waitForSelector('[formcontrolname="externalWrite"] span');
                return {
                    async select() {
                        await (await el).check();
                    },
                    async selectDecisionType(value: "All" | "Tag" | "Skip") {
                        await (await form.waitForSelector('id=decisionsToSend')).click()
                        await self.page.click(`#decisionsToSend-panel mat-option span:has-text("${value}")`)
                    }
                }
            },
            get counter() {

                return {
                    async selectSettings(optionToSelect: string) {
                        await (await form.waitForSelector('app-counter-settings i.fa-plus-square')).click();
                        let selectOption = await self.page.$(`mat-checkbox:has-text("${optionToSelect}")`);
                        await (await selectOption.$('input')).click({ force: true });
                        await (await self.page.$('button:has-text("Close")')).click();
                    },
                    async selectProd(optionToSelect: string) {
                        const prodDropDown = await self.page.waitForSelector('[id="prdEachNa"] .mat-select-value')
                        await prodDropDown.click();
                        await (await self.page.$(`[id="prdEachNa-panel"] mat-option[value="EACH"]`)).click();
                    }
                }
            },
            get createButton() {
                return {
                    async click() {
                        await self.page.click('app-modal-footer button.btn-primary')
                    }
                }
            }
        }
    }

    get comment() {
        const self = this
        return {
            async enterComment(commentToEnter: string) {
                await self.page.fill('section:has-text("Comment (required)") textarea', commentToEnter);
            },
            async submit() {
                await self.page.click('button:has-text("Submit")');
            }
        }
    }

    async createNewRule() {
        const form = await this.ruleForm('create');
        await form.ruleName.enter(`Testing - ${commonActions.randomString(4)}`);
        await form.ruleGroup.select('Defect Inspect');
        await form.description.enter(`Creating rules with automation - ${commonActions.randomString(4)}`);
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
        await form.counter.selectSettings('Prod')
        await form.counter.selectProd('EACH');
        await form.createButton.click();
        await this.comment.enterComment("created rule with automation script");
        await this.comment.submit();
    }

    get rulesTable() {
        const self = this;
        return {
            async selectByName(ruleName: string) {
                self.page.click(`td.mat-column-NAME span.rule-name:has-text("${ruleName}")`)
            }
        }
    }

    get matDrawer() {
        const self = this;
        return {
            async verifyName(expectedName: string) {
                const form = await self.ruleForm('read');
                expect(await form.ruleName.getValue()).toEqual(expectedName)
            }
        }
    }
}