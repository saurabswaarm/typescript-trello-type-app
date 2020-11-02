import { validationRegister } from "./validation-register.js";
export default function validate(object) {
    let result = true;
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
                        if (object[classProperty].length > validator.maxlength || object[classProperty].length < validator.minLength) {
                            result = false;
                        }
                    }
                    break;
                case 'range':
                    if (typeof object[classProperty] == "number") {
                        if (object[classProperty] > validator.max || object[classProperty] < validator.min) {
                            result = false;
                        }
                    }
                    break;
            }
        }
    }
    return result;
}
//# sourceMappingURL=validator-function.js.map