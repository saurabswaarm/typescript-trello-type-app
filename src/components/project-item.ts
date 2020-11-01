/// <reference path="./base-component.ts" />
/// <reference path="../decorators/decorators.ts" />
/// <reference path="../models/drag-models.ts" />

namespace app {
    export class ProjectItem extends TemplateComponent<HTMLLIElement, HTMLUListElement> implements Draggable {

        //How does this work?
        //
        //For each ProjectItem the host is the containing UL and Template is supplied from the index.html
        //Once we build it and configure it we run attach that appends the ProjectItem to the host.
    
    
        constructor(private project: Project, hostId: string) {
            super(hostId, 'single-project', false, project.id)
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
    
            //drag
            this.element.addEventListener('dragstart', this.dragStart);
            this.element.addEventListener('dragend', this.dragEnd);
        }
    
        renderItems() { }
    
        @Bind
        dragStart(event: DragEvent) {
            event.dataTransfer!.setData('text/plain', this.project.id)
            event.dataTransfer!.effectAllowed = "move";
    
            setTimeout(()=>{
                this.element.style.opacity = "0.1";
            }, 50)
        }
    
        @Bind
        dragEnd(event:DragEvent){
            this.element.style.opacity = "1.0";
        }
    }
}