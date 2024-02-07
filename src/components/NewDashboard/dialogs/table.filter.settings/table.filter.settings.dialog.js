import lang from "../dialog.constants";
import dialogFilterOptions from "./table.filter.settings.dialog.options";
import _ from 'lodash';

class TableFilterSettingsDialog {

    constructor(signatureOptions) {
        this.status = signatureOptions;
    };

    static enabled(constantKey) {
        return lang.TABLE_FILTER.tableFilterAllowedKeys.includes(constantKey);
    };

    onFilter(){
        // Get the state value from customBodyViewOptions.
        this.status.eventHelpers.validateStateFields({fieldProp: ['placeholder']}).then((result) => {
            // When filtering some state field values could be undefined, Have to remove all those undefined values before making a request.
            var filterParam = _.omitBy(result.node, _.isNil);
            // Prepare facets options.
            this.status.eventHelpers.prepareFacetOptions({filterParam, fieldProp: result.fieldProp});
            this.status.eventHelpers.triggerTableLoader(true, false);
            this.status.eventHelpers.prepareFilterOptions(filterParam);
            this.status.eventHelpers.collapseCustomModal();
        });
    };

    getCustomBodyViewOptions(){
        return dialogFilterOptions[this.status.roomConstantKey]();
    };

    getDialogOptions(){
        return {
            header: lang.TABLE_FILTER.tableFilterLabel,
            restrictBody: false,
            renderCustomBodyView: true,
            customBodyViewOptions: this.getCustomBodyViewOptions(),
            footerEnabled: true,
            footerButtons: [
                {
                    btnId: lang.TABLE_FILTER.footerButtons.primaryBtn,
                    variant: "success",
                    onClick: () => this.onFilter()
                }
            ]
        };
    };

    static execute(signatureOptions) {
        const instance = new TableFilterSettingsDialog(signatureOptions);
        return instance.getDialogOptions(); // return the options from the instance
    };
}

export default TableFilterSettingsDialog;
