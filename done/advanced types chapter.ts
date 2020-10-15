type Admin = {
    name: string;
    priveleges: string[];
}

type Employee = {
    name: string;
    joinDate?: Date;
}


// interface ElevatedEmployee extends Admin, Employee {}

type ElevatedEmployee = Admin & Employee; // This is an intersection type which enforces both user specified types.

let rameshElevated:ElevatedEmployee = {
    name:'Ramesh',
    priveleges:['server','software'],
    joinDate: new Date()
}

type UnknownEmployee = Admin | Employee // This is a Union Type;

let printDetails= function(a:UnknownEmployee){

    console.log(a.name); // This works with no issues.
    // console.log(a.priveleges); //This will not work as it cannot determine if it has the property 'priveleges'

    if('priveleges' in a){
        console.log(a.priveleges); //Now that we have checked the existence of the property this is guaranteed to work
    }
}



type Combinable = string | number;
type NumBool = number | boolean ;

type NewType = Combinable & NumBool;    // This will result in NewType always being a number as the intersection of the two types is a number.


function ourCalc(a:number, b:number):number; //overloads allow us to be more specefic about our return types under varying circumstances.
function ourCalc(a:string, b:string):string; //overloads are important as this helps us process the returned values without TS-erros
function ourCalc(a:string, b:number):string;
function ourCalc(a:number, b:string):string;

function ourCalc(a:Combinable, b:Combinable){    
    if(typeof a  === 'string' || typeof b === 'string'){ // This is called a typeguard
        return a.toString() + b.toString();
    } 
    return a+b;
}

let ourCalcResult = ourCalc('23',45); //without overloads it would not be possible to use say toSting(), as TS won't detect it as a string type but instead as a Combinable type.

class Car {
    drive(){
        console.log('driving');
    }
}

class Truck {
    drive(){
        console.log('driving');
    }

    loadCargo(){
        console.log('loading Cargo')
    }
}

type Vehicle = Car | Truck;

let loader = function(a:Vehicle){
    if(a instanceof Truck){ // instance of checks if an object is the instance of a particular Class at runtime, hence this code is safe.
        a.loadCargo();
    }
}



interface Bird {
    type:'bird',
    flightSpeed: number;
}

interface Horse {
    type:'horse',
    runningSpeed: number;
}

type Animal = Bird | Horse;


const printSpeed = function(a: Animal){
    let speed;
    switch(a.type){ // This way of using switch case statements is called a 'discriminated union'.
        case 'bird': // This gives us autocomplete prompts.
            speed = a.flightSpeed;
        break;
        case 'horse':
            speed = a.runningSpeed;
        break;
    }
    console.log('The speed is ' + speed);
}



// let xx = 23;
// let yy = xx;
// let zz = <number>yy;
// zz = <string>yy // this will not work as typescript already knows for sure the type.

//Type casting only works when there is some ambiguity about the type of the incoming value eg HTMLElement


interface ErrorBag {
    [props:string]:string;
}

let loginEror: ErrorBag = {
    username: 'invalid usename',
    password: 'minimum 10 charachters'
}


const fetchUserData = {
    id: 'u1',
    name: 'Max',
    job: { title: 'CEO', description: 'My Own Company' }
}

console.log(fetchUserData?.job?.title); // this is same as (fetchUserData && fetchUserData.job && fetchUserData.job.title)

let value;

let box = value || 'Default';  // here if value = '' , Default will be assigned as empty string is treated as falsy
box = value ?? 'Default'; // this will only assign 'Default' if value is null or undefined, but will pass emptystring '' through.