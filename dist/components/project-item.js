var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { TemplateComponent } from "./base-component.js";
import { Bind } from "../decorators/decorators.js";
export class ProjectItem extends TemplateComponent {
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
//# sourceMappingURL=project-item.js.map