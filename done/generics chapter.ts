const arr:Array<string|boolean> = ['hello', true,];

const prom:Promise<string> = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('Resolved');
    }, 2000)
});

prom.then((data)=>{
    console.log(data);
});

//Generic types are Types that operate on other types but the other types need to be specified
// the format is like Generic<T> where T needs to be specified like Array<string> Promise<T>

function merge<T extends object,U extends object>(o1:T, o2:U) {
    return Object.assign(o1, o2);
}

let val = merge({poop:'lots'},{grass:'mew'});

console.log();

interface HasLength {
    length:number;
}

function countAndDescribe<T extends HasLength>(item:T){
    return `the count is ${item.length}`
}

function extract<T extends object, U extends keyof T>(obj:T, name:U){
    return obj[name];
}

extract({hello:'beans', grass:'green'}, 'grass');

class SomeStorage<T extends string | number | boolean> {

    private data:T[] = [];

    pushData(d:T){
        this.data.push(d);
    }

    removeData(d:T){
        this.data.splice(this.data.indexOf(d), 0);
    }

    getData(){
        return [...this.data];
    }
}


let cStore = new SomeStorage();
cStore.pushData('melon');
cStore.pushData(10);

console.log(cStore.getData())

function mergeX<T extends object,U extends object>(o1:T, o2:U):(T & U){
    let obj: Partial<T & U> = {}

    for(let [key, value] of Object.entries(o1)){
        Object.assign(obj, {[key]:value});
    }
    for(let [key,value] of Object.entries(o2)){
        Object.assign(obj, {[key]:value});
    }
    return obj as (T & U);
}

let obx = merge({name:'sunny'}, {kaka:'poop'});

console.log(obx.kaka)

let userInfo:Readonly<string[]> = ['code', 'morecode'];