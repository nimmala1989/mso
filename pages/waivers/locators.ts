export default class RuleGroupLocators {
    waiver_link = 'text=Waivers'
    openCreateDialogue_button = 'button:has-text("Create Waiver")'

    // Create Dialogue
    create_dialogue = 'app-create-waiver'
    // Preset
    type_preset_button = 'mat-dialog-content [formcontrolname="waiverType"] [value="PRESET"]'
    present_tag_all_lots_radioButton = 'input[value="ALL"]'
    present_tag_all_lots_expiration_textbox = '[id="date"]'
    present_tag_all_lots_hoursCrtl_dropdown = '[id="hoursCrtl"]'
    present_tag_all_lots_minutesCrtl_dropdown = '[id="minutesCrtl"]'
    present_tag_all_lots_meridian_button = '[name="meridian"]'
    present_tag_next_lots_radioButton = 'input[value="NXT_TAG"]'
    present_tag_DELAY_lots_radioButton = 'input[value="DELAY"]'
    present_tag_DELAY_lots_delayCounter_textbox = '[id="delayCounter"]'

    // Skip
    type_skip_button = 'mat-dialog-content [formcontrolname="waiverType"] [value="SKIP"]'
    type_skip_expiration_radioButton = 'input[value="false"]'
    type_skip_expire_on_next_tag_radioButton = 'input[value="true"]'
    type_skip_definition_maxConSkipTrgMesActnWvr_textbox = '#maxConSkipTrgMesActnWvr'
    type_skip_definition_minConSkipAllowTagWvr_textbox = '#minConSkipAllowTagWvr'
    type_skip_definition_maxConSkipTagNextLotWvr_textbox = '#maxConSkipTagNextLotWvr'

    // Risk
    type_risk_button = 'mat-dialog-content [formcontrolname="waiverType"] [value="RISK"]'
    type_risk_definition_maxLarTriggerMesActnWvr_textbox = '#maxLarTriggerMesActnWvr'

    tool_dropdown = '#tool'
    tool_selectedValue = '#tool .mat-select-min-line'
    smpRuleName_dropdown = '#smpRuleName'
    smpRuleName_selectedValue = '#smpRuleName .mat-select-min-line'
    description_textbox = '[formcontrolname="description"]'

    cancel_dialogue_button = 'app-modal-footer button:has-text("Cancel")'
    submit_create_button = 'app-modal-footer button:has-text("Create")'

    // Side Dialogue
    sideDialogue = 'app-edit-waiver'
    edit_menu_dropdown = '#dropdownEditMenu'
    delete_button = 'button:has-text("Delete")'
    delete_dialogue_button = 'app-delete-confirmation .btn-danger'
    save_button = '#saveButton'
    close_button = '[aria-label="Close"]'
    type_label = 'section label:has-text("Type") + span'
    tool_label = '[for="tool"] + div span'
    ruleName_label = '[for="smpRuleName"] + div span span'

    // Table
    table = 'mat-table.mat-table'
    header = 'mat-header-row mat-header-cell'
    rows = 'mat-table mat-row'
    type_col = '.cdk-column-TYPE'
    tool_col = '.cdk-column-TOOL'
    rule_col = '.cdk-column-RULE'
    definition_col = '.cdk-column-DEF'
    expiration_col = '.cdk-column-EXP'
    updated_col = '.cdk-column-UPDATE'
}
