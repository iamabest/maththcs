import { User, UserFilterOptions } from '../types/user.js';
import { PaginatedResult, PaginationParams } from '../types/common.js';
import { IRepository } from './base.repository.js';
import { getInitialUsers } from './seed-data.js';

export interface IUserRepository extends IRepository<User, UserFilterOptions> {
  findByEmail(email: string): Promise<User | null>;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    // Seed initial users
    getInitialUsers().forEach((user) => {
      this.users.set(user.id, user);
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return user ? { ...user } : null;
  }

  async findMany(
    params: PaginationParams,
    filter?: UserFilterOptions
  ): Promise<PaginatedResult<User>> {
    let list = Array.from(this.users.values());

    if (filter?.role) {
      list = list.filter((u) => u.role === filter.role);
    }

    if (filter?.isActive !== undefined) {
      list = list.filter((u) => u.isActive === filter.isActive);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map((u) => ({ ...u }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const id = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const user: User = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return { ...user };
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;

    const updated: User = {
      ...existing,
      ...data,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

// Singleton repository instance
export const userRepository = new InMemoryUserRepository();
