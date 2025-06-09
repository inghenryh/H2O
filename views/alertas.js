import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Text, List, SegmentedButtons } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Context } from "@Ctx";
import { useContext, useEffect, useState } from "react";
import { getAlertas, markAlert } from "@Services";
import { alertError } from "@Utils/alerts";
import { Picker } from "@react-native-picker/picker";
import Autocomplete from "react-native-autocomplete-input";
import moment from "moment";
export default function Alerts() {
  const navigation = useNavigation();
  const { logout, getRole } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [alertas, setAlertas] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("Todos");

  function loadAll() {
    getAlertas()
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);
        setAlertas(data.alertas);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alertError(error.message, "Error al cargar las alertas");
      });
  }
  useEffect(() => {
    loadAll();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text} variant="displayMedium">
        Alertas
      </Text>
      {/*
         {alertas.map((alerta, index) => (
          <ListItem key={index}>
            <Alert
              sx={{ width: "100%" }}
              variant="outlined"
              severity={alerta.checked ? "success" : "warning"}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    //handleClose();
                    //post -> checkAlert
                    AlphaApi_Fetch(
                      "api/v1/Empresas/checkAlert",
                      "POST",
                      alerta
                    ).then((res) => {
                      getData();
                    });
                  }}
                >
                  {alerta.checked ? (
                    <UndoOutlinedIcon />
                  ) : (
                    <CheckOutlinedIcon />
                  )}
                </IconButton>
              }
            >
              <AlertTitle>{alerta.empresa}</AlertTitle>
              {alerta.alerta} -{" "}
              {moment(alerta.fechaLimite).format("DD/MM/YYYY")}
            </Alert>
          </ListItem>
        ))}
        */}

      <View
        style={{
          width: "100%",
          padding: 10,
        }}
      >
        {/*  <View
          style={{
            // Hack required to make the autocomplete
            // work on Andrdoid
   
          }}
        >
          <Autocomplete
            autoCorrect={false}
            data={alertas.map((alerta) => alerta.empresa)}
            value={filterEmpresa}
            //onChangeText={(text) => setFilterEmpresa(text)}
            placeholder={"Buscar por empresa"}
            flatListProps={{
              keyExtractor: (_, idx) => idx,
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => setFilterEmpresa(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </View>*/}

        <Picker
          selectedValue={filterEmpresa}
          onValueChange={(itemValue, itemIndex) => setFilterEmpresa(itemValue)}
          mode="dialog"
          prompt="Filtrar por empresa"
        >
          <Picker.Item label="Todos" value="Todos" />
          {alertas
            .filter(
              (alerta, index, self) =>
                self.findIndex((t) => t.empresa === alerta.empresa) === index
            )
            .sort((a, b) => a.empresa.localeCompare(b.empresa))
            .map((alerta) => {
              return (
                <Picker.Item label={alerta.empresa} value={alerta.empresa} />
              );
            })}
        </Picker>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value)}
          density={"small"}
          buttons={[
            { value: "", label: "Todos" },
            {
              value: "Seniat",
              label: "Seniat",
            },
            {
              value: "Municipal",
              label: "Municipal",
            }, //Pensiones
            {
              value: "Pensiones",
              label: "Pensiones",
            }, //Permiso Sanitario
            {
              value: "Permiso Sanitario",
              label: "P. Sanitario",
            },
          ]}
        />
      </View>
      <View style={{}}>
        <ImageBackground
          source={require("../assets/H2O.png")}
          resizeMode="contain"
          imageStyle={{
            opacity: 0.3,
            width: "100%",
            //blur
            padding: "15%",
          }}
        >
          <ScrollView
            // recargar
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
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
            <List.Section>
              {alertas
                .filter((alerta) => {
                  if (filter === "") return true;
                  if (
                    (alerta.alerta.includes("Alcaldia") ||
                      alerta.alerta.includes("Bomberos")) &&
                    filter === "Municipal"
                  )
                    return true;
                  return alerta.alerta.includes(filter);
                })
                .filter((alerta) => {
                  if (filterEmpresa === "Todos") return true;
                  return alerta.empresa === filterEmpresa;
                })
                .map((alerta, index) => (
                  <List.Item
                    key={index}
                    title={alerta.empresa}
                    description={
                      alerta.alerta +
                      " - " +
                      moment(alerta.fechaLimite).format("DD/MM/YYYY")
                    }
                    style={{
                      backgroundColor: alerta.checked
                        ? "rgba(4, 215, 0, 0.4)"
                        : "rgba(53, 121, 204, 0.53)",
                    }}
                    left={(props) =>
                      alerta.checked ? (
                        <List.Icon {...props} icon="check" />
                      ) : (
                        <List.Icon {...props} icon="alert" />
                      )
                    }
                    right={(props) =>
                      getRole() === "H2OADMIN" && (
                        <Button
                          {...props}
                          onPress={() => {
                            markAlert(alerta);
                            loadAll();
                            //handleClose();
                            //post -> checkAlert
                            // AlphaApi_Fetch(
                            //   "api/v1/Empresas/checkAlert",
                            //   "POST",
                            //   alerta
                            // ).then((res) => {
                            //   getData();
                            // });
                          }}
                        >
                          {alerta.checked ? "Desmarcar" : "Marcar"}
                        </Button>
                      )
                    }
                  />
                ))}
            </List.Section>
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontWeight: "bold",
    padding: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
});
