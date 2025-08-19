//  get
//
// const handler = {
//     get: function (target, property, receiver) {
//         return property in target
//             ? target[property]
//             : `Property ${property} not found`;
//     },
// };
//
// const proxy = new Proxy({ message: 'hello world' }, handler);
//
// console.log(proxy.message);
// console.log(proxy.name);

// set
const handler = {
    set: function (target, property, value, receiver) {
        if (property === 'age' && typeof value !== 'number') {
            throw new TypeError('The age must be a number')
        }
        // target[property] = value
        Reflect.set(target, property, value.toString() + ' years old', receiver)
        return true
    },
}

const proxy = new Proxy({}, handler)
proxy.age = 12
console.log(proxy.age)
