let button = document.querySelector('button');
if(button){
    button.addEventListener('click',function(this, event){console.log(this)})

}

const add:(x:number, n:number) => void = function(a:number, b:number = 10):void {
    console.log(a+b);
}
//To make the spread operator work, your array needs to have a type that is in line with the arguments that the function accepts.
let arr:[number, number] =  [1,2];

add(...arr);