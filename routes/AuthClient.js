import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
/* Vistas */
import Home from "@Views/home";
import Cartelera from "@Views/cartelera";
//import Escanear from "@Views/publics/Escanear";
import Ionicons from "@expo/vector-icons/Ionicons";
//load fonts
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BottomNav from "./BottomNav";
import { useFonts } from "expo-font";
function AuthClient() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={"BottomNav"}>
      <Stack.Screen
        name="BottomNav"
        component={BottomNav}
        options={{
          headerShown: false,
          //name of the screen
          title: "Inicio",
        }}
      />
      <Stack.Screen
        name="Cartelera"
        component={Cartelera}
        options={{ headerShown: true }}
      />
      {/*<Stack.Screen
        name="Escanear"
        component={Escanear}
        options={{ headerShown: false }}
      />*/}
    </Stack.Navigator>
  );
}

export default AuthClient;
