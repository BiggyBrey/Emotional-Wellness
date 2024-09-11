import { redirect } from "react-router-dom";
import React, { createContext, useContext, useState } from "react";
// if user isnt logged in, and tries tro access protected path
// reroute to login page
export async function requireAuth() {
  const isLoggedIn = localStorage.getItem("userID");
  if (!isLoggedIn) {
    throw redirect("/login?message=You must log in first");
  }
  return null;
}
export const UserAuthContext = createContext();

export function UserAuth({ children }) {
  const [user, setUser] = useState(null);

  const login = (userInfo) => {
    setUser(userInfo); // Update the user state with the logged-in user's info
  };

  const logout = () => {
    setUser(null); // Clear user state on logout
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUserAuth() {
  return useContext(UserAuthContext);
}
export function signOut() {
  localStorage.removeItem("userID");
  return redirect("/");
}
