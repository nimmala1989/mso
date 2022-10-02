import { test } from '@playwright/test';
import { Endpoints } from '../../config/setup';
import { CustomWaits } from '../../pages/common';
import { Login } from '../../pages/login.po';
import { Create } from '../../pages/tagsCondition/create.po';
import { Table } from '../../pages/tagsCondition/table.po';
import { EditOrView } from '../../pages/tagsCondition/editOrView.po';


test.describe.serial("Create and verify value", async () => {
    let login: Login
    let customWaits: CustomWaits
    let tagCondition: Create;
    let authorizationToken: any
    let table: Table
    let editOrView: EditOrView

    // Global Tag condition names
    let data = {
        name: "",
        type: "",
        enabled: false,
        expirationDate: "",
        context: "",
        assignedProcesses: "",
        assignedRules: ""
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

    test('Verify name is correct', async () => {
        await table.selectByName(data.name)
        await editOrView.name.verify(data.name)
    })

    test('Verify type is correct', async () => {
        await table.selectByName(data.name)
        await editOrView.type.verify(data.type)
    })

    test("Verify Enable checkbox status is correct", async () => {
        await table.selectByName(data.name)
        await editOrView.enable.verify(data.enabled)
    })

    test("Verify Expiration checkbox status and value is correct", async () => {
        await table.selectByName(data.name)
        if (data.expirationDate != "") {
            await editOrView.expiration.verify(true)
            await editOrView.expiration.verifyInput(data.expirationDate)
        } else {
            await editOrView.expiration.verify(false)
        }
    })

    test("Verify context value", async () => {
        await table.selectByName(data.name)
        await editOrView.context.verify(data.context)
    })

    test("Verify Assigned Processes value", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedProcesses.verify(data.assignedProcesses)
    })

    test("Verify Assigned Rules value", async () => {
        await table.selectByName(data.name)
        await editOrView.assignedRules.verify(data.assignedRules)
    })
})
