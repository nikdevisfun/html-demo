class Observe {
    constructor() {
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    unsubscribe(fn) {
        this.subscribers = this.subscribers.filter((item = item !== fn));
    }

    notifySubscriber() {
        this.subscribers.forEach((fn) => {
            fn();
        });
    }
}

const observer = new Observe();
const listener = () => {
    console.log('Get it');
};
observer.subscribe(listener);

observer.notifySubscriber();
