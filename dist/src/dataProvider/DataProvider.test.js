"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
const dataFetchActions_1 = require("./dataFetchActions");
const DataProviders_1 = require("./DataProviders");
const dataProvider = DataProviders_1.forResource("posts", ra_data_fakerest_1.default({
    posts: [
        { id: 0, title: 'Hello, world!' },
        { id: 1, title: 'FooBar' },
    ],
}));
const dataProvider2 = DataProviders_1.forResource(["comments"], ra_data_fakerest_1.default({
    comments: [
        { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
        { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
    ],
}));
test('data provider', async () => {
    const a = dataProvider;
    const data = await a(dataFetchActions_1.GET_ONE, "posts", { id: 1 });
    expect(data).not.toBeUndefined();
    expect(data.data.id).toBe(1);
});
test('data provider chain', async () => {
    const a = DataProviders_1.chain(dataProvider, dataProvider2);
    const data = await a(dataFetchActions_1.GET_ONE, "posts", { id: 1 });
    expect(data).not.toBeUndefined();
    expect(data.data.id).toBe(1);
    const data2 = await a(dataFetchActions_1.GET_ONE, "comments", { id: 0 });
    expect(data2).not.toBeUndefined();
    expect(data2.data.id).toBe(0);
    let data3 = undefined;
    try {
        data3 = await a(dataFetchActions_1.GET_ONE, "posts", { id: 3 });
        expect(1).toBe(2);
    }
    catch (e) {
        expect(e).not.toBeUndefined();
    }
});
//# sourceMappingURL=DataProvider.test.js.map