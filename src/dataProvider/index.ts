import { GetListParams } from "./types";

export {
  NotCovered,
  DataProviderParams,
  DataProvider,
  chain,
  forResourceAndFetchTypeOneParam,
  forResource,
  forResourceAndFetchType,
  fakeForFunction,
  wrap,
  asyncWrap,
} from "./DataProviders";
export {
  withDynamicData,
  withStaticData,
  w,
  w as dp,
  localSFP,
} from "./Wrapper";
export {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
} from "./dataFetchActions";

export const NONE_SFP: GetListParams = {
  pagination: { page: 1, perPage: 10000 },
  sort: { field: "id", order: "ASC" },
  filter: {},
};
