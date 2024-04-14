import React from 'react';
import _ from "lodash";
import {_updateUserPreferences} from "../../../utils/user.preference.utils";
import UserPreferenceSelectionConstants from "./user.preference.selection.constants";
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";
import MetadataFields from "../../../fields/metadata.fields.view";
import {getStorage} from "../../../../Controller/Storage/Storage";
import {nodeConvertor, updateMetadataFields} from "../../../common.functions/node.convertor";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import {activityLoader} from "../../../common.functions/common.functions.view";

class UserPreferenceSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            userPreferencesFields: []
        };
        this.view = React.createRef()
    };

    templateHelpers(){
        if(!this.state.isLoading){
            return(
                <div ref = {this.view}>
                    <MetadataFields data = {this.state.userPreferencesFields} updateData = {(updatedData) => this.setState({userPreferencesFields: updatedData})}/>
                </div>
            )
        } else {
            var opts = {
                color: 'black',
                textCenter: true,
                marginTop: (this.view?.current?.offsetHeight / 2) + 'px',
                marginBottom: (this.view?.current?.offsetHeight / 2) + 'px'
            }
            return activityLoader(opts);
        }
    };

    isLoggedInAsRecep(){
        return JSON.parse(getStorage('loggedInAsRecep'));
    };

    _applyUserPreferences(){
        this._toggleLoader(true);
        var fieldValue = nodeConvertor(this.state.userPreferencesFields);
        fieldValue['accId'] = this.props.params.accIdAndName[0];
        _updateUserPreferences(fieldValue).then(() => {
            this._setUpUserPreferenceFields();
            this._toggleLoader(false);
            this.props.refreshState();
        });
    };

    _updateStateComponent(options){
      this.setState({[options.key]: options.value}, () => {
         _.isFunction(options.nextFunc) && options.nextFunc();
      });
    };

    _toggleLoader(val){
      this.setState({isLoading: val});
    };

    async _setValueForUserPreferenceFields(){
        var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections'),
            collection = Object.keys(widgetTileCollection.data),
            updatedFields;
        for (var model of collection){
            if(typeof widgetTileCollection.data[model] === 'object'){
                await updateMetadataFields(model, {value: true}, this.state.userPreferencesFields,
                    (updatedData) => {
                        updatedFields = updatedData;
                    })
            } else {
                await updateMetadataFields(model, {value: widgetTileCollection.data[model]}, this.state.userPreferencesFields,
                    (updatedData) => {
                        updatedFields = updatedData;
                    });
            }
        }
        this._updateStateComponent({key: 'userPreferencesFields', value: updatedFields, nextFunc: () => this._toggleLoader(false)});
    };

    _prepareFieldsForUserPreferenceSelection(preferenceKey){
        const field = _.clone(MetadataFieldTemplateState.checkboxField);
        field.name = preferenceKey;
        field.label = UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].label;
        field.customStyle = UserPreferenceSelectionConstants.userPreferenceCheckboxCustomStyle;
        field.restrictShow = UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].restrictShow;
        if(UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].restrictShow === false){
            // Check for user permissions!
            field.restrictShow = this.isLoggedInAsRecep();
        }
        if(UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].attribute){
            field.attribute = UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].attribute;
        }
        return field;
    }

    _setUpUserPreferenceFields(){
        const userPreferenceField = [],
            me = this;
        function _prepareFields(preferenceKey){
            if(me.props.params._getWidgetTilePreference('administrativePageEnabled')){
                if(UserPreferenceSelectionConstants.userPreferenceFieldValue[preferenceKey].isAdminAction){
                    return me._prepareFieldsForUserPreferenceSelection(preferenceKey);
                }
            } else {
                return me._prepareFieldsForUserPreferenceSelection(preferenceKey);
            }
        }
        Object.keys(UserPreferenceSelectionConstants.userPreferenceFieldValue).forEach((preferenceKey) => {
            var field = _prepareFields(preferenceKey);
            field && userPreferenceField.push(field);
        });
        const buttonField = _.clone(MetadataFieldTemplateState.buttonField);
        buttonField.btnValue = UserPreferenceSelectionConstants.preferenceSaveButtonKey;
        buttonField.onClick = () => this._applyUserPreferences();
        userPreferenceField.push(buttonField);
        this._updateStateComponent({key: 'userPreferencesFields', value: userPreferenceField, nextFunc: () => this._setValueForUserPreferenceFields()})
    };

    render(){
      return this.templateHelpers();
    };

    componentDidMount() {
        this._setUpUserPreferenceFields();
    };
}

export default UserPreferenceSelection;