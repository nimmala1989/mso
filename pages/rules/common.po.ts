import { Page } from "@playwright/test"
import { Action } from "../../utilities/actions"

export class Common {

    page: Page
    actions: Action
    form: any
    newRuleData: {
        name: string,
        ruleGroup: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection',
        description: string
    }

    constructor(page: Page, mode: 'create' | 'read') {
        this.page = page
        this.actions = new Action()
        this.newRuleData = {
            name: '',
            ruleGroup: 'Defect Inspect',
            description: ''
        }
        if (mode == 'create') {
            this.form = this.page.waitForSelector('mat-dialog-container #rule-form-container')
        } else {
            this.form = this.page.waitForSelector('#rule-form-container')
        }
    }

    async instantiate() {
        this.form = await this.form
    }

    get ruleName() {
        const self = this
        let el = this.form.waitForSelector('id=smpRuleName');

        return {
            async enter(name: string) {
                self.newRuleData.name = name;
                await (await el).fill(name);
            },
            async getValue() {
                return self.form.$eval('id=smpRuleName', (el: { [x: string]: any }) => el["value"]);
            }
        }
    }

    get ruleGroup() {
        const self = this
        return {
            async select(groupToSelect: 'Defect Inspect' | 'Dummy Inspection' | 'Yield Inspection') {
                self.newRuleData.ruleGroup = groupToSelect;
                const dropdown = await self.form.waitForSelector('id=ruleGroup')
                await dropdown.click()
                await self.page.click(`#ruleGroup-panel mat-option span:has-text("${groupToSelect}")`)
            },
        }
    }

    get description() {
        const self = this
        const el = this.form.waitForSelector('[formcontrolname="smpRuleDescription"]')
        return {
            async enter(description: string) {
                self.newRuleData.description = description;
                await (await el).fill(description);
            }
        }
    }

    get type() {
        const self = this
        return {
            async select(groupToSelect: 'Percent' | 'Time' | 'Event') {
                await (await self.form.waitForSelector('id=smpRuleType')).click()
                await self.page.click(`#smpRuleType-panel mat-option span:has-text("${groupToSelect}")`)
            },
        }
    }

    get measure() {
        const self = this
        return {
            async enter(value: string) {
                const el = await self.form.waitForSelector('id=smpRuleCondition');
                await (await el).fill('');
                await el.fill(value);
            },
            async enterLot(value: string) {
                const el = await self.form.waitForSelector('id=smpRuleConditionLotEvent');
                await (await el).fill('');
                await el.fill(value);
            },
            async enterTime(value: string) {
                const el = await self.form.waitForSelector('id=smpRuleConditionHours');
                await (await el).fill('');
                await el.fill(value);
            }
        }
    }

    get event() {
        const self = this
        return {
            async select(eventToSelect: any) {
                await (await self.form.waitForSelector('id=smpRuleEvents')).click()
                await self.page.click(`#smpRuleEvents-panel mat-option span:has-text("${eventToSelect}")`)
            },
        }
    }


    get betweenMin() {
        const self = this
        let el = this.form.waitForSelector('id=smpRuleDesiredRangeMin');
        return {
            async enter(value: string) {
                await (await el).fill('');
                await (await el).fill(value);
            }
        }
    }

    get betweenMax() {
        const self = this
        let el = this.form.waitForSelector('id=smpRuleConditionMax');
        return {
            async enter(value: string) {
                await (await el).fill('');
                await (await el).fill(value);
            }
        }
    }

    get advancedSettings() {
        const self = this
        return {
            async select() {
                let el = self.form.waitForSelector('//label[text()="Advanced Settings"]/preceding-sibling::mat-checkbox//span');
                await (await el).check();
            },
            async enterMinimumConsecutiveSkips(value: string) {
                const el = await self.form.waitForSelector('span:has-text("Minimum consecutive skips") + div input ')
                await el.fill('');
                await el.fill(value);
            },
            async enterMaximumConsecutiveSkips(value: string) {
                const el = await self.form.waitForSelector('span:has-text("Maximum consecutive skips") + div input ')
                await el.fill('');
                await el.fill(value);
            },
            async enterNumberOfLogsForHistory(value: string) {
                const el = await self.form.waitForSelector('span:has-text("Number of lots for history") + div input ')
                await el.fill('');
                await el.fill(value);
            },
        }
    }

    get expiration() {
        const self = this
        let el = this.form.waitForSelector('[formcontrolname="expirationCheckbox"] span');
        return {
            async select() {
                await (await el).check();
            },
            async enterWarn(value: string) {
                const el = await self.form.waitForSelector('[formcontrolname="expiryWarnInst"]')
                await el.fill(value);
            },
            async enterExpire(value: string) {
                const el = await self.form.waitForSelector('[formcontrolname="expiryDeactivateInst"]')
                await el.fill(value);
            },
        }
    }

    get decision() {
        const self = this
        let el = this.form.waitForSelector('[formcontrolname="externalWrite"] span');
        return {
            async select() {
                await (await el).check();
            },
            async selectDecisionType(value: "All" | "Tag" | "Skip") {
                await (await self.form.waitForSelector('id=decisionsToSend')).click()
                await self.page.click(`#decisionsToSend-panel mat-option span:has-text("${value}")`)
            }
        }
    }

    get processLinks() {
        const self = this
        return {
            async open() {
                await (await self.form.waitForSelector('[formname="processLinks"] i.fa-plus-square')).click();
            },
            async selectMainProcess(value: string) {
                await (await self.form.waitForSelector('id=fromMsoProcess')).click()
                await self.page.click(`#fromMsoProcess-panel mat-option span:has-text("${value}")`)
            },
            async selectSamplingProcess(value: string) {
                await (await self.form.waitForSelector('id=toMsoProcess')).click()
                await self.page.click(`#toMsoProcess-panel mat-option span:has-text("${value}")`)
            },
            async clickOk() {
                await (await self.page.$('button:has-text("Ok")')).click();
            }
        }
    }

    get counter() {
        const self = this
        return {
            async selectSettings(optionToSelect: string) {
                await (await self.form.waitForSelector('app-counter-settings i.fa-plus-square')).click();
                let selectOption = await self.page.$(`mat-checkbox:has-text("${optionToSelect}")`);
                await (await selectOption.$('input')).click({ force: true });
                await (await self.page.$('button:has-text("Close")')).click();
            },
            async selectProd(optionToSelect: string) {
                const prodDropDown = await self.page.waitForSelector('[id="prdEachNa"] .mat-select-value')
                await prodDropDown.click();
                await (await self.page.$(`[id="prdEachNa-panel"] mat-option[value="${optionToSelect}"]`)).click();
            },
            async selectTool(optionToSelect: string) {
                const dropdown = await self.page.waitForSelector('[id="toolEachNa"] .mat-select-value')
                await dropdown.click();
                
                await (await self.page.$(`[id="toolEachNa-panel"] mat-option:has-text("${optionToSelect}")`)).click();
            }
        }
    }

    get createButton() {
        const self = this
        return {
            async click() {
                await self.page.click('app-modal-footer button.btn-primary')
            }
        }
    }
}