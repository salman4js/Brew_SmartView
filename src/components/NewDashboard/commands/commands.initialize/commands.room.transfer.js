import lang from "../commands.constants";
import CheckoutFormView from "../../property.container/checkout.view/checkout.form.view";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CommandsRoomTransfer extends CheckoutFormView{
    constructor(signatureOptions) {
        super(signatureOptions);
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            value: lang.roomTransferCommand,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    async execute(){
        this._prepareOptions();
        this._initializeStateObjects();
        await this._getTargetedModel();
    };

    enabled(){
        return !(lang.isCommandsEnabled.roomTransfer.includes(this.status.roomConstantKey) && this.status.nodes.length === 1);
    };

    // Get the targeted model to navigate to checkout.form.view.
    async _getTargetedModel(){
        // Targeted model is always going to be single node.
        this.state.userModel = CollectionInstance.whereInCollections('userCollections',undefined, '_id', this.status.nodes[0])[0];
        // Find the current room model through userModel id attribute.
        this.state.data.roomModel = CollectionInstance.whereInCollections('roomsListCollection', undefined, 'user', this.state.userModel._id)[0];
        await this.fetchBillingDetails();
    };

    // Initialize this dummy state objects to blend in with checkout.form.view.
    _initializeStateObjects(){
        this.state = {
            data: {},
            userModel: {},
            billingDetails: {},
            billingInfo: {}
        };
        this.props.updateSelectedModel = (roomModel, dashboardMode, userModel) => this.status.eventHelpers.updateSelectedModel({roomModel, dashboardMode, userModel});
    };

    // Override the fetchBillingDetails method to avoid preventing state errors.
    async fetchBillingDetails() {
        this.status.eventHelpers.triggerTableLoader(true, true);
        var params = {roomtype: this.state.data.roomModel.suiteName,
            stayeddays: this.calculateStayedDays() + ' Days',
            roomid:this.state.data.roomModel._id,
            isHourly: this.getIsHourly(), extraCalc: this.getIsExtraCalcEnabled()
        };
        var result = await this.checkoutUtils.fetchBillingDetails(params);
        if(result.data.success){
            this.status.eventHelpers.triggerTableLoader(false, false);
            this.state.billingDetails = result.data;
            this.calculateGSTPrice();
        } else {
            // TODO: When this call fails, redirect the user into bill preview to perform the transfer operation.
        }
    };

    // Prepare the checkout details/billing information by override the setState function from checkout.form.view.
    // Setting the required billingInfo here needed to prepare the checkout details by checkout.form.view.
    setBillingInformation() {
        this.state.billingInfo.gstPrice = this.gstPrice;
        super.prepareUserCheckoutDetails();
        this.status.eventHelpers.dashboardController(this.transferOptions);
    };

    // Prepare options for filter.table to perform room transfer.
    // Same function extended in command.favorites for favorites checkin.
    _prepareOptions(){
        this.transferOptions = {
            navigateToStatusTableView: true,
            selectedRoomConstant: lang.ROOM_TRANSFER.filteredRoomStatusConstant,
            dashboardMode: lang.ROOM_TRANSFER.dashboardMode,
            isRoomTransferCommand: true
        };
    };
}

export default CommandsRoomTransfer;