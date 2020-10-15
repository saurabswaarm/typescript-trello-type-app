type obx = {
    input1 :(string|number);
    input2 : (string|number);
    descriptor: 'text' | 'number';
}

function combine(obj:obx) {
    let result: (string | number);

    if (obj.descriptor == 'number' && (typeof obj.input1 != 'number' || typeof obj.input2 != 'number')) {
        console.log('aaaaaaa' + obj.input1 + obj.input2);
        return;
    } else if (obj.descriptor == 'number') {
        result = +obj.input1 + +obj.input2;
    } else {
        result = obj.input1.toString() + obj.input2.toString();
    }

    console.log(result);
}

combine({input1: 'hello', input2: 'you', descriptor:'text'});