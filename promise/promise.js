// Handwrite promise

const PENDING_STATE = 'pending'
const FULLFILLED_STAE = 'fullfilled'
const REJECTED_STATE = 'rejected'

class MyPromise {
    state = PENDING_STATE
    value = void 0
    reason = undefined
    onFullfilledCallbacks = []
    onRejectedCallbacks = []

    constructor(excutor) {
        const resolve = (value) => {
            this.value = value
            this.state = FULLFILLED_STAE
            this.onFullfilledCallbacks.forEach((func) => func())
        }

        const rejected = (reason) => {
            this.reason = reason
            this.state = REJECTED_STATE
            this.onRejectedCallbacks.forEach((func) => func())
        }

        try {
            excutor(resolve, rejected)
        } catch (error) {
            rejected(error)
        }
    }

    then(onFullfilled, onRejected) {
        if (this.state === FULLFILLED_STAE) {
            onFullfilled(this.value)
        }
        if (this.state === REJECTED_STATE) {
            onRejected(this.reason)
        }
        if (this.state === PENDING_STATE) {
            this.onFullfilledCallbacks.push(() => onFullfilled(this.value))
            this.onRejectedCallbacks.push(() => onRejected(this.reason))
        }
    }
}

function test() {
    new MyPromise((resolve, _) => {
        setTimeout(() => {
            resolve('cool!')
            // reject(new Error('something wrong'));
        }, 1000)
    }).then(
        (data) => {
            console.log('Success', data)
        },
        (err) => {
            console.log('Fail', err)
        },
    )
}

test()
