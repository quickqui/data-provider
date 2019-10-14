import fakeDataProvider from 'ra-data-fakerest'
import { GET_ONE } from './dataFetchActions'
import { chain, forResource } from './DataProviders';




import "./Wrapper"


const dataProvider = forResource("posts", fakeDataProvider({
    posts: [
        { id: 0, title: 'Hello, world!' },
        { id: 1, title: 'FooBar' },
    ],

}))
const dataProvider2 = forResource(["comments"], fakeDataProvider({
    comments: [
        { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
        { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
    ],
}))

const dp3 = {comments: [
    { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
    { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
]}.staticWrapToDataProvider().chain(dataProvider)



test('data provider', async () => {
    const a = dataProvider
    const data = await a(GET_ONE, "posts", { id: 1 })
    expect(data).not.toBeUndefined()
    expect(data.data.id).toBe(1)
})
test('data provider chain', async () => {
    const a = chain(dataProvider, dataProvider2)
    const data = await a(GET_ONE, "posts", { id: 1 })
    expect(data).not.toBeUndefined()
    expect(data.data.id).toBe(1)
    const data2 = await a(GET_ONE, "comments", { id: 0 })
    expect(data2).not.toBeUndefined()
    expect(data2.data.id).toBe(0)

    let data3 = undefined
    try {
        data3 = await a(GET_ONE, "posts", { id: 3 })
        expect(1).toBe(2)
    } catch (e) {
        expect(e).not.toBeUndefined()
    }
})

test('object merge', () => {
    const a = { a: 1, b: 2 }
    const b = { b: 3 }
    const c = { ...a, ...b }
    expect(c.b).toBe(3)
    expect(c.a).toBe(1)
    const d = { b: 4, ...b }
    expect(d.b).toBe(3)
    const e = { ...b, b: 4 }
    expect(e.b).toBe(4)
})

test('contact',()=>{
    const a =[1,2,3]
    const b=[4,5]
    const c = [...a,...b]
    expect(c).toHaveLength(5)
    const d = [a,...b]
    expect(d).toHaveLength(3)
    expect(d[0]).toHaveLength(3)
    const e =[undefined]
    const f =[...a,...e]
    expect(f).toHaveLength(4)
})