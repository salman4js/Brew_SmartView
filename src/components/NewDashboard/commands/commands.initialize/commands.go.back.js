import lang from '../commands.constants';

class CommandsGoBack {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getGoBackIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-GoBack'
        }
        /**
         Router options for the table view. Options that has to be passed to the dashboard controller defines the previous perspective.
         Those options based on the last router will be defined as the object here.
         **/
        this.routerOptions = {
            'default-view': {reloadSidepanel: {silent: true}, navigateToPropertyContainer: true},
            'property-container': {reloadSidepanel: {silent: true}, persistStatusView:true, updatedModel: this.status?.originatingView?.widgetTileModel?.data.roomModel}
        };
    };

    enabled(){
        if(this.status.roomConstantKey && this.status.roomConstantKey !== 'property-container'){
            return lang.isCommandsEnabled.goBack.includes(this.status.roomConstantKey) && this.status.nodes.length < 1;
        }
        return true;
    };

    execute(){
        // Before navigating back to the last router instance, Delete the current router / last router from the stateRouter model first.
        this.status.eventHelpers.routerController()._notifyStateRouter({routerOptions: {action: 'DELETE'}}).then((result) => {
            const options = this.routerOptions[result.stateModel[result.stateModel.length - 1]] || this.getExtendedRouterOptions(result);
            options.queryParams = []; // On every back navigation, clear off the query params.
            options.isAdminAction = true; options.onPropertyBaseSave = true;
            options.adminAction = undefined; options.propertyDataCallBackFunc = undefined;
            this.status.eventHelpers.dashboardController(options);
        });
    };

    getGoBackIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                 className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
        )
    };

    getExtendedRouterOptions(stateRouter){
        return {reloadSidepanel: {silent: true}, navigateToStatusTableView: true,
            dashboardMode: stateRouter.dashboardModel[stateRouter.dashboardModel.length - 1],
            selectedRoomConstant: stateRouter.tableModel[stateRouter.tableModel.length - 1]};
    };
}

export default CommandsGoBack;