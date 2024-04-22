import connector from "../../utils/connector";
const Variables = require('../../Variables');

class CommonUtils {

    constructor(options) {
        this.options = options;
        this.endPoints = {
            post: 'create',
            patch: 'edit',
            get: 'read',
            delete: 'delete'
        }
    };

    buildUrl(){
        let url = `${Variables.Variables.hostId}/${this.options.accInfo[0]}/${this.options.accInfo[1]}/`;
        // Check for selectedNodes and form url accordingly!
        if(this.options.selectedNodes){
            url += encodeURIComponent(JSON.stringify(this.options.selectedNodes)) + "/";
        }
        url += this.options.widgetName + "/" + this.endPoints[this.options.method];
        // Check a condition and add query parameters accordingly
        if (this.options.query) {
            url += '?';
            Object.keys(this.options.query).forEach((query) => {
                url += `${query}=${this.options.query[query]}&`;
            });
        }
        return url;
    };

    static async dispatchRequest(options){
        const utilsInstance = new CommonUtils(options);
        return await connector[options.method](utilsInstance.buildUrl(), options.data);
    };
}

export default CommonUtils;