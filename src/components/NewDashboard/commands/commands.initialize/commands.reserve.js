import _ from "lodash";
import lang from '../commands.constants';
import {createFields} from "../../../fields/field.convertor";
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";

class CommandsReserve {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            disabled: this.isDisabled,
            signature: 'Command-Reserve',
            onClick: () => this.execute()
        };
        this.options = {
            show: true,
            nextStep: ['next'],
            prevStep: ['back'],
            callBackBeforeNextStep: {
                next: {
                    callBackMethod: (options) => this.getAvailableModels(options)
                }
            },
            footerView: [],
            footerAttribute: 'buttonField',
            header: lang.RESERVE_COMMAND.stepperWizardHeader,
            enableFooter: true,
            additionalParams: [],
            passingProps: 'additionalParams'
        }
    };

    enabled(){
        return false;
    };

    execute(){
        this.createFooterSteps()
        return {steps: this.createInitialCheckInStep(), options: this.options};
    };

    createFooterSteps(){
        lang.RESERVE_COMMAND.footerStep.map((fStep) => {
            this.options.footerView.push(createFields(fStep));
        })
    };

    createInitialCheckInStep(){
        this.initialCheckInStepField = {
            bodyView: []
        }
        this.initialCheckInStepField.bodyView.push(createFields(lang.RESERVE_COMMAND.selectDate));
        return this.initialCheckInStepField;
    };

    getAvailableModels(options){
        const modelsToCheck = ['afterCheckin', 'afterCleaned'],
            updatedValue = [], checkBoxFields = [];
        modelsToCheck.map((state) => {
            this.status.widgetTileModel[this.status.userStatusMap[state]].map((model) => {
                if(model.prebookDateofCheckin.length > 0){
                    for(let i = 0; i < model.prebookDateofCheckin.length; i++){
                        // Filter date of checkout should be always lesser than the prebook date of checkin!
                        if (new Date(options.currentStepFieldData.checkout) < new Date(model.prebookDateofCheckin[i])) {
                            updatedValue.push(model.roomno);
                        }
                    }
                } else {
                    updatedValue.push(model.roomno);
                }
            });
        });
        const checkBoxField = _.clone(MetadataFieldTemplateState.checkBoxField),
            labelField = _.clone(MetadataFieldTemplateState.labelField);
        labelField.label = lang.RESERVE_COMMAND.selectRoomViewLabel
        checkBoxField.customStyle = {
            color: 'black',
            border: '1px solid grey',
            backgroundColor: '#EDEADE',
            padding: '5px 5px 5px 5px',
            borderRadius: '5px',
            marginBottom: '20px'
        }
        checkBoxField.isLabelFirst = false;
        updatedValue.map((value) => {
            checkBoxField.label = value;
            checkBoxFields.push(_.clone(checkBoxField));
        });
        checkBoxFields.unshift(labelField);
        return {updateNextStepFieldValue: true, value: createFields(checkBoxFields)};
    };
}

export default CommandsReserve;