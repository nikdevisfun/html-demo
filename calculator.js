var Calculator = /** @class */ (function () {
    function Calculator(initial) {
        this.num = 0;
        this.plugins = [];
        this.num = initial;
    }
    Calculator.prototype.use = function (plugin) {
        this.plugins.push(plugin);
        this[plugin.name] = plugin.calculate.bind(this);
    };
    Calculator.prototype.result = function () {
        return this.num;
    };
    return Calculator;
}());
var AddPlugin = /** @class */ (function () {
    function AddPlugin() {
        this.name = 'add';
        this.num = 0;
    }
    AddPlugin.prototype.calculate = function (num) {
        this.num = this.num + num;
        return this;
    };
    return AddPlugin;
}());
var SubtractPlugin = /** @class */ (function () {
    function SubtractPlugin() {
        this.name = 'subtract';
        this.num = 0;
    }
    SubtractPlugin.prototype.calculate = function (num) {
        this.num = this.num - num;
        return this;
    };
    return SubtractPlugin;
}());
var calculator = new Calculator(4);
calculator.use(new AddPlugin());
calculator.use(new SubtractPlugin());
var result = calculator.add(4).subtract(1).result();
console.log(result);
