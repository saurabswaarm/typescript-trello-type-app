interface Person {
    readonly name: string;
    age: number;

    details(): string;
}

interface Employed extends Person{
    company: string;
    salary: string

    fire(reason:string):string
}

interface Unemployed extends Person{
    skills: string;

    hire(company: string): string;
}



class EmployedPerson implements Employed {
    
    constructor(public name: string, public age: number, public company: string, public salary: string) {

    }

    fire(reason: string): string {
        return `Fired from ${this.company} for ${reason}`;
    }

    details(): string {
        return `${this.name} is ${this.age} old`;
    }

}

class UnemployedPerson implements Unemployed {
    constructor(public name:string, public age:number, public skills:string){

    }

    details(): string {
        return `${this.name} is ${this.age} old`;
    }

    hire(company:string){
        return `${this.name} was hired by ${company}`;
    }
}

let saurab:Person & Unemployed = new UnemployedPerson('Saurab', 30, 'Software Development');
let con = saurab.details();
console.log(saurab);


// type Additive = (num1:number, num2:number)=>string ;

interface Additive { // use interface as a funciton type
    (a: number, b: number): string;
}


let add: Additive;

add = function(num1, num2){
    return (num1 + num2).toString();
}