/* ===============================
     IMPORT FIREBASE
================================ */
import { storage } from './firebaseConfig.js';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } 
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

/* ===============================
     CONFIG BACKEND
================================ */
const API_URL = "http://127.0.0.1:8000/api";

/* ===============================
     LOGIN
================================ */
export async function loginUser() {
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-pass");
    if (!emailEl || !passEl) return alert("Faltan campos de login");

    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    if (!email || !password) { alert("Complete todos los campos"); return; }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) { alert(data.message || "Credenciales incorrectas"); return; }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        if (data.user.role === "admin") window.location.href = "admin.html";
        else window.location.href = "operario.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
}

/* ===============================
     REGISTRO
================================ */
export async function registerUser() {
    const nameEl = document.getElementById("reg-name");
    const emailEl = document.getElementById("reg-email");
    const passEl = document.getElementById("reg-pass");
    const roleEl = document.getElementById("reg-role");

    if (!nameEl || !emailEl || !passEl || !roleEl) return alert("Faltan campos de registro");

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    const role = roleEl.value;

    if (!name || !email || !password || !role) { alert("Complete todos los campos"); return; }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();
        if (!res.ok) { alert(data.message || "Error al registrar"); return; }

        alert("Usuario registrado. Ahora inicia sesión.");
        document.getElementById("register-form").classList.add("hidden");
        document.getElementById("login-form").classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert("No se pudo registrar");
    }
}

/* ===============================
     LOGOUT
================================ */
export function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

/* ===============================
     CARGAR PRODUCTOS
================================ */
async function cargarProductos(filtro = "", esAdmin = false) {
    const cont = document.getElementById("lista-productos");
    if (!cont) return;

    const token = localStorage.getItem("token");
    if (!token) { cont.innerHTML = "Debe iniciar sesión"; return; }

    try {
        const res = await fetch(`${API_URL}/products`, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = await res.json();
        cont.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            cont.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        data
          .filter(prod => prod.name?.toLowerCase().includes(filtro.toLowerCase()))
          .forEach(prod => {
            const div = document.createElement("div");
            div.className = "card flex flex-col items-center p-4 rounded-lg shadow-lg bg-gray-900 border-2 border-green-500";

            const imgSrc = prod.image_url;

            div.innerHTML = `
                <img src="${imgSrc}" class="w-full h-48 object-cover rounded mb-2 border-2 border-yellow-400">
                <h3 class="font-bold text-green-400 text-lg">${prod.name}</h3>
                <p class="text-gray-300">${prod.description}</p>
                <p class="font-semibold mt-1 text-yellow-400">$${prod.price}</p>
            `;

            if (esAdmin) {
                const botonesDiv = document.createElement("div");
                botonesDiv.className = "mt-2 flex gap-2";

                const btnEditar = document.createElement("button");
                btnEditar.className = "bg-blue-500 px-3 py-1 rounded hover:bg-blue-600";
                btnEditar.textContent = "Editar";
                btnEditar.addEventListener("click", () => editarProducto(prod));

                const btnEliminar = document.createElement("button");
                btnEliminar.className = "bg-red-500 px-3 py-1 rounded hover:bg-red-600";
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener("click", () => eliminarProducto(prod.id));

                botonesDiv.appendChild(btnEditar);
                botonesDiv.appendChild(btnEliminar);
                div.appendChild(botonesDiv);
            }

            if (!esAdmin) {
                const botonesDiv = document.createElement("div");
                botonesDiv.className = "mt-2 flex gap-2";

                const btnComentar = document.createElement("button");
                btnComentar.className = "bg-blue-500 px-3 py-1 rounded hover:bg-blue-600";
                btnComentar.textContent = "Comentar";
                btnComentar.addEventListener("click", () => {
                    const comentario = prompt("Escribe tu comentario (máx. 200 caracteres):");
                    if (!comentario) return;
                    if (comentario.length > 200) return alert("Máx. 200 caracteres");
                    agregarComentario(prod.id, comentario);
                });

                const btnFavorito = document.createElement("button");
                btnFavorito.className = "bg-pink-500 px-3 py-1 rounded hover:bg-pink-600";
                btnFavorito.textContent = "Favorito";
                btnFavorito.addEventListener("click", () => toggleFavorito(prod.id));

                botonesDiv.appendChild(btnComentar);
                botonesDiv.appendChild(btnFavorito);
                div.appendChild(botonesDiv);
            }

            cont.appendChild(div);
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
        cont.innerHTML = "Error cargando productos";
    }
}

/* ===============================
     FUNCIONES PÚBLICAS
================================ */
export const cargarProductosAdmin = (filtro="") => cargarProductos(filtro, true);
export const cargarProductosOperario = (filtro="") => cargarProductos(filtro, false);

/* ===============================
     AGREGAR PRODUCTO (ADMIN)
================================ */
export async function agregarProductoAdmin() {
    const name = document.getElementById("prod-nombre").value.trim();
    const description = document.getElementById("prod-descripcion").value.trim();
    const price = document.getElementById("prod-precio").value.trim();
    const imageFile = document.getElementById("prod-img").files[0];

    if (!name || !description || !price || !imageFile) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const imgRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(imgRef, imageFile);

        uploadTask.on('state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Subida ${progress.toFixed(2)}% completada`);
            },
            error => {
                console.error("Error subiendo imagen:", error);
                alert("Error subiendo la imagen");
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price: parseFloat(price),
                        img_url: downloadURL // <- coincidir con ProductController
                    })
                });

                const data = await res.json();
                if (!res.ok) {
                    console.error("Error guardando producto:", data);
                    alert(data.message || "Error guardando producto en la base de datos");
                    return;
                }

                alert("Producto agregado correctamente");
                cargarProductosAdmin();
            }
        );

    } catch (error) {
        console.error("Error general:", error);
        alert("Error al agregar producto");
    }
}

/* ===============================
     EDITAR PRODUCTO (ADMIN)
================================ */
export async function editarProducto(producto) {
    const nuevoNombre = prompt("Nombre:", producto.name);
    const nuevaDescripcion = prompt("Descripción:", producto.description);
    const nuevoPrecio = prompt("Precio:", producto.price);

    if (!nuevoNombre || !nuevaDescripcion || !nuevoPrecio) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/products/${producto.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: nuevoNombre,
                description: nuevaDescripcion,
                price: parseFloat(nuevoPrecio),
                image_url: producto.image_url
            })
        });

        if (!res.ok) throw "Error actualizando producto";
        alert("Producto actualizado correctamente");
        cargarProductosAdmin();
    } catch (e) {
        console.error(e);
        alert(e);
    }
}

/* ===============================
     ELIMINAR PRODUCTO (ADMIN)
================================ */
export async function eliminarProducto(productId) {
    const token = localStorage.getItem("token");
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw "Error eliminando producto";
        alert("Producto eliminado correctamente");
        cargarProductosAdmin();
    } catch (e) {
        console.error(e);
        alert(e);
    }
}

/* ===============================
     COMENTARIOS
================================ */
export async function agregarComentario(product_id, content) {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/products/${product_id}/comments`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ comment: content }) // <- cambio importante
        });
        if(!res.ok) throw "Error agregando comentario";
        alert("Comentario agregado");
    } catch(e){
        console.error(e);
        alert(e);
    }
}

/* ===============================
     FAVORITOS
================================ */
export async function toggleFavorito(product_id) {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/products/${product_id}/favorito`, {
            method:"POST",
            headers:{
                "Authorization": `Bearer ${token}`,
                "Accept":"application/json"
            }
        });
        if(!res.ok) throw "Error cambiando favorito";
        alert("Producto actualizado en favoritos");
    } catch(e){ console.error(e); alert(e);}
}
/* ===============================
     API EXTERNA: FRASES MOTIVACIONALES
================================ */
export async function mostrarFraseMotivacional() {
    const cont = document.getElementById("api-info"); // Div donde se mostrará la frase
    if (!cont) return;

    try {
        // Usamos un proxy para evitar problemas de CORS
        const url = encodeURIComponent("https://type.fit/api/quotes");
        const res = await fetch(`https://api.allorigins.win/get?url=${url}`);
        const data = await res.json();
        const quotes = JSON.parse(data.contents);
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        cont.textContent = `"${random.text}" — ${random.author || "Desconocido"}`;
    } catch (error) {
        console.error("Error API externa:", error);
        cont.textContent = "No se pudo cargar la frase.";
    }
}

// Llamar la función al cargar la página
document.addEventListener("DOMContentLoaded", mostrarFraseMotivacional);

