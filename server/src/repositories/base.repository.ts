import { PaginatedResult, PaginationParams } from '../types/common.js';

export interface IRepository<T, TFilter = any> {
  findById(id: string): Promise<T | null>;
  findMany(params: PaginationParams, filter?: TFilter): Promise<PaginatedResult<T>>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
