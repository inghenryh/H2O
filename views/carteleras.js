import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
  TextInput,
} from "react-native";
import { Button, List, Icons, ActivityIndicator } from "react-native-paper";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getCarteleras, getEmpresas } from "@Services";
import { alertError } from "@Utils/alerts";
export default function Carteleras() {
  const navigation = useNavigation();
  const [carteleras, setCarteleras] = React.useState([]);
  const [cartelerasOriginal, setCartelerasOriginal] = React.useState([]); //original
  const [empresas, setEmpresas] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  function loadAll() {
    getEmpresas()
      .then((dataEmpresa) => {
        setEmpresas(dataEmpresa.empresas);
        getCarteleras()
          .then((data) => {
            // add razon social and order by empresa name
            data = data.map((cartelera) => {
              cartelera.empresa_data = dataEmpresa.empresas.find(
                (empresa) => empresa._id === cartelera.empresa
              );
              return cartelera;
            });

            data = data.sort((a, b) => {
              if (a.empresa_data.razonSocial < b.empresa_data.razonSocial) {
                return -1;
              }
              if (a.empresa_data.razonSocial > b.empresa_data.razonSocial) {
                return 1;
              }
              return 0;
            });
            setCartelerasOriginal(data);
            setCarteleras(data);
            setLoading(false);
          })
          .catch((error) => {
            alertError(error.message, "Error al cargar las carteleras");
          });
      })
      .catch((error) => {
        alertError(error.message, "Error al cargar las carteleras");
      });
  }
  React.useEffect(() => {
    loadAll();
  }, []);
  //refresh on navigation
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadAll();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ScrollView
        // recargar
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              loadAll();
            }}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Ionicons name="search" size={24} color="black" style={{}} />
          <TextInput
            placeholder="Buscar"
            style={{
              backgroundColor: "white",
              width: "80%",
              alignSelf: "center",
              marginTop: 10,
              height: 40,
              backgroundColor: "#f0f0f0",
              //linea
              borderBottomWidth: 1,
              padding: 10,
              marginLeft: 10,
            }}
            onChangeText={(text) => {
              if (text === "") {
                setCarteleras(cartelerasOriginal);
              } else {
                // filter by name and razon social
                setCarteleras(
                  cartelerasOriginal.filter(
                    (cartelera) =>
                      cartelera.name
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      cartelera.empresa_data.razonSocial
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  )
                );
              }
            }}
          />
        </View>

        {/*loading && (
          <ActivityIndicator
            animating={true}
            color="#000"
            size="large"
            style={{
              position: "absolute",
              //en el centro
              top: Dimensions.get("window").height / 2 - 20,
              left: Dimensions.get("window").width / 2 - 20,
            }}
          />
        )*/}
        <List.Section>
          <List.Subheader>Carteleras</List.Subheader>
          {carteleras.map((cartelera) => (
            <List.Item
              key={cartelera._id}
              title={cartelera?.empresa_data?.razonSocial}
              description={cartelera.name}
              left={(props) => <List.Icon {...props} icon="bulletin-board" />}
              onPress={() => {
                navigation.navigate("Cartelera", {
                  cartelera: cartelera,
                  empresas,
                });
              }}
            />
          ))}
        </List.Section>
        <Button
          icon="plus"
          mode="contained"
          onPress={() => {
            navigation.navigate("Cartelera", {
              empresas,
              cartelera: {
                name: "",
                empresa: "",
                secciones: [],
                branding: {
                  name: "",
                  logo: "",
                  color: "#000400",
                  slogan: "",
                },
              },
            });
          }}
          style={{
            width: "80%",
            alignSelf: "center",
            elevation: 10,
            marginTop: 10,
          }}
        >
          Nueva Cartelera
        </Button>
      </ScrollView>
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
