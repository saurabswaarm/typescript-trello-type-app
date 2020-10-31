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
function Bind(target, key, propertyDescriptor) {
    let originalFunction = propertyDescriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            return originalFunction.bind(this);
        }
    };
}
class Project {
    constructor(title, description, people) {
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = 'active';
        this.id = 'id' + Math.trunc(Math.random() * 10000).toString();
    }
}
__decorate([
    Require
], Project.prototype, "title", void 0);
__decorate([
    Require,
    Length(0, 100)
], Project.prototype, "description", void 0);
__decorate([
    Require,
    NumRange(1, 10)
], Project.prototype, "people", void 0);
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(func) {
        this.listeners.push(func);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addProject(project) {
        this.projects.push(project);
        this.fireListeners();
    }
    updateItem(itemId, status) {
        let project = this.projects.find((proj) => proj.id == itemId);
        if (project && project.status !== status) {
            project.status = status;
            this.fireListeners();
        }
    }
    fireListeners() {
        for (const listener of this.listeners) {
            listener(this.projects);
        }
    }
}
class TemplateComponent {
    constructor(hostId, templateId, insertAtStart, elementId) {
        this.insertAtStart = insertAtStart;
        this.elementId = elementId;
        this.host = document.getElementById(hostId);
        this.template = document.getElementById(templateId);
        this.element = document.importNode(this.template.content.firstElementChild, true);
        if (elementId) {
            this.element.id = elementId;
        }
    }
    attach() {
        if (this.elementId && this.host.querySelector('#' + this.elementId)) {
            return;
        }
        this.host.insertAdjacentElement(this.insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    }
}
class InputSetup extends TemplateComponent {
    constructor(hostId, templateId, insertAtStart, elementId) {
        super(hostId, templateId, insertAtStart, elementId);
        this.formTitle = this.element.querySelector('#title');
        this.formDescription = this.element.querySelector('#description');
        this.formPeople = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    submitHandler(e) {
        e.preventDefault();
        let obj = new Project(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
        if (!validate(obj)) {
            alert('invalid values');
        }
        else {
            projState.addProject(obj);
            this.clearFields();
        }
    }
    clearFields() {
        this.formTitle.value = '';
        this.formDescription.value = '';
        this.formPeople.value = '';
    }
    renderItems() { }
    ;
}
__decorate([
    Bind
], InputSetup.prototype, "submitHandler", null);
class ProjectItem extends TemplateComponent {
    constructor(project, hostId) {
        super(hostId, 'single-project', false, project.id);
        this.project = project;
        this.configure();
        this.attach();
    }
    configure() {
        let title = document.createElement('h2');
        title.innerText = this.project.title;
        let description = document.createElement('p');
        description.innerText = this.project.description;
        let people = document.createElement('p');
        people.innerText = this.project.people.toString();
        this.element.append(title, description, people);
        this.element.addEventListener('dragstart', this.dragStart);
        this.element.addEventListener('dragend', this.dragEnd);
    }
    renderItems() { }
    dragStart(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            this.element.style.opacity = "0.1";
        }, 50);
    }
    dragEnd(event) {
        this.element.style.opacity = "1.0";
    }
}
__decorate([
    Bind
], ProjectItem.prototype, "dragStart", null);
__decorate([
    Bind
], ProjectItem.prototype, "dragEnd", null);
class ListSetup extends TemplateComponent {
    constructor(hostId, templateId, insertAtStart, type) {
        super(hostId, templateId, insertAtStart);
        this.type = type;
        this.projectsList = [];
        this.configure();
        this.attach();
    }
    renderItems() {
        console.log('render fired from' + this.type);
        let target = document.getElementById(`${this.type}-projects-list`);
        target.innerHTML = "";
        for (const project of this.projectsList) {
            let projCard = new ProjectItem(project, `${this.type}-projects-list`);
        }
    }
    configure() {
        this.element.id = `${this.type}-projects`;
        this.element.querySelector('h2').innerText = `${this.type.toUpperCase()} PROJECTS`;
        this.element.querySelector('ul').id = `${this.type}-projects-list`;
        projState.addListener((proj) => {
            this.projectsList = proj.filter((project) => {
                return project.status == this.type;
            });
            this.renderItems();
        });
        this.element.addEventListener('dragover', this.dragOver);
        this.element.addEventListener('dragleave', this.dragLeave);
        this.element.addEventListener('drop', this.drop);
    }
    dragOver(event) {
        event.preventDefault();
        this.element.querySelector('ul').classList.add('droppable');
    }
    dragLeave(event) {
        this.element.querySelector('ul').classList.remove('droppable');
    }
    drop(event) {
        this.element.querySelector('ul').classList.remove('droppable');
        if (event.dataTransfer.items[0]) {
            let id = event.dataTransfer.getData('text/plain');
            projState.updateItem(id, this.type);
        }
    }
}
__decorate([
    Bind
], ListSetup.prototype, "dragOver", null);
__decorate([
    Bind
], ListSetup.prototype, "dragLeave", null);
__decorate([
    Bind
], ListSetup.prototype, "drop", null);
let projState = ProjectState.getInstance();
let inp = new InputSetup('app', 'project-input', true, 'user-input');
let activeList = new ListSetup('app', 'project-list', false, 'active');
let finList = new ListSetup('app', 'project-list', false, 'finished');
//# sourceMappingURL=app.js.map