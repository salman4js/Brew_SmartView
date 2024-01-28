import lang from "../commands.constants";
import _ from 'lodash';

class CommandsTableFilterSettings {

    constructor(signatureOptions) {
        this.status = signatureOptions;
    };

    static enabled(constantKey) {
        return lang.TABLE_FILTER.tableFilterAllowedKeys.includes(constantKey);
    };

    onFilter(){
      // Get the state value from customBodyViewOptions.
      this.status.eventHelpers.validateStateFields().then((result) => {
          // When filtering some state field values could be undefined, Have to remove all those undefined values before making a request.
          result = _.omitBy(result, _.isNil)
          this.status.eventHelpers.triggerTableLoader(true, false);
          this.status.eventHelpers.prepareNextNodeOptions(result);
          this.status.eventHelpers.collapseCustomModal();
      });
    };

    getCustomBodyViewOptions(){
        return [{
            value: undefined,
            placeholder: lang.TABLE_FILTER.dialogOptionsLabelAndPlaceholder.checkoutBy,
            name: 'checkoutBy',
            attribute: 'textField',
            isRequired: false
        }, {
            value: undefined,
            placeholder: lang.TABLE_FILTER.dialogOptionsLabelAndPlaceholder.checkinBy,
            name: 'checkinBy',
            attribute: 'textField',
            isRequired: false
        }, {
            value: undefined,
            placeholder: lang.TABLE_FILTER.dialogOptionsLabelAndPlaceholder.username,
            name: 'username',
            attribute: 'textField',
            isRequired: false
        }];
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
        const instance = new CommandsTableFilterSettings(signatureOptions);
        return instance.getDialogOptions(); // return the options from the instance
    };
}

export default CommandsTableFilterSettings;
