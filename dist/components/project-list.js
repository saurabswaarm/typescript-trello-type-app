var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { TemplateComponent } from "./base-component.js";
import { ProjectItem } from "./project-item.js";
import { Bind } from "../decorators/decorators.js";
import projState from "../statemanagement/stateman.js";
export class ListSetup extends TemplateComponent {
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
        if (event.dataTransfer.types[0] == "text/plain") {
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
//# sourceMappingURL=project-list.js.map