import _ from "lodash";

/**
 * data types
 */

export type Identifier = string | number;
export type Record<T> = Identifier & T;
export const ORDER_ASC = "ASC";
export const ORDER_DES = "DES";
export interface Sort {
  field: string;
  order: typeof ORDER_ASC | typeof ORDER_DES;
}
export interface Pagination {
  page: number;
  perPage: number;
}
export interface GetListParams {
  pagination: Pagination;
  sort: Sort;
  filter: any;
}
export interface GetListResult<T> {
  data: Record<T>[];
  total: number;
}

export interface GetOneParams {
  id: Identifier;
}
export interface GetOneResult<T> {
  data: Record<T>;
}

export interface GetManyParams {
  ids: Identifier[];
}
export interface GetManyResult<T> {
  data: Record<T>[];
}

export interface GetManyReferenceParams {
  target: string;
  id: Identifier;
  pagination: Pagination;
  sort: Sort;
  filter: any;
}
export interface GetManyReferenceResult<T> {
  data: Record<T>[];
  total: number;
}

export interface UpdateParams<T> {
  id: Identifier;
  data: Partial<T>;
  previousData: Record<T>;
}
export interface UpdateResult<T> {
  data: Record<T>;
}

export interface UpdateManyParams<T> {
  ids: Identifier[];
  data: Partial<T>;
}
export interface UpdateManyResult {
  data?: Identifier[];
}

export interface CreateParams<T> {
  //TODO 如何从T得到一个Exclude<T,'id>？， t.delete? 不行。
  data: Exclude<T, "id">;
  // data:T
}
export interface CreateResult<T> {
  data: Record<T>;
}
function insureId<T>(result: { data: any }): { data: Record<T> } {
  if (_.isNil(result.data.id)) {
    return { data: { ...result.data, id: _.uniqueId() } };
  } else {
    return result as { data: Record<T> };
  }
}

export function createResult(data: any) {
  return insureId({ data });
}

// export function getListResult(list:any[],total:number){
//   return {total:total,data:list.map(item=>}
// }
export interface DeleteParams {
  id: Identifier;
}
export interface DeleteResult<T> {
  data?: Record<T>;
}

export interface DeleteManyParams {
  ids: Identifier[];
}
export interface DeleteManyResult {
  data?: Identifier[];
}
