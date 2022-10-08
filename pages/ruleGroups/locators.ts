export default class RuleGroupLocators {
    ruleGroup_link = 'text=Rule Groups'
    openCreateDialogue_button = 'button:has-text("Create a rule group")'
    create_dialogue = 'app-create-rule-group'
    id_textbox = '#id'
    display_textbox = '#display'
    color_textbox = '#backgroundColor'

    // color picker
    color_curser = `${this.color_textbox} + color-picker .saturation-lightness .cursor`
    color_input = `${this.color_textbox} + color-picker .hex-text input`
    color_cancel_button = `${this.color_textbox} + color-picker button:has-text("Cancel")`
    color_ok_button = `${this.color_textbox} + color-picker button:has-text("Ok")`

    description_textbox = '[formcontrolname="description"]'
    dynamicSkipWipLimit_textbox = '#dynamicSkipWipLimit'
    toolMsoGroup_dropdown = '[class="select-search"] mat-select'
    toolMsoGroup_selectedOption = '.mat-select-value .mat-select-min-line'
    toolMsoGroup_deleteButton = 'button.del-btn'
    linksReqAllowedTagCond_checkbox = '[formcontrolname="linksReqAllowedTagCond"] .mat-checkbox-inner-container'
    dynamicToolStatusCond_checkbox = '[formcontrolname="dynamicToolStatusCond"] .mat-checkbox-inner-container'
    cancel_dialogue_button = 'app-modal-footer button:has-text("Cancel")'
    submit_create_button = 'app-modal-footer button:has-text("Create")'

    // Side Dialogue
    ruleGroupSideDialogue = 'mat-drawer[mode="side"]'
    ruleGroupSideDialogueLabel = '.rule-form-border-bottom > div > span'
    delete_button = 'button:has-text("Delete")'
    toolMsoGroup_remove = 'button.del-btn'
    save_button = '#saveButton'
    close_button = '[container="body"][aria-label="Close"]'

    // Table
    table = 'app-rules-table'
    header = 'thead [role="columnheader"]'
    rows = 'tbody tr'
    display_col = '.cdk-column-display'
    description_col = '.cdk-column-description'
    options_col = '.cdk-column-options'
    numRules_col = '.cdk-column-numRules'
    updated_col = '.cdk-column-updated'
}
