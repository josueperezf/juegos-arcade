"use client";

import { useCallback, useEffect, useState } from "react";
import { getSession, setSession, type SessionUser } from "./session";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from localStorage (external system) on mount, per the
    // hydration-mismatch mitigation in specs/01-mvp-visual-arcade-vault.md.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getSession());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const login = useCallback((sessionUser: SessionUser) => {
    setSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  return { user, hydrated, login, logout };
}
