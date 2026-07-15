import { Model, Document } from "mongoose";

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  sort?: any;
  select?: string | Record<string, number | boolean>;
  populate?: any;
}

export interface PaginatedResult<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export const paginate = async <T extends Document>(
  model: Model<T>,
  query: any = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> => {
  let page = Number(options.page) || 1;
  let limit = Number(options.limit) || 10;
  
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  let queryBuilder: any = model.find(query).sort(options.sort || {});

  if (options.select) {
    queryBuilder = queryBuilder.select(options.select);
  }

  if (options.populate) {
    queryBuilder = queryBuilder.populate(options.populate);
  }

  const results = await queryBuilder.skip(skip).limit(limit);

  return { results, page, totalPages, totalItems };
};
