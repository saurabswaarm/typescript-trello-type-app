    import {validationRegister} from "./validation-register.js";
    
    export default function validate(object: any): boolean {
        //lookup the class in the validation register
        //find all validations that need to be comitted
        //check all those validation
        //if pass return true else false
    
        let result: boolean = true;
    
        if (!validationRegister[object.constructor.name]) {
            return result;
        }
    
        for (const classProperty in validationRegister[object.constructor.name]) {
            for (const validator of validationRegister[object.constructor.name][classProperty]) {
    
                switch (validator.type) {
                    case 'required':
                        result = result && !!(object[classProperty].toString().trim());
                        break;
    
                    case 'length':
                        if (typeof object[classProperty] == "string") {
                            if (object[classProperty].length > validator.maxlength! || object[classProperty].length < validator.minLength!) {
                                result = false;
                            }
                        }
                        break;
    
                    case 'range':
                        if (typeof object[classProperty] == "number") {
                            if (object[classProperty] > validator.max! || object[classProperty] < validator.min!) {
                                result = false;
                            }
                        }
                        break;
                }
            }
        }
    
        return result;
    }