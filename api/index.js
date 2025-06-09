import axios from "axios";
import { alertError, alertSuccess } from "@Utils/alerts";
const baseUrl = "https://api.infomia.asociadosh2o.com/api/v1/";
import AsyncStorage from "@react-native-async-storage/async-storage";

//axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCarteleras = async () => {
  try {
    //{"data": {"__v": 0, "_id": "6539547b18f6fb698e2873b7", "empresas": ["653fb40d0bdb787cd5fe3e40", "653fb3de0bdb787cd5fe3e32"], "nombre": "Norberis Villalobos", "password": "", "role": "H2OADMIN", "user": "norberis"}, "id": "6539547b18f6fb698e2873b7", "ok": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibm9yYmVyaXMiLCJkYXRhIjp7Il9pZCI6IjY1Mzk1NDdiMThmNmZiNjk4ZTI4NzNiNyIsInVzZXIiOiJub3JiZXJpcyIsInBhc3N3b3JkIjoiIiwiZW1wcmVzYXMiOlsiNjUzZmI0MGQwYmRiNzg3Y2Q1ZmUzZTQwIiwiNjUzZmIzZGUwYmRiNzg3Y2Q1ZmUzZTMyIl0sIm5vbWJyZSI6Ik5vcmJlcmlzIFZpbGxhbG9ib3MiLCJyb2xlIjoiSDJPQURNSU4iLCJfX3YiOjB9LCJpZCI6IjY1Mzk1NDdiMThmNmZiNjk4ZTI4NzNiNyIsImlhdCI6MTcxNzA5NTg1NCwiZXhwIjoxNzE5Njg3ODU0fQ.0HtXomLyj9qpN11vxMeLSyLAQxmSV5yTdTlpNKxIcbA", "usuario": "norberis"}
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ getCarteleras ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.get("Carteleras/Carteleras", {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ getCarteleras ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
      } else {
        alertError("Error al obtener las carteleras");
      }
    }
  }
  return [];
};

export const getAlertas = async () => {
  /*
    React.useEffect(() => {
    getData();
  }, []);
  function getData() {
    AlphaApi_Fetch("api/v1/Empresas/getAlertsEmpresas", "GET").then((res) => {
      setAlertas(res.data.alertas);
    });
  }
    */
  try {
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ getAlertas ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.get("Empresas/getAlertsEmpresas", {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ getAlertas ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
      } else {
        alertError("Error al obtener las alertas");
      }
    }
  }
  return [];
};
export const markAlert = async (alerta) => {
  /*
 AlphaApi_Fetch(
                        "api/v1/Empresas/checkAlert",
                        "POST",
                        alerta
                      ).then((res) => {
                        getData();
                      });
                      */
  try {
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ markAlert ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.post("Empresas/checkAlert", alerta, {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
    });
    alertSuccess("Alerta marcada correctamente");
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ markAlert ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
      } else {
        alertError("Error al marcar la alerta");
      }
    }
  }
};
//https://api.infomia.asociadosh2o.com/api/v1/Empresas/getall

export const getEmpresas = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ getEmpresas ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.get("Empresas/getall", {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ getEmpresas ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
      } else {
        alertError("Error al obtener las empresas");
      }
    }
  }
  return [];
};

export const saveCartelera = async (cartelera) => {
  //api/v1/Carteleras/save POST
  try {
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ saveCartelera ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.post("Carteleras/save", cartelera, {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
    });
    alertSuccess("Cartelera guardada correctamente");
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ saveCartelera ~ error.response.data.error:",
          error.response.data.error,
          error.response.data
        );
        alertError(error.response.data.error);
        throw new Error(error.response.data.error);
      } else {
        alertError("Error al guardar la cartelera");
        throw new Error("Error al guardar la cartelera");
      }
    }
  }
  return [];
};
//api/v1/carteleras/delete DELETE
export const deleteCartelera = async (cartelera) => {
  try {
    const user = await AsyncStorage.getItem("user");
    const token = JSON.parse(user)?.token;
    if (!token) {
      console.log("🚀 ~ deleteCartelera ~ token:", token);
      alertError("No se ha iniciado sesión");
      await AsyncStorage.removeItem("user");
      return [];
    }
    const response = await axiosInstance.delete(`Carteleras/delete`, {
      headers: {
        "Auth-Token": `${token}`,
        "Content-Type": "application/json",
      },
      data: {
        ...cartelera,
      },
    });
    alertSuccess("Cartelera eliminada correctamente");
    return response.data;
  } catch (error) {
    console.log(error);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ deleteCartelera ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
        throw new Error(error.response.data.error);
      } else {
        alertError("Error al eliminar la cartelera");
        throw new Error("Error al eliminar la cartelera");
      }
    }
  }
  return [];
};
export const login = async (user, password) => {
  try {
    const response = await axiosInstance.post("Login/login", {
      user,
      password,
    });
    alertSuccess("Sesión iniciada correctamente", "Inicio de sesión");
    return response.data;
  } catch (error) {
    console.log(error.response);
    //error handling
    if (error.response) {
      if (error.response.data.error) {
        console.log(
          "🚀 ~ login ~ error.response.data.error:",
          error.response.data.error
        );
        alertError(error.response.data.error);
      } else {
        alertError("Error al iniciar sesión");
      }
    }
  }
};
