import React, { useEffect } from "react";

import { isLoggedIn, createLoginRedirectUrl } from "../helpers";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = createLoginRedirectUrl();
    }
  }, []);

  return <div>{children}</div>;
};
