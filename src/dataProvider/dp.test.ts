import {
  withStaticData,
  withDynamicData,
  forResourceAndFetchType,
  forResourceAndFetchTypeOneParam,
  DataProviderResult,
} from "./DataProviders";
import { GET_ONE } from "./dataFetchActions";
import { UPDATE } from "./dataFetchActions";

let dataset;
beforeEach(() => {
  dataset = {
    data: [
      { id: 1, content: 0 },
      { id: 2, content: 0 },
    ],
  };
});
test("static", async () => {
  const data = dataset;
  const dp = withStaticData(data);
  const re = await dp(GET_ONE, "data", { id: 1 });
  expect(re.data?.id).toBe(1);
});

test("dynamic", async () => {
  expect.hasAssertions();
  const data = () => dataset;
  const dp = withDynamicData(data);
  const re = await dp(GET_ONE, "data", { id: 1 });
  expect(re.data?.id).toBe(1);
  expect(re.data?.content).toBe(0);
});

test("no write", async () => {
  expect.hasAssertions();
  const data = () => dataset;
  const dp = withDynamicData(data);
  const re = await dp(GET_ONE, "data", { id: 1 });
  expect(re.data?.id).toBe(1);
  expect(re.data?.content).toBe(0);
});

test("write", async () => {
  const data = () => dataset;
  const dp = withDynamicData(data);
  expect(() =>
    dp(UPDATE, "data", {
      id: 1,
      data: { content: 1 },
      previousData: { id: 1, content: 0 },
    })
  ).toThrow("not writable");
});
// test("add", async () => {
//   expect.hasAssertions();
//   const data = () => dataset;
//   const dp = withDynamicData(data);
//   const re = await dp(CREATE, "data", {
//     data: { id: 3, content: 1 },
//   });
//   expect(re.data?.id).toBe(3);
//   expect(re.data?.content).toBe(1);
//   console.log(dataset);
// });
// test("delete", async () => {
//   expect.hasAssertions();
//   const data = () => dataset;
//   const dp = withDynamicData(data);
//   const re = await dp(DELETE, "data", {
//     id: 1,
//   });
//   expect(re.data?.id).toBe(1);
//   expect(re.data?.content).toBe(0);
//   console.log(dataset);
// });
test("for fetchType and resource", async () => {
  expect.hasAssertions();
  const dp = forResourceAndFetchType(
    "test",
    GET_ONE,
    withStaticData({ test: [{ id: 1, data: "data" }] })
  );
  expect(() => dp(GET_ONE, "notTest", { id: 1 })).toThrow("NotCovered");
  const re = await dp(GET_ONE, "test", { id: 1 });
  expect(re.data).toEqual(expect.objectContaining({ id: 1 }));
});

test("for fetchType and resource one parameter", async () => {
  expect.hasAssertions();
  const raw = withStaticData({ test: [{ id: 1, data: "data" }] });

  const dp = forResourceAndFetchTypeOneParam(
    "test",
    GET_ONE,
    async (params: any) => {
      return await raw(GET_ONE, "test", params);
    }
  );
  expect(() => dp(GET_ONE, "notTest", { id: 1 })).toThrow("NotCovered");
  const re = await dp(GET_ONE, "test", { id: 1 });
  expect(re.data).toEqual(expect.objectContaining({ id: 1 }));
});
test("for fetchType and resource one parameter await ", async () => {
  expect.hasAssertions();

  const dp = forResourceAndFetchTypeOneParam(
    "test",
    GET_ONE,
    async (params: any) => {
      return await { data: { id: 1 } };
    }
  );
  expect(() => dp(GET_ONE, "notTest", { id: 1 })).toThrow("NotCovered");
  const re = await dp(GET_ONE, "test", { id: 1 });
  expect(re.data).toEqual(expect.objectContaining({ id: 1 }));
});

test("for fetchType and resource one parameter promise", async () => {
  expect.hasAssertions();

  const dp = forResourceAndFetchTypeOneParam("test", GET_ONE, (params: any) => {
    return Promise.resolve({ data: { id: 1 } });
  });
  expect(() => dp(GET_ONE, "notTest", { id: 1 })).toThrow("NotCovered");
  const re = await dp(GET_ONE, "test", { id: 1 });
  expect(re.data).toEqual(expect.objectContaining({ id: 1 }));
});
test("for fetchType and resource one parameter pain value", async () => {
  expect.hasAssertions();

  const dp = forResourceAndFetchTypeOneParam("test", GET_ONE, (params: any) => {
    return { data: { id: 1 } };
  });
  expect(() => dp(GET_ONE, "notTest", { id: 1 })).toThrow("NotCovered");
  const re = await dp(GET_ONE, "test", { id: 1 });
  expect(re.data).toEqual(expect.objectContaining({ id: 1 }));
});
