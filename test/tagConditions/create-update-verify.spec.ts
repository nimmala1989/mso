import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { Create } from '../../pages/tagsCondition/create.po';
import { Table } from '../../pages/tagsCondition/table.po';
import { EditOrView } from '../../pages/tagsCondition/editOrView.po';


test.describe.serial("Update Tag Conditions", async () => {
    let login: Login
    let customWaits: CustomWaits
    let tagCondition: Create;
    let authorizationToken: any
    let table: Table
    let editOrView: EditOrView

    // Global Tag condition names
    let data = {
        name: "testing - Al9x",
        type: "",
        enabled: false,
        expirationDate: "",
        context: "",
        assignedProcesses: "",
        assignedRules: "",
        updated_name: "",
        updated_type: "",
        updated_enabled: false,
        updated_expirationDate: "",
        updated_context: "",
        updated_assignedProcesses: "",
        updated_assignedRules: ""
    }

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        login = new Login(page);
        customWaits = new CustomWaits(page);
        tagCondition = new Create(page);
        table = new Table(page);
        editOrView = new EditOrView(page);

        page.on('request', async request => {
            let allHeaders = await request.allHeaders()
            if (allHeaders.authorization && allHeaders.authorization != 'Bearer null') {
                authorizationToken = allHeaders.authorization
            }
        })
        await page.goto(Endpoints.baseUrl + Endpoints.baseEndpoint, { timeout: 120000, waitUntil: 'load' });
        await login.loginToTheApplication()
        await login.selectClient('FAB2')
        await customWaits.waitForFiltersToLoad()

        // Create a tag condition
        await tagCondition.navigateToPage()
        await tagCondition.openCreatePopup()
        data.name = await tagCondition.enterName("testing")
        data.type = await tagCondition.selectType("Allowed")
        data.enabled = await tagCondition.selectEnable()
        data.expirationDate = await tagCondition.enterExpiration('7/22/2026')
        const contextFields = await tagCondition.openContexts()
        await contextFields.selectProd()
        await contextFields.clickOk()
        data.context = await contextFields.getSelectedContext() || ""
        const assignedProcess = await tagCondition.openAssignedProcesses()
        await assignedProcess.selectSamplingProcess()
        await assignedProcess.clickOk()
        data.assignedProcesses = await assignedProcess.getSelectedValues() || ""
        const assignedRules = await tagCondition.openAssignedRules()
        await assignedRules.selectSamplingRules()
        await assignedRules.clickOk()
        data.assignedRules = await assignedRules.getSelectedValues() || ""
        await tagCondition.submit()
        await tagCondition.enterComment()
    })

    test('Verify Tag condition is created', async () => {
        await table.selectByName(data.name)
    })

    test('Verify name is updated', async () => {
        await table.selectByName(data.name)
        data.updated_name = await editOrView.name.update("updated")
        await editOrView.saveChanges()
        await editOrView.name.verify(data.updated_name)
    })

    test('Verify type is updated', async () => {
        await table.selectByName(data.name)
        data.updated_type = await editOrView.type.update("Always")
        await editOrView.saveChanges()
        await editOrView.type.verify(data.updated_type)
    })

    test("Verify Enable check value is correct", async () => {
        await table.selectByName(data.name)
        data.updated_enabled = await editOrView.enable.uncheck()
        await editOrView.saveChanges()
        await editOrView.enable.verify(data.updated_enabled)
    })

    test("Verify Expiration checkbox status and value is correct", async () => {
        await table.selectByName(data.name)
        await editOrView.expiration.check()
        data.updated_expirationDate = await editOrView.expiration.input("8/21/2027")
        await editOrView.saveChanges()
        await editOrView.expiration.verify(true)
        await editOrView.expiration.verifyInput(data.updated_expirationDate)
        await editOrView.expiration.uncheck()
        await editOrView.saveChanges()
        await editOrView.expiration.verify(false)
    })

    test("Verify context value can be added", async () => {
        await table.selectByName(data.name)
        await editOrView.context.addNewContext()
        await editOrView.saveChanges()
    })

    test("Verify context value can be removed", async () => {
        await table.selectByName(data.name)
        await editOrView.context.removeContextAndVerify(1)
        await editOrView.saveChanges()
    })

    test("Verify Assigned Processes value can be removed", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedProcesses.removeAssignedProcessesAndVerify()
        await editOrView.saveChanges()
    })

    test("Verify Assigned Processes value can be added", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedProcesses.addNewAssignedProcesses()
        await editOrView.saveChanges()
    })

    test("Verify Assigned Rules can be removed", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedRules.removeAssignedRulesAndVerify(1)
        await editOrView.saveChanges()
    })

    test("Verify Assigned Rules can be added", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedRules.addNewAssignedRules(2)
        await editOrView.saveChanges()
    })
})
