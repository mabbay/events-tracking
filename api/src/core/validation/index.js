const _ = require('lodash');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
// validate
module.exports = class Validation {
    constructor(data, update) {
        this.Joi = Joi;
        this.data = data;
        this.update = update;
    }
    validate() {
        const result = this.getResult();
        this.error = result.error;
        this.data = result.data;
    }
    getResult() {
        if (!this.update) return this.schema.validate(this.data);
        let data = JSON.parse(JSON.stringify(this.data)); //??
        let result = validateObject(this.schema, data);
        if (result.error) return result;
        // result = this.schema.validate(data);
        // if(result.error) return result;
        else return { value: this.data };
    }
}
// validate an object in case of an update
// path: path to variable, like obj.property, obj.innerObj.property and so on
function validateObject(JoiSchema, newObject, path) {
    for (const index in JoiSchema.$_terms.keys) {
        const { key, schema } = JoiSchema.$_terms.keys[index];
        const currentPath = path ? path + '.' + key : key;
        if (!(key in newObject)) continue;

        let result; const val = newObject[key];
        if (schema.type === 'object' && (val instanceof Object) && !(val instanceof Array))
            result = validateObject(schema, newObject[key], currentPath);
        else if (schema.type === 'array' && newObject[key] instanceof Array)
            result = validateArray(schema, newObject[key], currentPath);
        else
            result = schema.validate(newObject[key]);

        if (result.error) {
            let message = result.error.details[0].message;
            result.error.details[0].message = formatErrorMessage(currentPath, schema, message);
            return result;
        }
    }
    return { value: {} };
}

function validateArray(JoiSchema, items, path) {
    const itemSchema = JoiSchema.$_terms.items[0];
    // if array of string or number ..., we can validate it in one call
    if (!['object', 'array'].includes(itemSchema.type)) {
        return JoiSchema.validate(items);
    }
    for (let i = 0; i < items.length; i++) {
        const currentPath = path + `[${i}]`;
        let result;
        if (itemSchema.type === 'object' && (items[i] instanceof Object) && !(items[i] instanceof Array))
            result = validateObject(itemSchema, items[i], currentPath);
        else if (itemSchema.type === 'array' && items[i] instanceof Array)
            result = validateArray(itemSchema, items[i], currentPath);
        else // item[i] does not respect the type of the array
            result = itemSchema.validate(items[i]);

        if (result.error) {
            const message = result.error.details[0].message;
            result.error.details[0].message = formatErrorMessage(currentPath, itemSchema, message);
            return result;
        }
    }
    return { value: {} };
}

// make error message more clear
function formatErrorMessage(key, schema, message) {
    if (schema.type === 'array') {
        message = message.replace(/"(\[\d+\])"/, `${key}$1`); // "[i]" --> key[i]
    } else if (schema.type === 'object') {
        message = message.replace(/^"(.+)"/, `${key}`);
    }
    message = message.replace('"value"', key); // "value" ---> key
    return message;
}

// function validateArray(object, newObject){
//     for(let index=0;index<object.$_terms.items.length;index++){
//         if(object.$_terms.items[index].type == 'object'){
//             for(let index2=0;index2<newObject.length;index2++){
//                 const newSchema = _.cloneDeep(object.$_terms.items[index]);
//                 validateObject(newSchema, newObject[index2]);
//                 return newSchema.validate(newObject[index2]);
//             }
//         }else if( object.$_terms.items[index].schema && object.$_terms.items[index].schema.type == 'array'){
//             validateArray(object.$_terms.items[index], newObject[index]);
//         }
//     };
//     return { value : {}};
// }

// function validateObject(object, newObject){
//     if(object.$_terms.keys == null) return { value : {}};
//     for(let index=0;index<object.$_terms.keys.length;index++){
//         if(!(object.$_terms.keys[index].key in newObject)){
//             object.$_terms.keys.splice(index, 1);
//             index--;
//         }else{
//             if(object.$_terms.keys[index].schema.type == 'object'){
//                 validateObject(object.$_terms.keys[index].schema, newObject[object.$_terms.keys[index].key]);
//             }else if(object.$_terms.keys[index].schema.type == 'array'){
//                 const result = validateArray(object.$_terms.keys[index].schema, newObject[object.$_terms.keys[index].key]);
//                 if(result.error){
//                     return result;
//                 }else {
//                     delete(newObject[object.$_terms.keys[index].key]);
//                     object.$_terms.keys.splice(index, 1);
//                     index--;
//                 }
//             }
//         }
//     };
//     return { value : {}};
// }