import { setRegister } from "../validator/validation-register.js";
export function Require(target, key) {
    setRegister(target, key, { type: 'required', status: true });
}
export function Length(min, max) {
    return function (target, key) {
        setRegister(target, key, {
            type: 'length',
            minLength: min || 0,
            maxlength: max || 100
        });
    };
}
export function NumRange(min, max) {
    return function (target, key) {
        setRegister(target, key, {
            type: 'range',
            min: min || 0,
            max: max || 100
        });
    };
}
export function Bind(target, key, propertyDescriptor) {
    let originalFunction = propertyDescriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            return originalFunction.bind(this);
        }
    };
}
//# sourceMappingURL=decorators.js.map