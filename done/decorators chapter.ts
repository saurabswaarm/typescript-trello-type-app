
//Basic demo of decorators and order of execution of decorators.

// function Prep(template:string, hookid:string){
//     console.log('prep ran')
//     return function(constructor: any){
//         let p = (new constructor()).name;
//         let el = document.getElementById(hookid)!;
//         el.innerHTML = `<h1>${template} ${p}</h1>`
//         console.log('Prep return func ran');
//     }
// } 

// function Log(){
//     console.log('Log ran');
//     return function(__:Function){
//         console.log('Log return func ran');
//     }
// }

// @Log()
// @Prep('My name is','app')
// class SomeClass {
//     name:string = "sunny";

//     constructor(){
//         console.log('Constructor running')
//     }
// }

// let sc = new SomeClass();



// Property, Method, Accessor and Parameter Decorators //

// function Log(target:any, propertyName:string){
//     console.log(target);
//     console.log(propertyName);
// }

// function Log2(target:any, propertyName:string, what:PropertyDescriptor){ //this also will work for methods
//     console.log(target);
//     console.log(propertyName);
//     console.log(what);
// }

// function Log3(target:any, propertyName:string, position:number){
//     console.log('parameter decorator')
//     console.log(target);
//     console.log(propertyName);
//     console.log(position);
// }

// class Product {

//     @Log
//     public title:string;
//     private currency:string = "Rs";
//     private _price:number;

//     constructor(t:string,p:number){
//         this.title = t;
//         this._price = p;
//     }

//     @Log2
//     set price(p:number){
//         if(p>0){
//             this._price = p;
//         }
//     }

//     @Log2
//     getPriceAfterTax(@Log3 t:number){
//         let val =  this._price + ((t/100) * this._price);
//         console.log(`${val} ${this.currency}`)
//     }

// }

// Building a decorator that replaces a class with an improved one with new metadata

// function ReplaceClass(template:string, hookid:string){
//     console.log('Replaceclass decorator ran');
//     return function<T extends {new(...args:any[]):{[props:string]:any}}>(originalConstructor:T){
//         return class extends originalConstructor {
//             constructor(..._:any[]){
//                 super(..._);
//                 this.modString = template;
//                 let el = document.getElementById(hookid)!;
//                 let someName = this.name;
//                 el.innerHTML = `<h1> ${template} + ${someName} </h1>`
//             }
//         }
//     }
// }

// @ReplaceClass('My poopie is', 'app')
// class SomeX{
//     name:string = 'max';
//     modString:string = '';

//     constructor(n:string){
//         console.log('SomeX initializer ran');
//         this.name = n;
//     }

//     printName(){
//         console.log(this.modString+' '+this.name);
//     }
// }

// let obj = new SomeX('Sunny');
// obj.printName();




//Building an AutoBinder

// function AutoBind(target:any, propertyName:any, propertyDescriptor:PropertyDescriptor){
//     let originalFunction = propertyDescriptor.value;
//     let modfunction:PropertyDescriptor = {
//         configurable:true,
//         enumerable:false,
//         // writable:false,
//         get(){
//             console.log('Autobind get ran')
//             return originalFunction.bind(this);
//         }
//     }
//     return modfunction;
// }

// class Printer {
//     message = 'This works';

//     @AutoBind
//     showMessage(){
//         console.log(this.message);
//     }
// }

// const p = new Printer();

// let button = document.querySelector("#butt")! as HTMLElement;
// button.addEventListener('click', p.showMessage);




// Validation with Decorators



// library' space starts

//create a validator object that holds all validations to be executed, this is what the validate function will use.

//require validator -- basically pushes a flag onto validator object
//positive validator -- basically pushes another flag onto the validator object.

// validate function that will take in the target object, check if there are any validation requests, execute them and then return a truthy or falsey value.

// library's space ends


type MinLengthX = {
    minLength: number;
}

interface ValidatorObject {
    [relevantClass: string]: {
        [propertyName: string]: (string | Partial<MinLengthX>)[]
    }
}

let validatorObject: ValidatorObject = {};

function flagInjector(className: string, propertyName: string, flag: string | object) {

    let existingFlags;
    if (validatorObject[className]) {
        existingFlags = validatorObject[className][propertyName]
    }

    validatorObject[className] = {
        ...validatorObject[className],
        [propertyName]: existingFlags ? [...existingFlags, flag] : [flag]
    };
}

function Require(target: any, propertyName: string) {
    flagInjector(target.constructor.name, propertyName, 'Require');

}

function Positive(target: any, propertyName: string) {
    flagInjector(target.constructor.name, propertyName, 'Positive');

}

function MinLength(minlength: number) {
    return function (target: any, propertyName: string) {
        flagInjector(target.constructor.name, propertyName, { minLength: minlength.toString() })
    }
}


function Validate(obj: any) {
    console.log(validatorObject);

    let className = obj.constructor.name;

    if (!validatorObject[className]) {
        console.log('No validation requested on this class')
        return true;
    }

    let defaultReturn = true;

    for (let objectProp in validatorObject[className]) {
        for (let validatorType of validatorObject[className][objectProp]) {



            switch (validatorType) {
                case 'Require':
                    defaultReturn = defaultReturn && !!(obj[objectProp].trim()); // !! converts a value into boolean basically a double negation
                    break;
                case 'Positive':
                    defaultReturn = defaultReturn && (obj[objectProp] > 0);
                    break;
            }
            if (validatorType.hasOwnProperty('minLength')) {
                defaultReturn = defaultReturn && (obj[objectProp].length > 3)
            }
        }

    }

    return defaultReturn;
}

class Course {
    @Require
    @MinLength(5)
    title: string;

    @Positive
    price: number;

    constructor(title: string, price: number) {
        this.title = title;
        this.price = price;
    }
}



let cSubBut = document.querySelector('#subbutt') as HTMLElement;
let cTitleEle = document.querySelector('#coursename')! as HTMLInputElement;
let cPriceEle = document.querySelector('#price')! as HTMLInputElement;

cSubBut.addEventListener('click', (event) => {
    event.preventDefault();

    let courseTitle = cTitleEle.value;
    let coursePrice = +cPriceEle.value;

    let courseObject = new Course(courseTitle, coursePrice);

    if (!Validate(courseObject)) {
        alert('Invalid Inputs');
    } else {
        console.log(courseObject);
    }
})