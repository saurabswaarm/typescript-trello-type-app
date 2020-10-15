// class Department {
//     // private readonly id: string; //use the readonly to set readonly
//     // public name: string = 'poop'; // this is a field, you can assign values here if you wish aka public class fields
    
//     constructor(public readonly name:string = 'poop'){ //you can also directly initialize everything in the constructors arguments. weird but yeah
        
//     }
    
//     talk(this:Department):void {
//         console.log(this.name);
//     }
// }

// const accounting: Department = new Department();
// accounting.talk();

// const accountingCopy = {talk:accounting.talk, name:'Math'};
// accountingCopy.talk();

import 'lodash';

type Employee = {name:string, age:number, joining: number};

abstract class Department {
    protected employees:Employee[] = []; // inherited classes cannot modify private fields
    protected salariedEmployees:string[] = []; // inherited classees can modify this, but they still can't be modified fron outside
    constructor(protected name:string, protected id:string){

    }

    private static fiscalYear:number = 2020;

    static createEmployee(name:string, age:number):Employee {
        return {name:name, age:age , joining:Department.fiscalYear};
    }

    abstract printStatus():void;

    addEmployee(a:Employee):void {
        this.employees.push(a);
    }

    printEmployees(index?:number){
        if(index){
            console.log(this.employees[index])
        } else {
            console.log(this.employees);
        }
    }
}

class ITDepartment extends Department {
    private static instance:ITDepartment; //the instance that the singleton creates is always stored here

    private constructor(id:string, private admins:string[]){ // putting private here turns this into a singleton
        super('IT', id,)
    }

    static create(id:string, admins:string[]): ITDepartment{ //this basically returns the same instance for you from the instance variable
        if(this.instance){
            return ITDepartment.instance;
        }
        this.instance = new ITDepartment(id, admins);
        return this.instance;
    }

    printStatus():void {
        console.log(this.name, this.id, this.admins, this.employees);
    }

    addAdministrator(a:string):void{
        this.admins.push(a);
    }
}


class Accounting extends Department {
    private latestReport:string | undefined;

    constructor(id:string, public reports:string[] = []){
        super('Accounting', id);
        this.latestReport = _.last(reports);
    }

    get getLatestReport():string {
        if(this.latestReport === undefined){
            throw new Error('No reports in existence');
        } else {
            return this.latestReport;
        }
    }

    set setLatestReport(a:string){
        if(!a){
            throw new Error('oops');
        } else {
            this.latestReport = a;
        }
    }

    printStatus():void{
        console.log(this.name, this.id, this.employees, this.reports)
    }

    addReport(a:string):void{
        this.reports.push(a);
        this.latestReport = a;
    }

    printReports():void{
        console.log(this.reports);
    }

    addSalariedEmployee(a:string):void{
        this.salariedEmployees.push(a); // we can access protected variables from here.
    }
}

let accounting = new Accounting('xyz', ['repport1','report2']);

accounting.addReport('report3');

accounting.setLatestReport = "sdsd";

console.log(accounting.getLatestReport);

const Ramesh:Employee = Department.createEmployee('Ramesh', 33);
const Irvin:Employee = Department.createEmployee('Irvin', 12);

accounting.addEmployee(Ramesh);
accounting.addEmployee(Irvin);

accounting.printEmployees();

let it:ITDepartment = ITDepartment.create('ght', ['admin1', 'admin2']);

it.addEmployee(Ramesh);
it.addEmployee(Irvin);

accounting.printStatus();
it.printStatus();
