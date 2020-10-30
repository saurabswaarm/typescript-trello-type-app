"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let validationRegister = {};
function validate(object) {
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
function setRegister(target, key, validator) {
    let existingflags = validationRegister[target.constructor.name] ? validationRegister[target.constructor.name][key] : null;
    validationRegister[target.constructor.name] = Object.assign(Object.assign({}, validationRegister[target.constructor.name]), { [key]: existingflags ? [...existingflags, validator] : [validator] });
}
function Require(target, key) {
    setRegister(target, key, { type: 'required', status: true });
}
function Length(min, max) {
    return function (target, key) {
        setRegister(target, key, {
            type: 'length',
            minLength: min || 0,
            maxlength: max || 100
        });
    };
}
function NumRange(min, max) {
    return function (target, key) {
        setRegister(target, key, {
            type: 'range',
            min: min || 0,
            max: max || 100
        });
    };
}
class Project {
    constructor(title, description, people) {
        this.title = title;
        this.description = description;
        this.people = people;
    }
}
__decorate([
    Require
], Project.prototype, "title", void 0);
__decorate([
    Require,
    Length(2, 5)
], Project.prototype, "description", void 0);
__decorate([
    Require,
    NumRange(5, 10)
], Project.prototype, "people", void 0);
class InputSetup {
    constructor() {
        this.divElement = document.getElementById('app');
        this.formTemplate = document.getElementById('project-input');
        this.formElement = document.importNode(this.formTemplate.content.firstElementChild, true);
        this.formTitle = this.formElement.querySelector('#title');
        this.formDescription = this.formElement.querySelector('#description');
        this.formPeople = this.formElement.querySelector('#people');
        this.prepForm();
        this.injectForm();
    }
    prepForm() {
        this.formElement.id = "user-input";
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let obj = new Project(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
            if (!validate(obj)) {
                alert('invalid values');
            }
            else {
                console.log(obj);
                this.clearFields();
            }
        });
    }
    clearFields() {
        this.formTitle.value = '';
        this.formDescription.value = '';
        this.formPeople.value = '';
    }
    injectForm() {
        this.divElement.append(this.formElement);
    }
}
class ListSetup {
    constructor(type) {
        this.type = type;
        this.divElement = document.getElementById('app');
        this.listTemplate = document.getElementById('project-list');
        this.listElement = document.importNode(this.listTemplate.content.firstElementChild, true);
        this.configure();
        this.attacht();
    }
    configure() {
        this.listElement.id = `${this.type}-projects`;
        this.listElement.querySelector('h2').innerText = `${this.type.toUpperCase()} PROJECTS`;
        this.listElement.querySelector('ul').id = `${this.type}-projects-list`;
    }
    attacht() {
        this.divElement.insertAdjacentElement('beforeend', this.listElement);
    }
}
let inp = new InputSetup();
let activeList = new ListSetup('active');
let finList = new ListSetup('finished');
//# sourceMappingURL=app.js.map