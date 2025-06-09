import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Context = createContext();

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getStoreUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser != null) {
        const currentUser = JSON.parse(savedUser);
        console.log("Usuario logeado", currentUser);
        setUser(currentUser);
      } else {
        console.log("Usuario no logeado");
        setUser(null);
      }
    } catch (error) {
      console.log("el error es", error);
    }
  };
  useEffect(() => {
    getStoreUser();
  }, []);

  const saveUser = async (user) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.log("el error es", error);
    }
  };
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log("el error es", error);
    }
  };
  const getRole = () => {
    return user ? user.role : null;
  };
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        saveUser,
        getStoreUser,
        logout,
        getRole,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
