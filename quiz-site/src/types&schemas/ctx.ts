import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

export type ctx = {
  session: {
    user: {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    } & {
      id: string;
    };
    expires: string;
  };
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
