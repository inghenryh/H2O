import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import {
  PaperProvider,
  useTheme,
  Button,
  MD3LightTheme,
  configureFonts,
} from "react-native-paper";
import LoginNav from "./routes/Login-nav.js";
import { Provider } from "@Ctx";
import { AlertNotificationRoot } from "react-native-alert-notification";
export default function App() {
  const fontConfig = {
    fontFamily: "NotoSans",
  };

  const theme = useTheme({
    ...MD3LightTheme,
    colors: {
      primary: "#1976CC",
      accent: "#65C92F",
    },
    fonts: configureFonts(fontConfig),
  });

  return (
    <PaperProvider theme={theme}>
      <Provider>
        <AlertNotificationRoot>
          <LoginNav />
        </AlertNotificationRoot>
      </Provider>
    </PaperProvider>
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
