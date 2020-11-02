var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { TemplateComponent } from "./base-component.js";
import { Bind } from "../decorators/decorators.js";
import { Project } from "../models/project.js";
import validate from "../validator/validator-function.js";
import projState from "../statemanagement/stateman.js";
export class InputSetup extends TemplateComponent {
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
//# sourceMappingURL=input-form.js.map