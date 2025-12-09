// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqwYsEPlbITomMRrxwBEWiJaVeQA99654",
  authDomain: "mini-catalogo-e3017.firebaseapp.com",
  projectId: "mini-catalogo-e3017",
  storageBucket: "mini-catalogo-e3017.firebasestorage.app",
  messagingSenderId: "630663981518",
  appId: "1:630663981518:web:7c2f7e1fdc35728882a39f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); // Exportar storage
