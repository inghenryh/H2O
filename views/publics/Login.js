import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import axios from "axios";
//yup
import * as yup from "yup";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { login } from "@Services";
import { useEffect, useContext } from "react";
import { Context } from "@Ctx";
const loginSchema = yup.object({
  user: yup.string().required(),
  password: yup.string().required().min(2),
});

export default function Login() {
  const navigation = useNavigation();
  const { user, setUser, saveUser } = useContext(Context);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@Assets/background.jpeg")}
        resizeMode="cover"
        style={styles.image}
        blurRadius={3}
        //filter black opacity
      >
        <View style={styles.overlay} />

        <StatusBar style="auto" />
        <View style={styles.container}>
          <ScrollView
            style={{
              marginTop: "20%",
            }}
          >
            <Image
              source={require("@Assets/H2O.png")}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginBottom: 50,
              }}
              resizeMode="contain"
            />
            <Formik
              initialValues={{ user: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values) => {
                console.log(values);
                login(values.user, values.password)
                  .then((response) => {
                    if (response) {
                      console.log("🚀 ~ login ~ response:", response);
                      saveUser({
                        ...response.data,
                        token: response.token,
                      });
                    }
                  })
                  .catch((error) => {
                    console.log("🚀 ~ login ~ error:", error);
                  });
              }}
            >
              {(props) => (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 10,
                    padding: 10,
                    margin: 10,
                  }}
                >
                  <TextInput
                    label={"Usuario"}
                    mode="outlined"
                    style={{
                      backgroundColor: "white",
                      width: "80%",
                      alignSelf: "center",
                      marginTop: 10,
                    }}
                    onChangeText={props.handleChange("user")}
                    value={props.values.user}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TextInput
                    label={"Contraseña"}
                    secureTextEntry={true}
                    mode="outlined"
                    style={{
                      backgroundColor: "white",
                      width: "80%",
                      alignSelf: "center",
                      marginTop: 10,
                    }}
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                  />
                  <Text style={{ color: "red" }}>
                    {props.touched.password && props.errors.password}
                  </Text>
                  <Text style={{ color: "red" }}>
                    {props.touched.user && props.errors.user}
                  </Text>
                  <Button
                    icon="login"
                    mode="contained"
                    onPress={props.handleSubmit}
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
              )}
            </Formik>
          </ScrollView>
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
