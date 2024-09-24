import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseSchema(nameSchema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Database environment undefined.");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', nameSchema);

  return url.toString();
}


export default <Environment>{
  name: 'prisma',
  transformMode: "ssr",
  async setup() {

    const schema = randomUUID();

    // Seta a nova variavel de ambiente
    process.env.DATABASE_URL = generateDatabaseSchema(schema);

    // Roda as migrations dentro do banco de dados sem ver se há alterações
    execSync('yarn prisma migrate deploy');

    return {
      async teardown() {
        // Dropa o banco de dados de testes
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      },
    };
  },
}