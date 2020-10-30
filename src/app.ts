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

class Project {
    @Require
    title: string;

    @Require
    @Length(2, 5)
    description: string;

    @Require
    @NumRange(5, 10)
    people: number;

    constructor(title: string, description: string, people: number) {
        this.title = title;
        this.description = description;
        this.people = people;
    }

}









class InputSetup {
    formTemplate: HTMLTemplateElement;
    formElement: HTMLFormElement;
    divElement: HTMLDivElement;
    formTitle: HTMLInputElement;
    formDescription: HTMLInputElement;
    formPeople: HTMLInputElement;

    constructor() {
        this.divElement = <HTMLDivElement>document.getElementById('app');
        this.formTemplate = document.getElementById('project-input')! as HTMLTemplateElement;
        this.formElement = <HTMLFormElement>document.importNode(this.formTemplate.content.firstElementChild!, true);

        //form inputs
        this.formTitle = <HTMLInputElement>this.formElement.querySelector('#title');
        this.formDescription = <HTMLInputElement>this.formElement.querySelector('#description');
        this.formPeople = <HTMLInputElement>this.formElement.querySelector('#people')

        this.prepForm();
        this.injectForm();
    }

    private prepForm() {
        this.formElement.id = "user-input";

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let obj: Project = new Project(this.formTitle.value, this.formDescription.value, +this.formPeople.value);

            if (!validate(obj)) {
                alert('invalid values')
            } else {
                console.log(obj);
                this.clearFields();
            }
        })
    }

    private clearFields() {
        this.formTitle.value = '';
        this.formDescription.value = '';
        this.formPeople.value = '';
    }

    private injectForm() {
        this.divElement.append(this.formElement);
    }
}

class ListSetup {

    listTemplate: HTMLTemplateElement;
    listElement: HTMLElement;
    divElement: HTMLDivElement;

    constructor(public type: 'active' | 'finished') {
        this.divElement = <HTMLDivElement>document.getElementById('app');
        this.listTemplate = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.listElement = <HTMLElement>document.importNode(this.listTemplate.content.firstElementChild!, true);
        this.configure();
        this.attacht();
    
    }

    private configure(){
        this.listElement.id = `${this.type}-projects`;
        this.listElement.querySelector('h2')!.innerText = `${this.type.toUpperCase()} PROJECTS`;
        this.listElement.querySelector('ul')!.id = `${this.type}-projects-list`
    }

    private attacht(){
        this.divElement.insertAdjacentElement('beforeend', this.listElement);
    }
}

let inp = new InputSetup();
let activeList = new ListSetup('active');
let finList = new ListSetup('finished');

