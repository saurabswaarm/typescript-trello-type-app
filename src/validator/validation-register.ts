namespace app {
    interface Validator {
        type: string;
        status?: boolean;
        minLength?: number;
        maxlength?: number;
        min?: number;
        max?: number;
    }
    
    interface ValidationRegister {
        [classInQuestion: string]: {
            [propertyInQuestion: string]: Validator[];
        }
    }
    
    export let validationRegister: ValidationRegister = {}


    export function setRegister(target: any, key: string, validator: Validator) {

        let existingflags = validationRegister[target.constructor.name] ? validationRegister[target.constructor.name][key] : null;
    
        validationRegister[target.constructor.name] = {
            ...validationRegister[target.constructor.name],
            [key]: existingflags ? [...existingflags, validator] : [validator]
        }
    }
}