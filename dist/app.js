"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let validatorObject = {};
function flagInjector(className, propertyName, flag) {
    let existingFlags;
    if (validatorObject[className]) {
        existingFlags = validatorObject[className][propertyName];
    }
    validatorObject[className] = Object.assign(Object.assign({}, validatorObject[className]), { [propertyName]: existingFlags ? [...existingFlags, flag] : [flag] });
}
function Require(target, propertyName) {
    flagInjector(target.constructor.name, propertyName, 'Require');
}
function Positive(target, propertyName) {
    flagInjector(target.constructor.name, propertyName, 'Positive');
}
function MinLength(minlength) {
    return function (target, propertyName) {
        flagInjector(target.constructor.name, propertyName, { minLength: minlength.toString() });
    };
}
function Validate(obj) {
    console.log(validatorObject);
    let className = obj.constructor.name;
    if (!validatorObject[className]) {
        console.log('No validation requested on this class');
        return true;
    }
    let defaultReturn = true;
    for (let objectProp in validatorObject[className]) {
        for (let validatorType of validatorObject[className][objectProp]) {
            switch (validatorType) {
                case 'Require':
                    defaultReturn = defaultReturn && !!(obj[objectProp].trim());
                    break;
                case 'Positive':
                    defaultReturn = defaultReturn && (obj[objectProp] > 0);
                    break;
            }
            if (validatorType.hasOwnProperty('minLength')) {
                defaultReturn = defaultReturn && (obj[objectProp].length > 3);
            }
        }
    }
    return defaultReturn;
}
class Course {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
}
__decorate([
    Require,
    MinLength(5)
], Course.prototype, "title", void 0);
__decorate([
    Positive
], Course.prototype, "price", void 0);
let cSubBut = document.querySelector('#subbutt');
let cTitleEle = document.querySelector('#coursename');
let cPriceEle = document.querySelector('#price');
cSubBut.addEventListener('click', (event) => {
    event.preventDefault();
    let courseTitle = cTitleEle.value;
    let coursePrice = +cPriceEle.value;
    let courseObject = new Course(courseTitle, coursePrice);
    if (!Validate(courseObject)) {
        alert('Invalid Inputs');
    }
    else {
        console.log(courseObject);
    }
});
//# sourceMappingURL=app.js.map