interface User {
    name: string
    age: number
}

function hello(params: User) {
    console.log(params.name)
}

interface Person {
    name: string
    age: number
    is_work: boolean
}
