// src/services/session.server.ts
import { useSession } from "@tanstack/react-start/server";
import type { User } from "@prisma/client";

type SessionUser = {
  userName: User["name"];
};

export function useAppSession() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET is not set");
  }

  return useSession<SessionUser>({
    password: sessionSecret,
  });
}
