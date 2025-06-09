import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Context } from "@Ctx";
import { useContext } from "react";

export default function Home() {
  const navigation = useNavigation();
  const { logout } = useContext(Context);
  return (
    <View style={styles.container}>
      <Image
        source={require("@Assets/H2O.png")}
        style={{
          width: "50%",
          height: "20%",
          alignSelf: "center",
          marginBottom: 50,
        }}
        contentFit="contain"
      />
      <Button
        icon="qrcode"
        mode="elevated"
        onPress={() => navigation.navigate("Escanear")}
        style={{ width: "80%", alignSelf: "center", elevation: 10 }}
      >
        Escanear Cartelera
      </Button>
      <Button
        mode="contained"
        icon="login"
        style={{
          width: "80%",
          alignSelf: "center",
          elevation: 10,
          marginTop: 10,
          backgroundColor: "red",
          color: "white",
        }}
        onPress={() => {
          Alert.alert("Cerrar Sesión", "¿Estás seguro de cerrar sesión?", [
            {
              text: "No",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Si",
              onPress: () => {
                logout();
              },
            },
          ]);
        }}
      >
        Cerrar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    //blur
    //blurRadius={10}
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
});
