namespace app {
    export abstract class TemplateComponent<T extends HTMLElement, U extends HTMLElement> {
        template: HTMLTemplateElement;
        element: T;
        host: U;
    
        constructor(hostId: string, templateId: string, private insertAtStart: boolean, private elementId?: string,) {
            this.host = <U>document.getElementById(hostId)!;
            this.template = <HTMLTemplateElement>document.getElementById(templateId)!;
            this.element = <T>document.importNode(this.template.content.firstElementChild!, true);
    
            if (elementId) {
                this.element.id = elementId;
            }
    
        }
    
        protected attach() {
    
            this.host.insertAdjacentElement(
                this.insertAtStart ? 'afterbegin' : 'beforeend',
                this.element);
        }
    
        protected abstract configure(): void;
        protected abstract renderItems(): void;
    
    }
}