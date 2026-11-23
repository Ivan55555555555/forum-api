import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export function createDb(databaseUrl: string) {
  return postgres<Contract>({
    contract: contractJson as unknown as Contract,
    url: databaseUrl,
  });
}

export type Database = ReturnType<typeof createDb>;