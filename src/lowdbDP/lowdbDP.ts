import {
  DataProvider,
  GET_ONE,
  UPDATE,
  CREATE,
  GET_LIST,
  DELETE,
  GET_MANY_REFERENCE,
  GET_MANY,
  UPDATE_MANY,
  DELETE_MANY,
  NONE_SFP,
} from "../dataProvider";
import { LowWrapper } from "./lowWrapper";
import _ from "lodash";
import {
  GetOneParams,
  CreateParams,
  UpdateParams,
  GetListParams,
  DeleteParams,
  ORDER_ASC,
  GetManyReferenceParams,
  GetManyParams,
  UpdateManyParams,
  DeleteManyParams,
} from "../dataProvider/types";

export default function dpFromLowDB(wrapper: LowWrapper): DataProvider {
  const db = wrapper.db;
  return (fetchType, resource, params) => {
    const collection = db.defaults({ [resource]: [] }).get(resource);

    if (fetchType === GET_ONE) {
      const re = collection.getById((params as GetOneParams).id).value();
      return re ? { data: re } : undefined;
    }

    if (fetchType === CREATE) {
      const re = collection.insert((params as CreateParams<any>).data).write();
      return { data: re };
    }
    if (fetchType === UPDATE) {
      const re = collection.upsert((params as UpdateParams<any>).data).write();
      return { data: re };
    }
    if (fetchType === GET_LIST) {
      const { filter, sort, pagination } = params as GetListParams;
      // if (pagination) {
      //   throw new Error("pagination not supported yet");
      // }
      const { page, perPage } = pagination || NONE_SFP.pagination;
      const pg = page;
      const pgSize = perPage;
      const offset = (pg - 1) * pgSize;
      if (sort) {
        if ((sort.order = ORDER_ASC)) {
          const t = collection.filter(filter).sortBy(sort.field).value();
          const re = _.drop(t, offset).slice(0, pgSize);
          return { total: t.length, data: re };
        } else {
          const t = collection
            .filter(filter)
            .sortBy(sort.field)
            .reverse()
            .value();
          const re = _.drop(t, offset).slice(0, pgSize);
          return { total: t.length, data: re };
        }
      }
      const t = collection
        .filter(filter)
        .value();
      const re = _.drop(t,offset).slice(0, pgSize);
      return { total: t.length, data: re };
    }
    if (fetchType === DELETE) {
      const re = collection.removeById((params as DeleteParams).id).write();
      return { data: re };
    }
    if (fetchType === GET_MANY_REFERENCE) {
      const { filter, sort, pagination, target, id } =
        params as GetManyReferenceParams;
      if (pagination) {
        throw new Error("pagination not supported yet");
      }
      const newFilter = { ...filter, [target]: id };
      if (sort) {
        if ((sort.order = ORDER_ASC)) {
          const re = collection.filter(newFilter).sortBy(sort.field).value();
          return { total: re.length, data: re };
        } else {
          const re = collection
            .filter(newFilter)
            .sortBy(sort.field)
            .reverse()
            .value();
          return { total: re.length, data: re };
        }
      }
      const re = collection.filter(newFilter).value();
      return { total: re.length, data: re };
    }
    if (fetchType === GET_MANY) {
      const { ids } = params as GetManyParams;
      const data = collection.filter((item) => ids.includes(item.id));
      return { data };
    }
    if (fetchType === UPDATE_MANY) {
      const { ids, data } = params as UpdateManyParams<unknown>;
      ids.forEach((id) => collection.updateById(id, { ...data }).value());
      db.write();
      return { data: ids };
    }
    if (fetchType === DELETE_MANY) {
      const { ids } = params as DeleteManyParams;
      ids.forEach((id) => collection.removeById(id).value());
      db.write();
      return { data: ids };
    }

    throw new Error("not supported - " + fetchType);
  };
}
