// const sum = new Function('a', 'b', 'return a + b;');
//
// console.log(sum(1, 4));

function createSandbox(pluginCodes) {
    var sandbox = {
        name: 'sandbox',
    };

    var script = new Function('sandbox', pluginCodes);
    script(sandbox);
}

const pluginCode = `
    sandbox.run = function() {
        console.log('Plugin is running on', this.name)
    }
    sandbox.run()
`;

createSandbox(pluginCode);
