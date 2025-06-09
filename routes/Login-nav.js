import { StyleSheet, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
/* Rutas Globales */
import AuthClient from "./AuthClient";
import AuthLogin from "./AuthLogin";
import { Context } from "@Ctx";

export default function LoginNav() {
  const { user, setUser } = useContext(Context);

  return (
    <NavigationContainer>
      {user ? <AuthClient /> : <AuthLogin />}
    </NavigationContainer>
  );
}
