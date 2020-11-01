/// <reference path="../validator/validation-register.ts" />

namespace app {

    export function Require(target: any, key: string) {
        setRegister(target, key, { type: 'required', status: true });
    }
    
    export function Length(min: number, max: number) {
        return function (target: any, key: string) {
            setRegister(target, key, {
                type: 'length',
                minLength: min || 0,
                maxlength: max || 100
            })
        }
    }
    
    export function NumRange(min: number, max: number) {
        return function (target: any, key: string) {
            setRegister(target, key, {
                type: 'range',
                min: min || 0,
                max: max || 100
            })
        }
    }
    
    export function Bind(target: any, key: string, propertyDescriptor: PropertyDescriptor) {
        let originalFunction = propertyDescriptor.value;
        return {
            configurable: true,
            enumerable: false,
            get() {
                return originalFunction.bind(this);
            }
        }
    }
}