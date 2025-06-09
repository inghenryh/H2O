import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import { Button } from "react-native-paper";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

export default function Inicio() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.jpeg")}
        resizeMode="cover"
        style={styles.image}
        blurRadius={3}
        //filter black opacity
      >
        <View style={styles.overlay} />

        <StatusBar style="auto" />
        <View style={styles.container}>
          <Image
            source={require("@Assets/H2O.png")}
            style={{
              width: 200,
              height: 200,
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
            icon="login"
            mode="contained"
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{
              width: "80%",
              alignSelf: "center",
              elevation: 10,
              marginTop: 10,
            }}
          >
            Iniciar Sesión
          </Button>
        </View>
      </ImageBackground>
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
