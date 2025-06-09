import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { WebView } from "react-native-webview";
import { alertError } from "@Utils/alerts";
import React from "react";
export default function Escanear() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [url, setUrl] = React.useState("");
  React.useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        setHasPermission(true);
      } else {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
        if (status !== "granted") {
          alertError("Se necesita permiso para acceder a la cámara");
          navigation.goBack();
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Otorgar permisos para acceder a la cámara</Text>
      ) : hasPermission === false ? (
        <Text>Permiso denegado</Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={(scanningResult) => {
            console.log(scanningResult);
            setScanned(true);
            setUrl(scanningResult.data);
            setModalVisible(true);
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <View
        style={{
          //bottm
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 36,
        }}
      >
        <Text style={styles.text}>Escanea el codigo QR de la cartelera</Text>
        <Button
          icon="close"
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{
            width: "80%",
            alignSelf: "center",
            elevation: 10,
            marginTop: 10,
            backgroundColor: "red",
            color: "white",
          }}
        >
          Cerrar
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <WebView source={{ uri: url }} style={{ marginTop: 20 }} />
        <Button
          icon="close"
          mode="contained"
          onPress={() => setModalVisible(false)}
          style={{
            width: "80%",
            alignSelf: "center",
            elevation: 10,
            marginTop: 10,
            backgroundColor: "red",
            color: "white",
          }}
        >
          Cerrar
        </Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  image: {
    flex: 1,
    justifyContent: "center",
    //blur
    //blurRadius={10}
  },
  text: {
    color: "white",
    fontSize: 20,
    padding: 10,
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
