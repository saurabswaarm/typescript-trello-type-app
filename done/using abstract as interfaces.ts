abstract class Person {
    protected abstract name: string;
    abstract age: number;

    details(): string {
        return `${this.name} is ${this.age} old`;
    }
}

abstract class Employed extends Person{
    abstract company: string;
    abstract salary: string

    abstract fire(reason:string):string
}

abstract class Unemployed extends Person{
    abstract skills: string;

    abstract hire(company: string): string;
}



class EmployedPerson extends Employed {
    constructor(protected name: string, public age: number, public company: string, public salary: string) {
        super();
    }

    fire(reason: string): string {
        return `Fired from ${this.company} for ${reason}`;
    }
}

class UnemployedPerson extends Person {
    constructor(public name:string, public age:number, public skills:string){
        super();
    }

    hire(company:string){
        return `${this.name} was hired by ${company}`;
    }
}

let saurab:Person & Unemployed = new UnemployedPerson('Saurab', 30, 'poop Development');
let con = saurab.details();
console.log(saurab);