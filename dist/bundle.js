"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var app;
(function (app) {
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
            this.host.insertAdjacentElement(this.insertAtStart ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    app.TemplateComponent = TemplateComponent;
})(app || (app = {}));
var app;
(function (app) {
    app.validationRegister = {};
    function setRegister(target, key, validator) {
        let existingflags = app.validationRegister[target.constructor.name] ? app.validationRegister[target.constructor.name][key] : null;
        app.validationRegister[target.constructor.name] = Object.assign(Object.assign({}, app.validationRegister[target.constructor.name]), { [key]: existingflags ? [...existingflags, validator] : [validator] });
    }
    app.setRegister = setRegister;
})(app || (app = {}));
var app;
(function (app) {
    function Require(target, key) {
        app.setRegister(target, key, { type: 'required', status: true });
    }
    app.Require = Require;
    function Length(min, max) {
        return function (target, key) {
            app.setRegister(target, key, {
                type: 'length',
                minLength: min || 0,
                maxlength: max || 100
            });
        };
    }
    app.Length = Length;
    function NumRange(min, max) {
        return function (target, key) {
            app.setRegister(target, key, {
                type: 'range',
                min: min || 0,
                max: max || 100
            });
        };
    }
    app.NumRange = NumRange;
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
    app.Bind = Bind;
})(app || (app = {}));
var app;
(function (app) {
    function validate(object) {
        let result = true;
        if (!app.validationRegister[object.constructor.name]) {
            return result;
        }
        for (const classProperty in app.validationRegister[object.constructor.name]) {
            for (const validator of app.validationRegister[object.constructor.name][classProperty]) {
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
    app.validate = validate;
})(app || (app = {}));
var app;
(function (app) {
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
        app.Require
    ], Project.prototype, "title", void 0);
    __decorate([
        app.Require,
        app.Length(3, 100)
    ], Project.prototype, "description", void 0);
    __decorate([
        app.Require,
        app.NumRange(1, 10)
    ], Project.prototype, "people", void 0);
    app.Project = Project;
})(app || (app = {}));
var app;
(function (app) {
    class InputSetup extends app.TemplateComponent {
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
            let obj = new app.Project(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
            if (!app.validate(obj)) {
                alert('invalid values');
            }
            else {
                app.projState.addProject(obj);
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
        app.Bind
    ], InputSetup.prototype, "submitHandler", null);
    app.InputSetup = InputSetup;
})(app || (app = {}));
var app;
(function (app) {
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
    app.projState = ProjectState.getInstance();
})(app || (app = {}));
var app;
(function (app) {
    class ProjectItem extends app.TemplateComponent {
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
        app.Bind
    ], ProjectItem.prototype, "dragStart", null);
    __decorate([
        app.Bind
    ], ProjectItem.prototype, "dragEnd", null);
    app.ProjectItem = ProjectItem;
})(app || (app = {}));
var app;
(function (app) {
    class ListSetup extends app.TemplateComponent {
        constructor(hostId, templateId, insertAtStart, type) {
            super(hostId, templateId, insertAtStart);
            this.type = type;
            this.projectsList = [];
            this.configure();
            this.attach();
        }
        renderItems() {
            let target = document.getElementById(`${this.type}-projects-list`);
            target.innerHTML = "";
            for (const project of this.projectsList) {
                let projCard = new app.ProjectItem(project, `${this.type}-projects-list`);
            }
        }
        configure() {
            this.element.id = `${this.type}-projects`;
            this.element.querySelector('h2').innerText = `${this.type.toUpperCase()} PROJECTS`;
            this.element.querySelector('ul').id = `${this.type}-projects-list`;
            app.projState.addListener((proj) => {
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
            if (event.dataTransfer.types[0] == "text/plain") {
                let id = event.dataTransfer.getData('text/plain');
                app.projState.updateItem(id, this.type);
            }
        }
    }
    __decorate([
        app.Bind
    ], ListSetup.prototype, "dragOver", null);
    __decorate([
        app.Bind
    ], ListSetup.prototype, "dragLeave", null);
    __decorate([
        app.Bind
    ], ListSetup.prototype, "drop", null);
    app.ListSetup = ListSetup;
})(app || (app = {}));
var app;
(function (app) {
    new app.InputSetup('app', 'project-input', true, 'user-input');
    new app.ListSetup('app', 'project-list', false, 'active');
    new app.ListSetup('app', 'project-list', false, 'finished');
})(app || (app = {}));
//# sourceMappingURL=bundle.js.map