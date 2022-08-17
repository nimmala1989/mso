import { expect, Page } from "@playwright/test"
import { Action } from "../../utilities/actions"

export class Common {

    page: Page
    actions: Action
    form: any
    newRuleData: {
        name: string,
        ruleGroup: string,
        description: string
    }
    mode: string

    constructor(page: Page, mode: 'create' | 'read') {
        this.page = page
        this.actions = new Action()
        this.newRuleData = {
            name: '',
            ruleGroup: 'Defect Metrology',
            description: ''
        }
        this.mode = mode
    }

    async instantiate() {
        if (this.mode == 'create') {
            this.form = await this.page.waitForSelector('mat-dialog-container #rule-form-container')
        } else {
            this.form = await this.page.waitForSelector('#rule-form-container')
        }
    }

    get ruleName() {
        const self = this
        return {
            async enter(name: string) {
                self.newRuleData.name = name;
                let el = await self.form.waitForSelector('id=smpRuleName');
                await el.fill(name);
                await self.page.keyboard.press('Tab');
            },
            async getValue() {
                await self.form.waitForSelector('id=smpRuleName');
                return self.form.$eval('id=smpRuleName', (el: { [x: string]: any }) => el["value"]);
            }
        }
    }

    get ruleGroup() {
        const self = this
        return {
            async select(groupToSelect: string) {
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
            async getValue() {
                return self.form.$eval('id=smpRuleCondition', (el: { [x: string]: any }) => el["value"]);
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
            },
            async getValue() {
                return self.form.$eval('id=smpRuleDesiredRangeMin', (el: { [x: string]: any }) => el["value"]);
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
            },
            async getValue() {
                return self.form.$eval('id=smpRuleConditionMax', (el: { [x: string]: any }) => el["value"]);
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
                const el = await self.form.waitForSelector('span:has-text("Minimum consecutive skips") + div input')
                await el.fill('');
                await el.fill(value);
            },
            async getValueForMinimumConsecutiveSkips() {
                return self.form.$eval('span:has-text("Minimum consecutive skips") + div input', (el: { [x: string]: any }) => el["value"]);
            },
            async enterMaximumConsecutiveSkips(value: string) {
                const el = await self.form.waitForSelector('span:has-text("Maximum consecutive skips") + div input')
                await el.fill('');
                await el.fill(value);
            },
            async getValueForMaximumConsecutiveSkips() {
                return self.form.$eval('span:has-text("Maximum consecutive skips") + div input', (el: { [x: string]: any }) => el["value"]);
            },
            async enterNumberOfLogsForHistory(value: string) {
                const el = await self.form.waitForSelector('span:has-text("Number of lots for history") + div input')
                await el.fill('');
                await el.fill(value);
            },
            async getValueForNumberOfLogsForHistory() {
                return self.form.$eval('span:has-text("Number of lots for history") + div input', (el: { [x: string]: any }) => el["value"]);
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
            async selectMainProcess(optionToSelect: string | number = 0) {
                await self.page.click('id=fromMsoProcess');
                let option
                if (typeof (optionToSelect) == 'number') {
                    option = self.page.locator(`[id="fromMsoProcess-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(optionToSelect)
                } else {
                    optionToSelect = optionToSelect.toUpperCase()
                    option = self.page.locator(`[id="fromMsoProcess-panel"] mat-option[value="${optionToSelect}"]`)
                }
                await option.click();

            },
            async selectSamplingProcess(optionToSelect: string | number = 1) {
                await self.page.click('id=toMsoProcess');
                let option
                if (typeof (optionToSelect) == 'number') {
                    option = self.page.locator(`[id="toMsoProcess-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(optionToSelect)
                } else {
                    optionToSelect = optionToSelect.toUpperCase()
                    option = self.page.locator(`[id="toMsoProcess-panel"] mat-option[value="${optionToSelect}"]`)
                }
                await option.click();
            },
            async clickOk() {
                await self.page.click('button:has-text("Ok")');
            }
        }
    }

    get counter() {
        const self = this
        return {
            async selectSettings(optionToSelect: string) {
                await (await self.form.waitForSelector('app-counter-settings i.fa-plus-square')).click();
                let selectOption = await self.page.$(`mat-checkbox:has-text("${optionToSelect}")`);
                await (await selectOption?.$('input'))?.click({ force: true });
                await self.page.click('button:has-text("Close")');
            },
            async selectProd(optionToSelect: string | number = 0) {
                const prodDropDown = await self.page.waitForSelector('[id="prdEachNa"] .mat-select-value')
                await prodDropDown.click();
                let option
                if (typeof (optionToSelect) == 'number') {
                    option = self.page.locator(`[id="prdEachNa-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(optionToSelect)
                } else {
                    optionToSelect = optionToSelect.toUpperCase()
                    option = self.page.locator(`[id="prdEachNa-panel"] mat-option[value="${optionToSelect}"]`)
                }
                await option.click();
            },
            async selectTool(optionToSelect: string | number = 0) {
                await self.page.click('[id="toolEachNa"] .mat-select-value')
                let option
                if (typeof (optionToSelect) == 'number') {
                    option = self.page.locator(`[id="toolEachNa-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(optionToSelect)
                } else {
                    optionToSelect = optionToSelect.toUpperCase()
                    option = self.page.locator(`[id="toolEachNa-panel"] mat-option[value="${optionToSelect}"]`)
                }
                await option.click();
            }
        }
    }

    globalTagConditions(checkbox: string | number = 0) {
        const self = this;
        return {
            async selectCheckbox() {
                let checkboxSelector
                if (typeof(checkbox) == 'number'){
                    self.form.$$('')
                }else{
                    checkboxSelector = await self.form.waitForSelector(`text=${checkbox} inherited >> div mat-checkbox input`)
                }
                await checkboxSelector.check()
                const status = await checkboxSelector.isChecked()
                expect(status).toBe(true)
            },
            async unselectCheckbox() {
                let checkboxSelector
                if (typeof(checkbox) == 'number'){
                    checkboxSelector = await self.form.waitForSelector('app-global-tags [formarrayname="tagConditions"] div mat-checkbox input')
                }else{
                    checkboxSelector = await self.form.waitForSelector(`text=${checkbox} inherited >> div mat-checkbox input`)
                }
                await checkboxSelector.uncheck({ force: true })
                const status = await checkboxSelector.isChecked()
                expect(status).toBe(false)
            }
        }
    }

    tagConditions(optionToSelect: string | number = 0) {
        const self = this;
        return {
            async add() {
                await (await self.form.waitForSelector('app-explicit-tags .icon-fps')).click();
                await self.page.click('app-select-search mat-select')
                let option
                if (typeof (optionToSelect) == 'number') {
                    option = self.page.locator(`[id="tag2-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(optionToSelect)
                } else {
                    optionToSelect = optionToSelect.toUpperCase()
                    option = self.page.locator(`[id="tag2-panel"] mat-option[value="${optionToSelect}"]`)
                }
                await option.click();
                await self.page.click('button:has-text("Ok")');
            },
            async delete() {
                await self.page.click(`text=${optionToSelect} Disassociate Tag Condition >> i`);
            }
        }
    }

    get dependentProcess() {
        const self = this;
        const page = self.page;
        return {
            async add(samplingProcess: string | number = 0, dependentProcess: string | number = 0) {
                await (await self.form.waitForSelector('app-dependent-links .fa-plus-square')).click();
                await page.click('text=Sampling Process : Sampling Process >> mat-select[role="combobox"] span');
                let option
                if (typeof (samplingProcess) == 'number') {
                    option = self.page.locator(`[id="parentProcess-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(samplingProcess)
                } else {
                    samplingProcess = samplingProcess.toUpperCase()
                    option = self.page.locator(`[id="parentProcess-panel"] mat-option[value="${samplingProcess}"]`)
                }
                await option.click();

                await page.click('text=Dependent ProcessHelp me find one... >> span');
                let option2
                if (typeof (dependentProcess) == 'number') {
                    option2 = self.page.locator(`[id="childProcess-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(dependentProcess)
                } else {
                    dependentProcess = dependentProcess.toUpperCase()
                    option2 = self.page.locator(`[id="childProcess-panel"] mat-option[value="${dependentProcess}"]`)
                }
                await option2.click();

                await page.click('button:has-text("Ok")');

            }
        }
    }

    get processSubs() {
        const self = this;
        const page = self.page;
        return {
            async add(samplingProcess: string | number = 0) {
                await (await self.form.waitForSelector('app-process-view[formname="processSubs"] .fa-plus-square')).click();
                await page.click('text=Sampling ProcessHelp me find one... >> span');
                let option
                if (typeof (samplingProcess) == 'number') {
                    option = self.page.locator(`[id="toMsoProcess-panel"] mat-option[aria-disabled="false"]:not([value="NA"])`).nth(samplingProcess)
                } else {
                    samplingProcess = samplingProcess.toUpperCase()
                    option = self.page.locator(`[id="toMsoProcess-panel"] mat-option[value="${samplingProcess}"]`)
                }
                await option.click();
                await page.click('button:has-text("Add")');
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