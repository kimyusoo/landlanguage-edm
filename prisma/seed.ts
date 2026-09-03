/**
 * Prisma 시드 스크립트 (프로덕션 데이터 경로).
 * 현재 저장소는 DATA_BACKEND=mock 인메모리 시드로 완전히 동작하므로,
 * PostgreSQL + Prisma 로 전환할 때 이 파일을 채워 넣으세요.
 *
 * 예)
 *   import { PrismaClient } from "@prisma/client";
 *   import { MOCK_SOURCES } from "../src/lib/mock/sources";
 *   const prisma = new PrismaClient();
 *   await prisma.source.createMany({ data: MOCK_SOURCES.map(...) });
 */
async function main() {
  console.log(
    "[seed] Mock Mode 에서는 시드가 필요 없습니다. Prisma 전환 시 prisma/seed.ts 를 구현하세요.",
  );
}

main();
