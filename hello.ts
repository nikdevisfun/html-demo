// TODO: rewrite this logic
//
// FIX: edge case for null
//
// HACK: temporary workaround
//
// NOTE: refactor later

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

hello({ name: 'Nik', age: 34 })
hello({ name: 'Nik', age: 33 })
