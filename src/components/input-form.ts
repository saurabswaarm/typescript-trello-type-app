import { TemplateComponent } from "./base-component.js" ;
import { Bind } from "../decorators/decorators.js";
import { Project } from "../models/project.js";
import validate from "../validator/validator-function.js";
import projState from "../statemanagement/stateman.js";

    export class InputSetup extends TemplateComponent<HTMLFormElement, HTMLDivElement>{

        formTitle: HTMLInputElement;
        formDescription: HTMLInputElement;
        formPeople: HTMLInputElement;
    
        constructor(hostId: string, templateId: string, insertAtStart: boolean, elementId?: string) {
            super(hostId, templateId, insertAtStart, elementId)
    
            this.formTitle = <HTMLInputElement>this.element.querySelector('#title');
            this.formDescription = <HTMLInputElement>this.element.querySelector('#description');
            this.formPeople = <HTMLInputElement>this.element.querySelector('#people')
    
            this.configure();
            this.attach();
        }
    
        protected configure() {
            this.element.addEventListener('submit', this.submitHandler)
        }
    
        @Bind
        private submitHandler(e: Event) {
            e.preventDefault();
            let obj: Project = new Project(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
    
            if (!validate(obj)) {
                alert('invalid values')
            } else {
                projState.addProject(obj);
                this.clearFields();
            }
        }
    
        private clearFields() {
            this.formTitle.value = '';
            this.formDescription.value = '';
            this.formPeople.value = '';
        }
    
        protected renderItems() { };
    }