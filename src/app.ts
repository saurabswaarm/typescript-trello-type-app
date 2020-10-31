//TODO: Create validate Function
//TODO: Create validator registry
//TODO create validator decorators

interface Validator {
    type: string;
    status?: boolean;
    minLength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

interface ValidationRegister {
    [classInQuestion: string]: {
        [propertyInQuestion: string]: Validator[];
    }
}

let validationRegister: ValidationRegister = {}

function validate(object: any): boolean {
    //lookup the class in the validation register
    //find all validations that need to be comitted
    //check all those validation
    //if pass return true else false

    let result: boolean = true;

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
                        if (object[classProperty].length > validator.maxlength! || object[classProperty].length < validator.minLength!) {
                            result = false;
                        }
                    }
                    break;

                case 'range':
                    if (typeof object[classProperty] == "number") {
                        if (object[classProperty] > validator.max! || object[classProperty] < validator.min!) {
                            result = false;
                        }
                    }
                    break;
            }
        }
    }

    return result;
}

function setRegister(target: any, key: string, validator: Validator) {

    let existingflags = validationRegister[target.constructor.name] ? validationRegister[target.constructor.name][key] : null;

    validationRegister[target.constructor.name] = {
        ...validationRegister[target.constructor.name],
        [key]: existingflags ? [...existingflags, validator] : [validator]
    }
}



function Require(target: any, key: string) {
    setRegister(target, key, { type: 'required', status: true });
}

function Length(min: number, max: number) {
    return function (target: any, key: string) {
        setRegister(target, key, {
            type: 'length',
            minLength: min || 0,
            maxlength: max || 100
        })
    }
}

function NumRange(min: number, max: number) {
    return function (target: any, key: string) {
        setRegister(target, key, {
            type: 'range',
            min: min || 0,
            max: max || 100
        })
    }
}

function Bind(target: any, key: string, propertyDescriptor: PropertyDescriptor) {
    let originalFunction = propertyDescriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            return originalFunction.bind(this);
        }
    }
}








class Project {
    @Require
    title: string;

    @Require
    @Length(0, 100)
    description: string;

    @Require
    @NumRange(1, 10)
    people: number;

    status: 'active' | 'finished';
    id: string;

    constructor(title: string, description: string, people: number) {
        this.title = title;
        this.description = description;
        this.people = people;

        this.status = 'active';
        this.id = 'id' + Math.trunc(Math.random() * 10000).toString();
    }

}






/* ///////////////////
*
* State Management
*
*/ ///////////////////

type Listener<T> = (proj: T[]) => void; //declaring type for our listener function, with type arguments for what the listener functions process

abstract class State<T>{
    protected listeners: Listener<T>[] = [];

    addListener(func: Listener<T>) {
        this.listeners.push(func);
    }

}

class ProjectState extends State<Project> {
    private static instance: ProjectState;

    private projects: Project[] = [];


    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }

    public addProject(project: Project) {
        this.projects.push(project);
        this.fireListeners();
    }

    public updateItem(itemId:string, status:"active" | "finished"){
       let project = this.projects.find((proj)=>proj.id == itemId);
       if(project && project.status !== status){
           project.status = status;
           this.fireListeners();
       }
    }

    private fireListeners() {
        for (const listener of this.listeners) {
            listener(this.projects);
        }
    }


}







/* ///////////////////
*
* Template Components
*
*/ ///////////////////

abstract class TemplateComponent<T extends HTMLElement, U extends HTMLElement> {
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

        //Check if element with the same Id exists on the parent.
        //
        if (this.elementId && this.host.querySelector('#' + this.elementId)) {
            return;
        }
        this.host.insertAdjacentElement(
            this.insertAtStart ? 'afterbegin' : 'beforeend',
            this.element);
    }

    protected abstract configure(): void;
    protected abstract renderItems(): void;

}





class InputSetup extends TemplateComponent<HTMLFormElement, HTMLDivElement>{

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











class ProjectItem extends TemplateComponent<HTMLLIElement, HTMLUListElement> implements Draggable {

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


class ListSetup extends TemplateComponent<HTMLElement, HTMLDivElement> implements Dragarea {

    projectsList: Project[] = [];

    constructor(hostId: string, templateId: string, insertAtStart: boolean, public type: 'active' | 'finished') {
        super(hostId, templateId, insertAtStart);

        this.configure();
        this.attach();
    }

    protected renderItems() {
        console.log('render fired from'+ this.type);
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
    dragOver(event:DragEvent){
        event.preventDefault();
        this.element.querySelector('ul')!.classList.add('droppable');

    }

    @Bind
    dragLeave(event:DragEvent){
        this.element.querySelector('ul')!.classList.remove('droppable');
    }

    @Bind
    drop(event:DragEvent){
        this.element.querySelector('ul')!.classList.remove('droppable');

        if(event.dataTransfer!.items[0]){
            let id= event.dataTransfer!.getData('text/plain');
            projState.updateItem(id,this.type);
        }
        
    }

}









let projState = ProjectState.getInstance();
let inp = new InputSetup('app', 'project-input', true, 'user-input');
let activeList = new ListSetup('app', 'project-list', false, 'active');
let finList = new ListSetup('app', 'project-list', false, 'finished');




//Drag and drop

//The card class should have two methods DragStart and Drag end, implemented by the draggable interface.
//The list needs to have three methods, DragOver, DragLeave, Drop implemented by the dragarea interface.

//As the card is dragged we attach the ID of the project via set data to the drag event.
//When the card is dropped, we see where the card was dropped and then accordingly ask the state manager to update the project
//This fires the listeners again and we get a re-render of the UI

interface Draggable {
    dragStart(event: Event): void;
    dragEnd(event: Event): void;
}

interface Dragarea {
    dragOver(event: Event): void;
    dragLeave(event: Event): void;
    drop(event: Event): void;
}