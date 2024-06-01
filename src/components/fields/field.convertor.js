import _ from "lodash";
import MetadataFieldTemplateState from "./metadata.field.templatestate";

export function createFields(fieldOptions){
    let fieldState, fieldKeys, fields = [];
    fieldOptions.map((opts) => {
        if(!opts.attribute) {
            throw new Error('attribute must be specified!');
        } else {
            fieldState = _.clone(MetadataFieldTemplateState[opts.attribute]);
            fieldKeys = Object.keys(opts);
            fieldKeys.map((fieldKey) => {
                fieldState[fieldKey] = opts[fieldKey];
            });
            fields.push(fieldState);
        }
    });
    return fields;
}