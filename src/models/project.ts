    import {Require, Length, NumRange }from "../decorators/decorators.js";

    export class Project {
        @Require
        title: string;
    
        @Require
        @Length(3, 100)
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