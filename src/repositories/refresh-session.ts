import type { RefreshRepository } from "../domain/refresh-session/repository.js";

type Database = typeof import("../prisma/db.js").db;

export function createRefreshSessionRepository(
  database: Database
): RefreshRepository {
  return {
    async getByHash(hash) {
      return await database.orm.public.RefreshSession.where({
        tokenHash: hash,
      }).first();
    },
    async create(data) {
      await database.orm.public.RefreshSession.create(data);
    },
    async rotate(oldHash, newHash, expiresAt) {
      const updated = await database.orm.public.RefreshSession.where({
        tokenHash: oldHash,
      }).update({
        tokenHash: newHash,
        expiresAt: expiresAt,
      });
      return updated !== null;
    },
    async deleteByHash(hash) {
      await database.orm.public.RefreshSession.where({
        tokenHash: hash,
      }).delete();
    },
  };
}