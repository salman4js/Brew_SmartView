import lang from '../commands.constants';
import ChatPerformer from "../../../chat.performer/chat.performer.view";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import {nodeConvertor} from "../../../common.functions/node.convertor";
import InputAnalyser from "../../../chat.performer/chat.input.analyzer";

class CommandsConnect {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this._getUserSettingsIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Connect'
        }
    };

    _getChatInputOptions(){
        return [{
            value: undefined,
            width: '460px',
            placeholder: "Enter Any Room No",
            name: 'askQa',
            eventKeyRequired: true,
            eventKey: undefined,
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid input.'
            },
            callBackAfterUpdate: (fieldState) => this._performChatOperation(fieldState)
        }]
    };

    enabled(){
        return lang.isCommandsEnabled.connect.includes(this.status.roomConstantKey);
    };

    execute(){
        this._setUpDefaultGreetingMessage();
        const chatPerformerView = this._setUpChatPerformerView();
        this.status._setState && this.status._setState({key: 'bodyView', value: chatPerformerView});
        const footerFields = this._getChatInputOptions();
        this.status._setState && this.status._setState({key: 'customState', value: footerFields});
        this._setUpStepperWizardState();
        this.status.dialogReady();
    };

    _performChatOperation(fieldState){
        var requiredFieldValues = ['eventKey'];
        var textInput = nodeConvertor(fieldState, requiredFieldValues);
        if(textInput.eventKey === 'Enter'){
            this._updateStepperWizardChats(textInput.askQa, 'user');
            var chatPerformer = new InputAnalyser(textInput.askQa);
            var responseData = chatPerformer.analyzeInput();
            responseData.response && this._updateStepperWizardChats(responseData.response, 'chat-bot', responseData.detailsMessage, responseData.roomModelId);
        }
    };

    _updateStepperWizardChats(content, initiator, detailsMsg, roomModelId){
        const newMessage = {
            content: content,
            sender: initiator,
            detailsMsg: detailsMsg,
            roomModel: roomModelId
        };
        CollectionInstance.setCollections('chat-collections', newMessage);
        this.status.state.stepperWizard.additionalParams.push(newMessage);
        this.status._setState({key: 'stepperWizard', value: this.status.state.stepperWizard});
        this.execute();
    };

    _setUpStepperWizardState(){
        this.status.state.stepperWizard.header = lang.CONNECT.header;
        this.status._setState && this.status._setState({key: 'stepperWizard', value: this.status.state.stepperWizard});
    };

    _setUpDefaultGreetingMessage(){
        // Check if default greetings has already been added!
        const chatCollections = CollectionInstance.getCollections('chat-collections');
        if(!chatCollections){
            const defaultGreetings = [{content: lang.CONNECT.defaultGreetings, sender: 'chat-bot'}];
            CollectionInstance.setCollections('chat-collections', defaultGreetings);
        }
    }

    _setUpChatPerformerView(){
        return(
            <div className = 'app-header-body-view'>
                <ChatPerformer data = {this.status.state.stepperWizard.additionalParams} goToLocation = {(roomModel) => this.status.goToLocation({model: roomModel})}/>
            </div>
        )
    };

    _getUserSettingsIcon(){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                 className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
        )
    };
}

export default CommandsConnect;