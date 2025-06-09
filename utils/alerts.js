import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

function alertError(message, title = "Error") {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: title,
    textBody: message,
    button: "cerrar",
  });
}

function alertSuccess(message, title = "Success") {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: title,
    textBody: message,
    button: "cerrar",
  });
}

function alertWarning(message, title = "Warning") {
  Dialog.show({
    type: ALERT_TYPE.WARNING,
    title: title,
    textBody: message,
    button: "cerrar",
  });
}

export { alertError, alertSuccess, alertWarning, AlertNotificationRoot, Toast };
