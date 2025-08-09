function sum(x, y, z) {
    return x + y + z;
}

// console.log(sum(1, 2, 3));

// console.log(sum(1, 2));
// console.log(sum(3, 4));
//

function addx(x) {
    return function addy(y) {
        return function addz(z) {
            return x + y + z;
        };
    };
}

// console.log(addx(1)(2)(3));

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

const curriedSum = curry(sum);

// console.log(curriedSum.toString());
// console.log(curriedSum(1).toString());
// console.log(curriedSum(1)(2).toString());
// console.log(curriedSum(1)(2)(3).toString());

//
// args length
// console.log(sum.length);

function compose(...fns) {
    return function (x) {
        return fns.reduceRight((value, fn) => fn(value), x);
    };
}

const reverse = (str) => str.split('').reverse().join('');
const uppercase = (str) => str.toUpperCase();

const composeFunc = compose(uppercase, reverse);
console.log(composeFunc('hello world'));
