/**
 * ISqliteRepository
 * A generic interface for relational persistence of domain entities.
 */
export interface ISqliteRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  toggleFollow(id: string, isFollowing: boolean): Promise<void>;
  delete?(id: string): Promise<void>;
}
