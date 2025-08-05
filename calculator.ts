interface MyPlugin {
    name: string;
    calculate: (num: number) => this;
}

class Calculator {
    [key: string]: any;
    num = 0;
    plugins: MyPlugin[] = [];
    constructor(initial: number) {
        this.num = initial;
    }

    use(plugin: MyPlugin) {
        this.plugins.push(plugin);
        this[plugin.name] = plugin.calculate.bind(this);
    }

    result() {
        return this.num;
    }
}

class AddPlugin implements MyPlugin {
    name = 'add';
    num = 0;
    calculate(num: number) {
        this.num = this.num + num;
        return this;
    }
}

class SubtractPlugin implements MyPlugin {
    name = 'subtract';
    num = 0;
    calculate(num: number) {
        this.num = this.num - num;
        return this;
    }
}

const calculator = new Calculator(4);

calculator.use(new AddPlugin());
calculator.use(new SubtractPlugin());

const result = calculator.add(4).subtract(1).result();
console.log(result);
