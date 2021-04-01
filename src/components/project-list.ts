import { TemplateComponent } from "./base-component";
import { ProjectItem } from "./project-item";
import { Bind } from "../decorators/decorators";
import { Project } from "../models/project";
import {Dragarea} from "../models/drag-models";
import projState from "../statemanagement/stateman";


export class ListSetup extends TemplateComponent<HTMLElement, HTMLDivElement> implements Dragarea {

    projectsList: Project[] = [];

    constructor(hostId: string, templateId: string, insertAtStart: boolean, public type: 'active' | 'finished') {
        super(hostId, templateId, insertAtStart);

        this.configure();
        this.attach();
    }

    // NOTE:: renderItems is called only through the listener this class sets up on the project state
    // That is when a new element is added or updated.
    //
    protected renderItems() {

        //This wipes the slate clean to prepare for a new render.
        let target = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        target.innerHTML = "";

        for (const project of this.projectsList) {
            let projCard = new ProjectItem(project, `${this.type}-projects-list`)
        }
    }

    protected configure() {
        this.element.id = `${this.type}-projects`;
        this.element.querySelector('h2')!.innerText = `${this.type.toUpperCase()} PROJECTS`;
        this.element.querySelector('ul')!.id = `${this.type}-projects-list`

        projState.addListener((proj: Project[]) => {
            this.projectsList = proj.filter((project) => {
                return project.status == this.type;
            })
            this.renderItems();
        })

        //drag
        this.element.addEventListener('dragover', this.dragOver);
        this.element.addEventListener('dragleave', this.dragLeave);
        this.element.addEventListener('drop', this.drop);
    }

    @Bind
    dragOver(event: DragEvent) {
        event.preventDefault();
        this.element.querySelector('ul')!.classList.add('droppable');

    }

    @Bind
    dragLeave(event: DragEvent) {
        this.element.querySelector('ul')!.classList.remove('droppable');
    }

    @Bind
    drop(event: DragEvent) {
        this.element.querySelector('ul')!.classList.remove('droppable');

        if (event.dataTransfer!.types[0] == "text/plain") {
            let id = event.dataTransfer!.getData('text/plain');
            projState.updateItem(id, this.type);
        }

    }

}