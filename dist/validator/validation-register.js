export let validationRegister = {};
export function setRegister(target, key, validator) {
    let existingflags = validationRegister[target.constructor.name] ? validationRegister[target.constructor.name][key] : null;
    validationRegister[target.constructor.name] = Object.assign(Object.assign({}, validationRegister[target.constructor.name]), { [key]: existingflags ? [...existingflags, validator] : [validator] });
}
//# sourceMappingURL=validation-register.js.map