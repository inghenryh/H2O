/* 
PORT de web a movil

ModifCartelera.js

import NiceModal, { useModal } from "@ebay/nice-modal-react";
//dialog mui
//mui textfields
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Grid,
  //Select
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
//icons
//add icon
import { QRCodeCanvas } from "qrcode.react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import AlphaApi_Fetch from "../api/httpservice";
//schema
import { SketchPicker } from "react-color";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ImageSelector from "./ImageSelector";
import DropFile from "./dropFile";
import env from "../env";

export default NiceModal.create(({ Cartelera, endpoint, method }) => {
  // Use a hook to manage the modal state
  const [showQr, setShowQr] = useState(false);
  const modal = useModal();
  //console.log(Schelma);
  const [cartelera, setCartelera] = useState(Cartelera);
  const [Empresas, setEmpresas] = React.useState([]);
  const [BorrarSegurityInputShow, setBorrarSegurityInputShow] =
    React.useState(false);
  const [BorrarSegurityInput, setBorrarSegurityInput] = React.useState("");

  function getData() {
    AlphaApi_Fetch("api/v1/Empresas/getall", "GET").then((res) => {
      setEmpresas(res.data.empresas);
    });
  }
  useEffect(() => {
    if (Cartelera) {
      getData();
      setCartelera(Cartelera);
    } else {
      setCartelera({
        Nombre: "",
        Descripcion: "",
        Secciones: [],
      });
    }
  }, [Cartelera]);

  const handleChange = (event) => {
    setCartelera({
      ...cartelera,
      [event.target.name]: event.target.value,
    });
  };
  //ref
  const qrRef = useRef(null);

  const send = () => {
    if (cartelera.empresa == "") {
      toast.error("No se ha seleccionado una empresa " + cartelera.empresa);
      return;
    }
    //cartelera e
    console.log(
      "🚀 ~ file: ModifCartelera.js:55 ~ .promise ~ cartelera:",
      cartelera
    );
    toast
      .promise(AlphaApi_Fetch(endpoint, method, { ...cartelera }), {
        loading: "Guardando...",
        success: (data) => {
          return "Guardado con exito";
        },
        error: (err) => {
          return "Error al guardar";
        },
      })
      .then((response) => {
        modal.resolve();
        modal.hide();

        console.log(
          "🚀 ~ file: login.jsx:136 ~ onSubmit: ~ response",
          response
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const downloadQR = async () => {
    var qrcode = document.getElementById("qrcode");
    console.log(
      "🚀 ~ file: ModifCartelera.js:105 ~ downloadQR ~ qrRef:",
      qrRef,
      qrcode
    );
    const oldCanvas = qrcode.querySelector("canvas");

    const newCanvas = document.createElement("canvas");
    const context = newCanvas.getContext("2d");

    newCanvas.width = 320;
    newCanvas.height = 320;

    // create white background and center the text
    context.font = "14px Roboto";
    context.fillStyle = "white";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillRect(0, 0, 320, 320);

    // create style for text inside canvas
    context.fillStyle = "#4A4A4A";
    context.fillText("Scan Here to Order", newCanvas.width / 2, 20);
    // copy oldCanvas to newCanvas
    //wait for image to load
    await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, 320, 320);
        resolve();
      };
      image.src = oldCanvas.toDataURL("image/png");
    });
    context.drawImage(oldCanvas, 35, 35, 250, 250);
    context.fillText("Thank You, Have a nice day ", newCanvas.width / 2, 305);

    const image = newCanvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qr-code.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("CARTuseeffect", cartelera);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }, [cartelera]);
  return (
    <div>
      <Button variant="contained" onClick={modal.show}>
        <AddIcon />
      </Button>
      <Dialog
        open={modal.visible}
        onClose={() => {
          modal.resolve();
          modal.hide();
        }}
        fullWidth
        //md
        maxWidth="lg"
      >
        <DialogTitle>Cartelera {cartelera?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="label">Descripción</Typography>
              <TextField
                fullWidth
                label="Descripción"
                value={cartelera?.name}
                onChange={handleChange}
                name="name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="label">Empresa</Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">
                  Empresa
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={cartelera.empresa}
                  label="Empresa"
                  onChange={(e) => {
                    setCartelera({
                      ...cartelera,
                      empresa: e.target.value,
                    });
                  }}
                  name="empresa"
                >
                  {Empresas?.map((opt) => {
                    return (
                      <MenuItem key={opt._id} value={opt._id}>
                        {opt.razonSocial}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>Empresa</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="label">Color Empresa</Typography>
              <SketchPicker
                color={cartelera.branding?.color}
                onChangeComplete={(color) => {
                  setCartelera({
                    ...cartelera,
                    branding: {
                      ...cartelera.branding,
                      color: color.hex,
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className="image-eyedropper-mode-wrapper">
              <Typography variant="label">Logo Empresa</Typography>
              <ImageSelector
                Image={cartelera.branding?.logo}
                onImageSelected={(image) => {
                  setCartelera({
                    ...cartelera,
                    branding: {
                      ...cartelera.branding,
                      logo: image,
                    },
                  });
                }}
                widthReq={400}
                heightReq={400}
                ImageHeigth={"200px"}
                ClassDrop="dropzoneLogo"
                FormOpen={false}
                Style={{
                  width: 240,
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <>
                {cartelera.secciones.map((seccion, index) => {
                  return (
                    <DropFile
                      setCartelera={setCartelera}
                      item={seccion}
                      index={index}
                      list={cartelera.secciones}
                    />
                  );
                })}
              </>
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                onClick={() => {
                  setCartelera({
                    ...cartelera,
                    secciones: [
                      ...cartelera.secciones,
                      {
                        tag: "nueva sección #" + cartelera.secciones.length,
                        archivos: [],
                      },
                    ],
                  });
                }}
                startIcon={<AddIcon />}
              >
                Agregar sección
              </Button>
            </Grid>
            {showQr && (
              <Grid item xs={12} md={12}>
                <QRCodeCanvas
                  size={291}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"Q"}
                  includeMargin={true}
                  imageSettings={{
                    src: "https://infomia.asociadosh2o.com/assets/H2O-4ec26f4b.png",
                    x: undefined,
                    y: undefined,
                    height: 58,
                    width: 87,
                    excavate: true,
                  }}
                  value={env.BASE_URL + "Cartelera/" + cartelera._id}
                  ref={qrRef}
                  id="qrcode"
                />
                <br />
              </Grid>
            )}
            <Grid item xs={12} md={12}>
              <Button
                onClick={() => {
                  setShowQr(!showQr);
                }}
                startIcon={<QrCodeIcon />}
              >
                Generar QR
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                onClick={() => {
                  //print area qrcode
                  var printContents = document.getElementById("qrcode");
                  var w = window.open();
                  w.document.write(printContents.innerHTML);
                  w.print();
                  w.close();
                }}
                startIcon={<QrCodeIcon />}
              >
                Imprimir QR
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setBorrarSegurityInputShow(!BorrarSegurityInputShow);
            }}
          >
            {" "}
            BORRAR{" "}
          </Button>
          {BorrarSegurityInputShow && (
            <>
              <TextField
                label={"Escriba razón social para BORRAR"}
                value={BorrarSegurityInput}
                onChange={(e) => {
                  setBorrarSegurityInput(e.target.value);
                }}
                name="BorrarSegurityInput"
                placeholder={cartelera.razonSocial}
              />
              <Button
                color="error"
                onClick={() => {
                  if (BorrarSegurityInput == cartelera.razonSocial) {
                    AlphaApi_Fetch(
                      "api/v1/carteleras/delete",
                      "DELETE",
                      cartelera
                    ).then((res) => {
                      toast.success("Borrado con exito");
                      modal.resolve();
                      modal.hide();
                    });
                  } else {
                    toast.error("Razon social incorrecta");
                  }
                }}
              >
                CONFIRMAR
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              modal.resolve();
              modal.hide();
            }}
          >
            Cancelar
          </Button>
          <Button onClick={send}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
dropFile.js
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React from "react";
import { useDropzone } from "react-dropzone";
//iconButton
//save icon
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
//edit icon
//next row  icon left
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
//next row  icon right
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Input from "@mui/material/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Stack } from "@mui/material";
import env from "../env";
//rows icons up and down
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export default function DropFile({ setCartelera, item, index, list }) {
  const [loadingDoc, setLoadingDoc] = React.useState(false);

  const AddHeader = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null;
    }

    return (
      <>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6">
            {state.currentDocument.fileName || ""}
          </Typography>
          <div>
            <IconButton
              onClick={previousDocument}
              disabled={state.currentFileNo === 0}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={nextDocument}
              disabled={state.currentFileNo >= state.documents.length - 1}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Typography variant="label">
            {state.currentFileNo + 1} de {state.documents.length}
          </Typography>
        </Stack>
      </>
    );
  };

  const onDrop = (acceptedFiles) => {
    setLoadingDoc(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      // pasar a base 64 segun tipo de archivo
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        const data = new FormData();
        data.append("file", binaryStr);
        //limit 14mb
        if (binaryStr.length > 16680064) {
          alert("El archivo es muy grande");
          setLoadingDoc(false);
          return;
        }
        //base64 is file
        //set cartelera file
        setCartelera((p) => {
          let prevState = { ...p };
          prevState.secciones[index].archivos.push({
            name: file.name,
            file: {
              base64: binaryStr,
              name: file.name,
            },
          });
          //timeout 300
          setTimeout(() => {
            setLoadingDoc(false);
          }, 300);
          return prevState;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
  });
  const [openInputTag, setOpenInputTag] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    console.log("🚀 ~ file: dropFile.jsx:80 ~ React.useEffect ~ item", item);
  }, [item]);
  const handleChange = (panel) => (event, isExpanded) => {
    //disable collapse when edit
    if (openInputTag) {
      setExpanded(true);
      return;
    }

    setExpanded(isExpanded ? panel : false);

    //si se cierra el panel
  };
  const [tagTmp, setTagTmp] = React.useState(item.tag);
  return (
    <Accordion
      key={"Collp" + index}
      onChange={handleChange("Collp" + index)}
      expanded={expanded}
    >
      <AccordionSummary
        //edit

        expandIcon={
          <>
            <ExpandMoreIcon />
          </>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <IconButton
          aria-label="up"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            setCartelera((p) => {
              let prevState = { ...p };
              prevState.secciones = prevState.secciones.filter(
                (item, i) => i !== index
              );
              prevState.secciones.splice(index - 1, 0, item);
              return prevState;
            });
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton
          aria-label="down"
          disabled={index === list.length - 1}
          onClick={(e) => {
            e.stopPropagation();
            setCartelera((p) => {
              let prevState = { ...p };
              prevState.secciones = prevState.secciones.filter(
                (item, i) => i !== index
              );
              prevState.secciones.splice(index + 1, 0, item);
              return prevState;
            });
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
        <input
          type="text"
          value={item.tag}
          onChange={(e) => {
            setCartelera((p) => {
              let prevState = { ...p };
              console.log("🚀 ~ file: dropFile.jsx:144 ~ setCartelera ~ p:", p);
              prevState.secciones[index].tag = e.target.value;
              return prevState;
            });
          }}
          style={{
            border: openInputTag ? "1px solid black" : "none",
            width: "100%",
            textAlign: "center",
            outline: "none",
            color: "black",
          }}
          disabled={!openInputTag}
        />
        {openInputTag ? (
          <IconButton
            aria-label="save"
            onClick={() => {
              setOpenInputTag((prevState) => !prevState);
            }}
          >
            <SaveIcon />
          </IconButton>
        ) : (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => {
                setOpenInputTag((prevState) => !prevState);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => {
                //ask for delete
                const p = confirm("¿Seguro que desea eliminar la sección?");
                if (p === true) {
                  setCartelera((p) => {
                    let prevState = { ...p };
                    prevState.secciones = prevState.secciones.filter(
                      (item, i) => i !== index
                    );
                    return prevState;
                  });
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <input {...getInputProps()} />
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#ccc" : "#fff",
          }}
          {...getRootProps({ className: "dropzone" + item.index })}
        >
          <Typography>
            {isDragActive
              ? "Suelta los archivos aquí..."
              : "Arrastra los archivos aquí o haz click para seleccionarlos"}
          </Typography>
        </div>
        <Typography variant="h6">Archivos</Typography>
        {item.archivos.map((file, ifile) => {
          if (file.file) {
            return (
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  color: "indigo",
                }}
              >
                <Typography>{file.name}</Typography>
                <Button
                  color="error"
                  onClick={() => {
                    setCartelera((p) => {
                      let prevState = { ...p };
                      prevState.secciones[index].archivos = prevState.secciones[
                        index
                      ].archivos.filter((item, i) => i !== ifile);
                      return prevState;
                    });
                  }}
                >
                  Eliminar
                </Button>
              </li>
            );
          }
          return (
            <li
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography>{file.name} </Typography>
              <Button
                color="error"
                onClick={() => {
                  setCartelera((p) => {
                    let prevState = { ...p };
                    prevState.secciones[index].archivos = prevState.secciones[
                      index
                    ].archivos.filter((item, i) => i !== ifile);
                    return prevState;
                  });
                }}
              >
                Eliminar
              </Button>
            </li>
          );
        })}
        {loadingDoc ? (
          <div
            style={{
              width: "100%",
              height: "380px",
              border: "1px solid black",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
              backgroundColor: isDragActive ? "#ccc" : "#fff",
            }}
            {...getRootProps({ className: "dropzone" + item.index })}
          >
            <Typography>Cargando...</Typography>
          </div>
        ) : (
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            config={{
              header: {
                disableHeader: false,
                disableFileName: false,
                retainURLParams: true,
              },
              csvDelimiter: ",", // "," as default,
              pdfZoom: {
                defaultZoom: 0.3, // 1 as default,
                zoomJump: 0.1, // 0.1 as default,
              },
              pdfVerticalScrollByDefault: false, // false as default
            }}
            documents={
              item.archivos?.map((file) => {
                if (file.file) {
                  return {
                    uri: file.file.base64,
                    fileName: file.file.name,
                  };
                }
                if (file.fileType === "@file/pdf")
                  file.fileType = "application/pdf";
                return {
                  uri: env.API_URL + "api/v1/Files/getfile/" + file.id,
                  fileName: file.name,
                  fileType: file.fileType,
                };
              }) || []
            }
            style={{ height: "450px" }}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}


*/
import DocumentScanner from "react-native-document-scanner-plugin";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  Text,
  Divider,
  IconButton,
  List,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  calcTextColor,
  CCTPicker,
  RGBPicker,
} from "react-native-light-color-picker";
import * as ImagePicker from "expo-image-picker";
import * as IntentLauncher from "expo-intent-launcher";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useRef } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { alertError, alertSuccess } from "@Utils/alerts";
import * as Linking from "expo-linking";
import * as DocumentPicker from "expo-document-picker";
import SvgQRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { saveCartelera, deleteCartelera } from "@Services";
import { WebView } from "react-native-webview";
export default function Cartelera({ route }) {
  const navigation = useNavigation();
  const { cartelera, empresas } = route.params;
  const [newCartelera, setNewCartelera] = React.useState(cartelera);
  const [showQr, setShowQr] = useState(false);
  const [qrRef, setQrRef] = useState(null);
  const [visibleWebViewFile, setVisibleWebViewFile] = useState(false);
  const [fileWebViewUri, setFileWebViewUri] = useState("");
  const [visibleLoadingWebView, setVisibleLoadingWebView] = useState(false);
  const [isPdfWebView, setIsPdfWebView] = useState(false);
  const [visibleEmpresaSelector, setVisibleEmpresaSelector] =
    React.useState(false);
  const [visibleDeleteDialog, setVisibleDeleteDialog] = React.useState(false);
  const [isLoadingSaving, setIsLoadingSaving] = React.useState(false);
  const [visibleColorPicker, setVisibleColorPicker] = React.useState(false);
  const [visibleChangeNameTagDialog, setVisibleChangeNameTagDialog] =
    React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  const [tagSelected, setTagSelected] = React.useState(null);
  const [BorrarSegurityInput, setBorrarSegurityInput] = React.useState("");

  React.useEffect(() => {
    console.log("🚀 ~ cartelera", cartelera);
  }, []);
  const refViewShotQr = useRef();

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              //link
              color: "blue",
              textAlign: "center",
              fontSize: 16,
              textDecorationLine: "underline",
            }}
            onPress={() => {
              if (!cartelera._id) {
                alertError("Primero guarde la cartelera para poder verla");
                return;
              }

              Linking.openURL(
                "https://infomia.asociadosh2o.com/cartelera/" + cartelera._id
              );
            }}
          >
            Ver Cartelera
          </Text>
          <IconButton
            icon="share"
            onPress={() => {
              if (!cartelera._id) {
                alertError(
                  "Primero guarde la cartelera para poder compartirla"
                );
                return;
              }

              //share link
              Sharing.shareAsync(
                "https://infomia.asociadosh2o.com/cartelera/" + cartelera._id
              );
            }}
          />
        </View>

        <TextInput
          label="Descripción"
          value={newCartelera?.name}
          onChangeText={(text) => {
            setNewCartelera({ ...newCartelera, name: text });
          }}
        />
        <Button
          onPress={() => {
            setVisibleEmpresaSelector(true);
          }}
          mode="contained"
          style={{ marginTop: 10 }}
        >
          Cambiar Empresa {newCartelera?.empresa_data?.razonSocial}
        </Button>
        <Button
          onPress={() => {
            setVisibleColorPicker(true);
          }}
          mode="contained"
          style={{
            marginTop: 10,
            backgroundColor: newCartelera?.branding?.color,
            color: calcTextColor(newCartelera?.branding?.color || "#000400"),
          }}
        >
          Cambiar Color
        </Button>

        <Button
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              quality: 1,
              base64: true,
            });

            console.log(result);

            if (!result.canceled) {
              let base64 = result.assets[0].base64;
              setNewCartelera({
                ...newCartelera,
                branding: { logo: base64 },
              });
            }
          }}
          mode="contained"
          style={{ marginTop: 10 }}
        >
          Seleccionar Logo
        </Button>
        <Image
          source={{
            uri: "data:image/jpeg;base64," + newCartelera?.branding?.logo,
          }}
          style={{ width: "100%", height: 300 }}
          //fit
          resizeMode="contain"
        />
        <Divider />
        {/*files*/}
        <List.Section title="Secciones" style={{ marginTop: 10 }}>
          {newCartelera?.secciones.map((seccion) => (
            <List.Accordion
              left={(props) => (
                <>
                  <List.Icon {...props} icon="folder" />
                </>
              )}
              onLongPress={() => {
                //ask for delete with alert
                Alert.alert(
                  "Eliminar Sección",
                  "¿Seguro que desea eliminar la sección? se perderán los archivos",
                  [
                    {
                      text: "Cancelar",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Eliminar",
                      onPress: () => {
                        setNewCartelera({
                          ...newCartelera,
                          secciones: newCartelera.secciones.filter(
                            (item) => item.tag !== seccion.tag
                          ),
                        });
                      },
                    },
                  ]
                );
              }}
              right={(props) => (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="minus"
                      style={{
                        position: "absolute",
                        right: 50,
                        zIndex: 999,
                      }}
                    />
                    {props.isExpanded ? (
                      <IconButton icon="chevron-up" />
                    ) : (
                      <IconButton icon="chevron-down" />
                    )}
                  </View>
                </>
              )}
              title={seccion.tag}
              description={seccion.archivos.length + " archivos"}
            >
              {seccion?.archivos.map((archivo, index) => {
                return (
                  <View key={archivo.id}>
                    <List.Item
                      title={archivo.name}
                      description={archivo.file?.name}
                      onLongPress={() => {
                        //ask for delete with alert
                        Alert.alert(
                          "Eliminar Archivo",
                          "¿Seguro que desea eliminar el archivo?",
                          [
                            {
                              text: "No, Cancelar",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "Sí, Eliminar",
                              onPress: () => {
                                setNewCartelera({
                                  ...newCartelera,
                                  secciones: newCartelera.secciones.map(
                                    (item, i) => {
                                      if (item.tag === seccion.tag) {
                                        return {
                                          ...item,
                                          archivos: item.archivos.filter(
                                            (item) => item.id !== archivo.id
                                          ),
                                        };
                                      }
                                      return item;
                                    }
                                  ),
                                });
                              },
                            },
                          ]
                        );
                      }}
                      onPress={() => {
                        //view doc ;"https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" + archivo.id
                        //open file
                        if (archivo?.file?.base64) {
                          console.log(
                            "🚀 ~ {seccion?.archivos.map ~ archivo:",
                            archivo.file
                          );
                          setVisibleLoadingWebView(true);
                          alertError(
                            "Por favor, guarde la cartelera para poder visualizar archivos PDF"
                          );
                          return;

                          //open file
                          if (Platform.OS === "ios") {
                            Linking.openURL(archivo?.file?.base64);
                          } else {
                            //save temp file
                            //erase header to base64 PDF , JPG , PNG
                            let base64 = archivo.file.base64.replace(
                              /^data:application\/pdf;base64,/,
                              ""
                            );
                            base64 = base64.replace(
                              /^data:image\/png;base64,/,
                              ""
                            );
                            base64 = base64.replace(
                              /^data:image\/jpg;base64,/,
                              ""
                            );

                            FileSystem.writeAsStringAsync(
                              FileSystem.documentDirectory + archivo.name,
                              base64,
                              {
                                encoding: FileSystem.EncodingType.Base64,
                              }
                            ).then(async (data) => {
                              console.log("🚀 ~ ).then ~ data:", data);
                              let file =
                                FileSystem.documentDirectory + archivo.name;

                              //replace file:// with content://
                              file = file.replace("file://", "content://");
                              IntentLauncher.startActivityAsync(
                                "android.intent.action.VIEW",
                                {
                                  data: file,
                                  flags: 1,
                                  type: archivo.fileType,
                                }
                              ).catch((error) => {
                                console.log(error);
                                alertError(
                                  error.message,
                                  "Error al abrir archivo"
                                );
                              });
                            });
                          }
                          return;
                        }
                        console.log(
                          "https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" +
                            archivo.id
                        );
                        setVisibleLoadingWebView(true);
                        if (
                          archivo.fileType === "application/pdf" &&
                          Platform.OS === "android"
                        ) {
                          console.log("is pdf ANDROID");
                          setFileWebViewUri(
                            "https://docs.google.com/viewer?url=https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" +
                              archivo.id
                          );
                        } else {
                          setFileWebViewUri(
                            "https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" +
                              archivo.id
                          );
                        }
                        setVisibleWebViewFile(true);
                        return;
                        FileSystem.downloadAsync(
                          "https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" +
                            archivo.id,
                          FileSystem.documentDirectory + archivo.name
                        )
                          .then(async (data) => {
                            console.log("🚀 ~ .then ~ data:", data);

                            let uri = data.uri;
                            console.log("Finished downloading to ", uri);
                            //open file
                            if (Platform.OS === "ios") {
                              Sharing.shareAsync(uri, {
                                UTI: "public.data",
                                mimeType: archivo.fileType,
                              });
                              Linking.openURL(
                                "https://api.infomia.asociadosh2o.com/api/v1/Files/getfile/" +
                                  archivo.id
                              );
                            } else {
                              await IntentLauncher.startActivityAsync(
                                "android.intent.action.VIEW",
                                {
                                  data: uri.replace("file://", "content://"),
                                  flags: 1,
                                  type: archivo.fileType,
                                }
                              );
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                            alertError(
                              error.message,
                              "Error al descargar archivo"
                            );
                          });
                      }}
                      left={(props) => (
                        <>
                          <List.Icon {...props} icon="file" />
                        </>
                      )}
                    />
                  </View>
                );
              })}
              <ScrollView
                horizontal
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <Button
                  //cambiar nombre
                  mode="outlined"
                  style={{ marginTop: 10, marginRight: 10 }}
                  icon="pencil"
                  onPress={() => {
                    setTagSelected(seccion);
                    setNewTag(seccion.tag);
                    setVisibleChangeNameTagDialog(true);
                  }}
                >
                  Cambiar Nombre
                </Button>

                <Button
                  //tomar foto
                  onPress={async () => {
                    //request camera permission
                    const { status } =
                      await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== "granted") {
                      alertError(
                        "Se requiere permiso de cámara",
                        "Error al tomar foto"
                      );
                      return;
                    }

                    let result = await ImagePicker.launchCameraAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.All,
                      allowsEditing: true,
                      quality: 1,
                      legacy: true,
                      base64: true,
                    });
                    result = result.assets[0];

                    if (!result.canceled) {
                      if (!result?.fileName) {
                        //generate file name
                        result.fileName =
                          "IMG_" + new Date().getTime() + ".jpeg";
                      }
                      // show result.base64 but only 100 characters
                      console.log(
                        "🚀 ~ file: Cartelera.js ~ line 186 ~ onPress={ ~ result.base64",
                        result.base64.substring(0, 100)
                      );
                      setNewCartelera({
                        ...newCartelera,
                        secciones: newCartelera.secciones.map((item) => {
                          if (item.tag === seccion.tag) {
                            item.archivos.push({
                              name: result.fileName,
                              file: {
                                base64:
                                  "data:image/jpeg;base64," + result.base64,
                                name: result.fileName,
                                fileType: "image/jpeg",
                              },
                            });
                          }
                          return item;
                        }),
                      });
                    }
                  }}
                  mode="outlined"
                  style={{ marginTop: 10, marginRight: 10 }}
                  icon="camera"
                >
                  Tomar Foto
                </Button>
                <Button
                  onPress={() => {
                    // only pdf and images
                    //check storage permissions

                    DocumentPicker.getDocumentAsync({
                      type: "application/pdf",
                      copyToCacheDirectory: true,
                    })
                      .then((file) => {
                        console.log(file);
                        file = file.assets[0];
                        //get file base64
                        FileSystem.readAsStringAsync(file.uri, {
                          encoding: FileSystem.EncodingType.Base64,
                        })
                          .then((base64) => {
                            console.log("🚀 ~ .then ~ base64:", base64);
                            setNewCartelera({
                              ...newCartelera,
                              secciones: newCartelera.secciones.map((item) => {
                                if (item.tag === seccion.tag) {
                                  item.archivos.push({
                                    name: file.name,
                                    file: {
                                      base64:
                                        "data:application/pdf;base64," + base64,
                                      name: file.name,
                                      fileType: "application/pdf",
                                    },
                                  });
                                }
                                return item;
                              }),
                            });
                          })
                          .catch((error) => {
                            alertError(
                              error.message,
                              "Error al cargar archivo"
                            );
                          });
                      })
                      .catch((error) => {
                        alertError(error.message, "Error al cargar archivo");
                      });
                  }}
                  icon="file"
                  mode="outlined"
                  style={{ marginTop: 10, marginRight: 10 }}
                >
                  Agregar Archivo
                </Button>
                <Button
                  onPress={() => {
                    // only  images
                    ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.All,
                      allowsEditing: true,
                      quality: 1,
                    })
                      .then((result) => {
                        console.log(result);
                        if (!result.canceled) {
                          setNewCartelera({
                            ...newCartelera,
                            secciones: newCartelera.secciones.map((item) => {
                              if (item.tag === seccion.tag) {
                                item.archivos.push({
                                  name: result.uri,
                                  file: {
                                    base64: result.base64,
                                    name: result.uri,
                                  },
                                });
                              }
                              return item;
                            }),
                          });
                        }
                      })
                      .catch((error) => {
                        alertError(error.message, "Error al cargar archivo");
                      });
                  }}
                  mode="outlined"
                  style={{ marginTop: 10, marginRight: 10 }}
                  icon="image"
                >
                  Agregar Imagen
                </Button>
              </ScrollView>
            </List.Accordion>
          ))}
        </List.Section>
        <Text
          style={{
            textAlign: "center",
            fontSize: 9,
            marginTop: 5,
            color: "gray",
          }}
        >
          Mantenga presionado las secciones o archivos para eliminar
        </Text>

        <Button
          onPress={() => {
            setNewCartelera({
              ...newCartelera,
              secciones: [
                ...newCartelera.secciones,
                {
                  tag: "nueva sección #" + newCartelera.secciones.length,
                  archivos: [],
                },
              ],
            });
          }}
          mode="contained"
          icon="plus"
          style={{ margin: 10 }}
        >
          Agregar Sección
        </Button>
        <Divider />
        <Button
          onPress={() => {
            if (!cartelera._id) {
              alertError("No se puede generar QR sin guardar", "Error");
              return;
            }
            setShowQr(!showQr);
          }}
          mode="contained"
          style={{ margin: 10 }}
          icon="qrcode"
        >
          Generar QR
        </Button>
        {showQr && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <ViewShot
              ref={refViewShotQr}
              options={{ format: "jpg", quality: 1 }}
            >
              <SvgQRCode
                value={
                  "https://infomia.asociadosh2o.com/cartelera/" + cartelera._id
                }
                logo={require("@Assets/H2O.png")}
                size={200}
                color="black"
                logoSize={30}
                backgroundColor="white"
              />
            </ViewShot>
            <Button
              mode="elevated"
              icon="share"
              onPress={async () => {
                //share qr
                const uri = await refViewShotQr.current.capture();
                Sharing.shareAsync(uri);
              }}
            >
              Compartir QR
            </Button>
          </View>
        )}
        <Divider
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <Button
          onPress={() => {
            //save cartelera
            console.log("🚀 ~ newCartelera", newCartelera);
            //api/v1/Carteleras/save
            setIsLoadingSaving(true);
            //validarte if empresa is selected
            if (!newCartelera.empresa) {
              alertError("Seleccione una empresa", "Error al guardar");
              setIsLoadingSaving(false);
              return;
            }
            if (!newCartelera.branding?.logo) {
              alertError("Seleccione un logo", "Error al guardar");
              setIsLoadingSaving(false);
              return;
            }
            saveCartelera(newCartelera).then((res) => {
              setIsLoadingSaving(false);
              alertSuccess("Guardado con exito", "Cartelera");
              navigation.goBack();
            });
          }}
          mode="contained"
          icon="content-save"
          style={{ margin: 10, backgroundColor: "#006e10" }}
        >
          Guardar
        </Button>
        {newCartelera._id && (
          <Button
            icon="trash-can"
            mode="contained"
            style={{ margin: 10, backgroundColor: "#ff0000" }}
            onPress={() => {
              //delete cartelera
              Alert.alert(
                "Eliminar Cartelera",
                "¿Seguro que desea eliminar la cartelera?",
                [
                  {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Eliminar",
                    onPress: () => {
                      //delete cartelera
                      setVisibleDeleteDialog(true);
                    },
                  },
                ]
              );
            }}
          >
            Eliminar
          </Button>
        )}
      </ScrollView>
      <Portal>
        <Dialog
          visible={visibleEmpresaSelector}
          onDismiss={() => setVisibleEmpresaSelector(false)}
        >
          <Dialog.Title>Seleccionar Empresa</Dialog.Title>
          <Dialog.Content>
            <Picker
              selectedValue={newCartelera.empresa}
              onValueChange={(itemValue, itemIndex) => {
                setNewCartelera({
                  ...newCartelera,
                  empresa: itemValue,
                  empresa_data: empresas.find(
                    (empresa) => empresa._id === itemValue
                  ),
                });
              }}
            >
              {empresas.map((empresa) => {
                return (
                  <Picker.Item
                    key={empresa._id}
                    label={empresa.razonSocial}
                    value={empresa._id}
                  />
                );
              })}
            </Picker>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Modal
        visible={visibleColorPicker}
        onDismiss={() => setVisibleColorPicker(false)}
      >
        <View style={{ flex: 1, marginTop: 22 }}>
          <Dialog.Title>Seleccionar Color</Dialog.Title>

          <RGBPicker
            value={newCartelera?.branding?.color}
            onChangeComplete={console.log}
            onChange={(color) => {
              setNewCartelera({
                ...newCartelera,
                branding: {
                  ...newCartelera.branding,
                  color: color,
                },
              });
            }}
          />
          <Dialog.Actions>
            <Button onPress={() => setVisibleColorPicker(false)}>Cerrar</Button>
          </Dialog.Actions>
        </View>
      </Modal>
      <Modal
        visible={visibleWebViewFile}
        onDismiss={() => {
          setVisibleWebViewFile(false);
          setFileWebViewUri("");
          setIsPdfWebView(false);
          setVisibleLoadingWebView(true);
        }}
      >
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 30 : 22,
            //to right
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            icon="download"
            onPress={() => {
              //download file
              FileSystem.downloadAsync(
                fileWebViewUri,

                FileSystem.documentDirectory + "file" + ".jpg"
              )
                .then((data) => {
                  console.log("🚀 ~ .then ~ data", data);
                  Sharing.shareAsync(data.uri);
                })
                .catch((error) => {
                  alertError(error.message, "Error al descargar archivo");
                });
            }}
            style={{}}
          />
          <IconButton
            icon="close"
            onPress={() => {
              setVisibleWebViewFile(false);
              setFileWebViewUri("");
              setIsPdfWebView(false);
              setVisibleLoadingWebView(true);
            }}
            style={{}}
          />
        </View>
        <WebView
          source={{
            uri: fileWebViewUri,
          }}
          //loading
          onLoad={() => {
            setVisibleLoadingWebView(false);
          }}
          style={{
            marginTop: Platform === "ios" ? 0 : 0,
            height: 200,
          }}
        />
        <View
          style={{
            position: "absolute",
            //middle of screen
            top: Dimensions.get("window").height / 2 - 50,
            left: Dimensions.get("window").width / 2 - 50,
          }}
        >
          <ActivityIndicator
            animating={visibleLoadingWebView}
            color="#000"
            size="large"
          />
        </View>
      </Modal>
      <Modal
        visible={visibleDeleteDialog}
        onDismiss={() => setVisibleDeleteDialog(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            ¿Seguro que desea eliminar la cartelera de la empresa:{" "}
            {cartelera?.empresa_data?.razonSocial}
          </Text>
          <TextInput
            label="Escriba la razón social para confirmar"
            onChangeText={(text) => {
              setBorrarSegurityInput(text);
            }}
          />
          <Button
            onPress={() => {
              if (
                BorrarSegurityInput === cartelera?.empresa_data?.razonSocial
              ) {
                setIsLoadingSaving(true);
                deleteCartelera(cartelera).then((res) => {
                  setIsLoadingSaving(false);
                  alertSuccess("Eliminado con exito", "Cartelera");
                  navigation.goBack();
                });
              } else {
                alertError(
                  "La razón social no coincide",
                  "Error al eliminar cartelera"
                );
                setVisibleDeleteDialog(false);
              }
            }}
            style={{ marginTop: 10, backgroundColor: "red", color: "white" }}
            mode="contained"
          >
            CONFIRMAR
          </Button>
          <Button onPress={() => setVisibleDeleteDialog(false)}>
            Cancelar
          </Button>
        </View>
      </Modal>
      <Dialog
        visible={visibleChangeNameTagDialog}
        onDismiss={() => setVisibleChangeNameTagDialog(false)}
      >
        <Dialog.Title>Cambiar Nombre de Sección</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nombre"
            value={newTag}
            onChangeText={(text) => {
              setNewTag(text);
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisibleChangeNameTagDialog(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            onPress={() => {
              setNewCartelera({
                ...newCartelera,
                secciones: newCartelera.secciones.map((item) => {
                  if (item.tag === tagSelected.tag) {
                    item.tag = newTag;
                  }
                  return item;
                }),
              });
              setVisibleChangeNameTagDialog(false);
            }}
          >
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          justifyContent: "center",
          alignItems: "center",
          display: isLoadingSaving ? "flex" : "none",
        }}
      >
        <ActivityIndicator animating={true} color="#fff" size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
});
