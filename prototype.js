function Person(name) {
    this.name = name;
    this.age = 12;
}

Person.prototype.age = '13';

Person.prototype.say = function () {
    console.log("I'm", this.name);
};

const alan = new Person('Alan');
const peter = new Person('Peter');

// console.log(alan.age);
// console.log(peter.age);

// delete alan.age;
// console.log(alan.age);

function Child(name) {
    Person.call(this, name);
    this.age = 44;
}

Child.prototype.__proto__ = Person.prototype;

const child = new Child('Mary');

console.log(child.name, child.age);
child.say();
console.log(child.constructor);
