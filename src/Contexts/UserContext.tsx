"use client";

import React, { useState, createContext } from "react";

export const UserContext = createContext({});

export const UserContextProvider = (props: any) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    loading: false,
    openCompiler:false,
    darkMode:true
  });

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};
