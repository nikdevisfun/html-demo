class SuperTask {
    constructor(parallelCount = 2) {
        this.tasks = [];
        this.parallelCount = parallelCount;
        this.runningCount = 0;
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.tasks.push({ task, resolve, reject });
            this._run();
        });
    }

    _run() {
        while (this.runningCount < this.parallelCount && this.tasks.length) {
            const { task, resolve, reject } = this.tasks.shift();
            this.runningCount++;
            Promise.resolve(task())
                .then(resolve, reject)
                .finally(() => {
                    this.runningCount--;
                    this._run();
                });
        }
    }
}

const supertask = new SuperTask();

function timeout(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function addTask(time, name) {
    supertask
        .add(() => timeout(time))
        .then(() => {
            console.log(`The task ${name} is done.`);
        });
}

// addTask(10e3, 1);
// addTask(5e3, 2);
// addTask(3e3, 3);
// addTask(4e3, 4);
// addTask(5e3, 5);
addTask(1e3, 1);
addTask(1e3, 2);
addTask(1e3, 3);
addTask(1e3, 4);
addTask(1e3, 5);
