import { withStaticData, withDynamicData } from "./DataProviders";
import { GET_ONE } from ".";

test("static", () => {
  const data = {
    data: [{ id: 1 }, { id: 2 }],
  };
  const dp = withStaticData(data);
  expect(dp).not.toBeUndefined;
  const get = dp(GET_ONE, "data", { id: 1 });
  return get.then((d) => {
    expect(d).toBeUndefined;
    expect(d.data?.id).toBe(1);
  });
});


test("dynamic", () => {
  let content = 0
  const data = ()=> ({
    data: [{ id: 1 ,content}, { id: 2 ,content}],
  });
  const dp = withDynamicData(data);
  expect(dp).not.toBeUndefined;
  const get = dp(GET_ONE, "data", { id: 1 });
  return get.then((d) => {
    expect(d).toBeUndefined;
    expect(d.data?.id).toBe(1);
    expect(d.data?.content).toBe(0);
  });
});

