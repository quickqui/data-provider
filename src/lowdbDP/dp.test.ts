import dpFromLowDB from "./lowdbDP";
import {
  GET_ONE,
  UPDATE,
  CREATE,
  GET_LIST,
  GetListParams,
  DELETE,
  GetListResult,
  DataProvider,
  DELETE_MANY,
  UPDATE_MANY,
  GET_MANY_REFERENCE,
  GetManyReferenceParams,
} from "..";
import * as fs from "fs";
import { LowWrapper } from "./lowWrapper";
import FileSync from "lowdb/adapters/FileSync";

beforeEach(() => {
  fs.truncateSync(".db.json");
});
const table = () => [
  ["file db", dpFromLowDB(new LowWrapper({}, new FileSync(".db.json")))],
  ["memory db", dpFromLowDB(new LowWrapper({}))],
];

test.each(table())(
  "%s simple add and update",
  async (name, dp: DataProvider) => {
    expect.hasAssertions();
    const getOne = await dp(GET_ONE, "tests", { id: 1 });
    expect(getOne).toBeUndefined();
    const re = await dp(CREATE, "tests", { data: { name: "elsa" } });
    expect(re).toBeDefined();
    const elsa = re.data.id;
    expect(elsa).toBeDefined();
    const getElsa = await dp(GET_ONE, "tests", { id: elsa });
    expect(getElsa.data).toEqual(expect.objectContaining({ id: elsa }));
    await dp(UPDATE, "tests", {
      data: { ...getElsa.data, updated: true },
      id: (getElsa as any).id,
      previousData: getElsa,
    });
    const newElsa = await dp(GET_ONE, "tests", { id: elsa });
    expect(newElsa.data).toEqual(
      expect.objectContaining({ id: elsa, updated: true })
    );
  }
);

test.each(table())("%s  add and find", async (name, dp: DataProvider) => {
  expect.hasAssertions();
  const getOne = await dp(GET_ONE, "tests", { id: 1 });
  expect(getOne).toBeUndefined();
  const re = await dp(CREATE, "tests", { data: { name: "elsa" } });
  const find = await dp(GET_LIST, "tests", {
    filter: { name: "elsa" },
  } as GetListParams);
  expect(find.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "elsa", id: (re as any).data.id }),
    ])
  );
});
test.each(table())("%s  add and get list", async (name, dp: DataProvider) => {
  expect.hasAssertions();
  const getOne = await dp(GET_ONE, "tests", { id: 1 });
  expect(getOne).toBeUndefined();
  const re = await dp(CREATE, "tests", { data: { name: "elsa" } });
  const re2 = await dp(CREATE, "tests", { data: { name: "elsa" } });
  const find = await dp(GET_LIST, "tests", {
    filter: { name: "elsa" },
    pagination: { page: 1, perPage: 1 },
  } as GetListParams);
  expect(find.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "elsa", id: (re as any).data.id }),
    ])
  );
  expect(find).toEqual(expect.objectContaining({total:2}))
});
test.each(table())("%s  delete", async (_, dp: DataProvider) => {
  expect.hasAssertions();
  const getOne = await dp(GET_ONE, "tests", { id: 1 });
  expect(getOne).toBeUndefined();
  const re = await dp(CREATE, "tests", { data: { name: "elsa" } });
  const find = await dp(GET_LIST, "tests", {
    filter: { name: "elsa" },
  } as GetListParams);
  expect(find.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "elsa", id: (re as any).data.id }),
    ])
  );
  await dp(DELETE, "tests", { id: re.data.id });
  const findAgain = await dp(GET_LIST, "tests", {
    filter: { name: "elsa" },
  } as GetListParams);
  expect((findAgain as GetListResult<unknown>).total).toEqual(0);
});

test.each(table())("%s delete many", async (_, dp: DataProvider) => {
  expect.hasAssertions();
  const getOne = await dp(GET_ONE, "tests", { id: 1 });
  expect(getOne).toBeUndefined();
  const re = await dp(CREATE, "tests", { data: { name: "elsa" } });
  await dp(DELETE_MANY, "tests", { ids: [re.data.id] });
  const findAgain = await dp(GET_LIST, "tests", {
    filter: { name: "elsa" },
  } as GetListParams);
  expect((findAgain as GetListResult<unknown>).total).toEqual(0);
  const findAll = await dp(GET_LIST, "tests", {} as GetListParams);
  expect((findAll as GetListResult<unknown>).total).toEqual(0);
});

test.each(table())("%s update many", async (_, dp: DataProvider) => {
  expect.hasAssertions();
  const re1 = await dp(CREATE, "tests", { data: { name: "elsa" } });
  const re2 = await dp(CREATE, "tests", { data: { name: "vincent" } });
  await dp(CREATE, "tests", { data: { name: "tera" } });
  await dp(UPDATE_MANY, "tests", {
    ids: [re1.data.id, re2.data.id],
    data: { love: true },
  });
  const findAgain = await dp(GET_LIST, "tests", {
    filter: { love: true },
  } as GetListParams);
  expect((findAgain as GetListResult<unknown>).total).toEqual(2);
  const findAll = await dp(GET_LIST, "tests", {} as GetListParams);
  expect((findAll as GetListResult<unknown>).total).toEqual(3);
});

test.each(table())("%s get many reference", async (_, dp: DataProvider) => {
  expect.hasAssertions();
  await dp(CREATE, "tests", { data: { name: "elsa", loveId: 1 } });
  await dp(CREATE, "tests", { data: { name: "vincent", loveId: 1 } });
  await dp(CREATE, "tests", { data: { name: "tera", loveId: 2 } });
  const findAgain = await dp(GET_MANY_REFERENCE, "tests", {
    target: "loveId",
    id: 1,
  } as GetManyReferenceParams);
  expect((findAgain as GetListResult<unknown>).total).toEqual(2);
  const findAll = await dp(GET_LIST, "tests", {} as GetListParams);
  expect((findAll as GetListResult<unknown>).total).toEqual(3);
});
