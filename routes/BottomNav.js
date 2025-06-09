import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
/* Vistas */
import Home from "@Views/home";
import Carteleras from "@Views/carteleras";
import Alerts from "@Views/alertas";
import Cartelera from "@Views/cartelera";
import Login from "@Views/publics/Login";
import Ionicons from "@expo/vector-icons/Ionicons";
//load fonts
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useFonts } from "expo-font";
function BottomNav() {
  const tab = createBottomTabNavigator();

  return (
    <tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Carteleras") {
            iconName = focused ? "easel" : "easel-outline";
          } else if (route.name === "Alertas") {
            iconName = focused ? "notifications" : "notifications-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <tab.Screen name="Home" component={Home} />
      <tab.Screen name="Carteleras" component={Carteleras} />
      <tab.Screen name="Alertas" component={Alerts} />
    </tab.Navigator>
  );
}

export default BottomNav;
