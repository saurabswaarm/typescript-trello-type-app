export class TemplateComponent {
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
//# sourceMappingURL=base-component.js.map