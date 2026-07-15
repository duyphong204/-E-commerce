import { Model, Document } from "mongoose";

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  sort?: any;
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
  let page = parseInt(options.page as string, 10);
  let limit = parseInt(options.limit as string, 10);
  
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const skip = (page - 1) * limit;
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const results = await model
    .find(query)
    .sort(options.sort || {})
    .skip(skip)
    .limit(limit);

  return { results, page, totalPages, totalItems };
};
