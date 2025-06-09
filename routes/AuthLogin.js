import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/* Vistas */
import Inicio from "../views/publics/Inicio";
import Login from "../views/publics/Login";
//import Escanear from "@Views/publics/Escanear";

function AuthLogin() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={"Inicio"}>
      <Stack.Screen
        name="Inicio"
        component={Inicio}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      {/*<Stack.Screen
        name="Escanear"
        component={Escanear}
        options={{ headerShown: false }}
      />*/}
    </Stack.Navigator>
  );
}

export default AuthLogin;
