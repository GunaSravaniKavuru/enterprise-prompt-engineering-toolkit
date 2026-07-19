import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredAuth() {
  if (typeof window === "undefined") {
    return {
      isLoggedIn: false,
      userName: "",
      userEmail: "",
    };
  }

  return {
    isLoggedIn: window.localStorage.getItem("isLoggedIn") === "true",
    userName: window.localStorage.getItem("userName") || "",
    userEmail: window.localStorage.getItem("userEmail") || "",
  };
}

export function AuthProvider({ children }) {
  const initialAuth = readStoredAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [userName, setUserName] = useState(initialAuth.userName);
  const [userEmail, setUserEmail] = useState(initialAuth.userEmail);

  const login = ({ name, email }) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);

    window.localStorage.setItem("isLoggedIn", "true");
    window.localStorage.setItem("userName", name);
    window.localStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");

    window.localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("userEmail");
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      userName,
      userEmail,
      login,
      logout,
    }),
    [isLoggedIn, userName, userEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}