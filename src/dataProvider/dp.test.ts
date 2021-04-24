import { withStaticData, withDynamicData } from "./DataProviders";
import { GET_ONE } from ".";
import { UPDATE, DELETE, CREATE } from "./dataFetchActions";

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
