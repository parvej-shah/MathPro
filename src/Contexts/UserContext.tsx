"use client";

import React, { useState, createContext } from "react";

interface UserState {
  isLoggedIn: boolean;
  loading: boolean;
  darkMode: boolean;
  scoreTrigger?: boolean;
}

type UserContextValue = [UserState, React.Dispatch<React.SetStateAction<UserState>>];

export const UserContext = createContext<UserContextValue>([] as unknown as UserContextValue);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    loading: false,
    darkMode: true,
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
