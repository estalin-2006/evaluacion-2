import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseConfig from "../firebaseConfig";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Función para subir un archivo
export const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log("Archivo subido exitosamente:", url);
    return url;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
};

// Ejemplo de uso
// const fileInput = document.querySelector("#fileInput");
// fileInput.addEventListener("change", async (event) => {
//   const file = event.target.files[0];
//   const url = await uploadFile(file);
//   console.log("URL del archivo subido:", url);
// });