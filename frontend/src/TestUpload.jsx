import { useState } from "react";
import { uploadImageFile } from "../utils/uploadImage";
import axios from "axios";

export default function TestUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const url = await uploadImageFile(file);
    alert("Imagen subida!\nURL:\n" + url);

    // Ejemplo: enviar al backend de Laravel
    const res = await axios.post("http://localhost:8000/api/products", {
      name: "Producto Prueba",
      description: "Subido desde React",
      price: 9.99,
      image_url: url
    });

    console.log(res.data);
    alert("Producto creado en Laravel!");
  };

  return (
    <div>
      <h1>Test Upload</h1>

      <input type="file" onChange={e => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>
        Subir y Crear Producto
      </button>
    </div>
  );
}
