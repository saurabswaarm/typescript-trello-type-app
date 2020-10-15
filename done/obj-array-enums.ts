enum ColorSchemes {dark, light, monokai};
let str:string = 'hello';

const person: {
    name: string;
    age: number;
    hobbies: string[];
    eyes: [string, string]
    colorScheme: ColorSchemes;
} = {
    name: 'Max',
    age: 20,
    hobbies: ['trekking', 'sex'],
    eyes: ['brown', 'glasses'],
    colorScheme : ColorSchemes.dark,
}

console.log(person.colorScheme == ColorSchemes.dark)
