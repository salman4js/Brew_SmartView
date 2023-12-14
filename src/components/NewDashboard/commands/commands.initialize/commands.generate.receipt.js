import lang from '../commands.constants';
class CommandsGenerateReceipt {
    constructor(signatureOptions) {
      this.status = signatureOptions;
      this.isDisabled = this.enabled();
      this.defaults = {
        value: lang.GENERATE_RECEIPT.generateReceipt,
        disabled: this.isDisabled,
        onClick: () => this.execute()
      };
    };

    enabled(){
        return !lang.isCommandsEnabled.generateReceipt.includes(this.status.roomConstantKey);
    };

    execute(){
        this._fetchPaymentTrackerDetails();
        this._prepareControllerOptions();
        this.status.eventHelpers.dashboardController(this.dashboardControllerOpts);
    };

    // Fetch payment tracker invoice details for selected nodes.
    _fetchPaymentTrackerDetails(){

    };

    // Prepare dashboard controller options!
    _prepareControllerOptions(){
      this.dashboardControllerOpts = {
          dashboardMode: lang.GENERATE_RECEIPT.dashboardMode,
          generateReceipt: true
      };
    };
}

export default CommandsGenerateReceipt;