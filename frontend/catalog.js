// ======== Productos ========
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8000/api/products');
    if (!response.ok) {
      const productList = document.getElementById('product-list');
      if (productList) {
        productList.innerHTML = '<div style="color:red;text-align:center;">Error al cargar productos. Verifica tu sesión o permisos.</div>';
      }
      return;
    }
    const products = await response.json();
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = '';
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product-card';
      productDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
      `;
      productList.appendChild(productDiv);
    });
  } catch (error) {
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.innerHTML = '<div style="color:red;text-align:center;">Error inesperado al cargar productos.</div>';
    }
    console.error('Error al cargar los productos:', error);
  }
}

if (document.getElementById('catalog-container')) {
  // fetchProducts(); // Eliminado para evitar duplicidad de llamadas
}
// ======== Productos ========
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8000/api/products');
    const products = await response.json();

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'border p-2 rounded cursor-pointer';

      productDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" class="h-40 w-full object-cover" />
        <h2 class="font-bold">${product.name}</h2>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
      `;

      productDiv.appendChild(renderAdminControls(product));
      productList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}

function showProductDetail(product) {
  document.getElementById('product-list').style.display = 'none';
  const productDetail = document.getElementById('product-detail');
  productDetail.style.display = 'block';

  document.getElementById('detail-content').innerHTML = `
    <img src="${product.image_url}" alt="${product.name}" class="h-60 w-full object-cover mb-4" />
    <h2 class="text-2xl font-bold mb-2">${product.name}</h2>
    <p class="mb-2">${product.description}</p>
    <p class="text-lg font-semibold mb-4">Precio: ${product.price}</p>
    <p><strong>ID:</strong> ${product.id}</p>
    <p><strong>Creado:</strong> ${new Date(product.created_at).toLocaleDateString()}</p>
    <p><strong>Actualizado:</strong> ${new Date(product.updated_at).toLocaleDateString()}</p>

    <button id="favorite-button" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">Añadir a Favoritos</button>
    <div id="comments-section">
      <h3 class="text-xl font-bold mb-2">Comentarios</h3>
      <form id="comment-form" class="mb-4">
        <textarea id="comment-text" class="border p-2 w-full mb-2" maxlength="200" placeholder="Escribe un comentario..." required></textarea>
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Enviar</button>
      </form>
      <div id="comments-list"></div>
    </div>
  `;


  const favBtn = document.getElementById('favorite-button');
  if (favBtn) {
    favBtn.addEventListener('click', () => toggleFavorite(product.id, false));
  }


  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const commentText = document.getElementById('comment-text').value;
      addComment(product.id, commentText);
      commentForm.reset();
    });
  }

  fetchProductComments(product.id);
}


const backBtn = document.getElementById('back-to-list');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    document.getElementById('product-detail').style.display = 'none';
    document.getElementById('product-list').style.display = 'grid';
  });
}

// ======== Clima ========
async function fetchWeather() {
  try {
    const response = await fetch('http://localhost:8000/api/weather?lat=0&lon=0');
    const weather = await response.json();
    document.getElementById('weather-info').innerHTML = `
      <p>Temperatura: ${weather.current.temp}°C</p>
      <p>Clima: ${weather.current.weather[0].description}</p>
    `;
  } catch (error) {
    console.error('Error al cargar el clima:', error);
  }
}

// ======== Imagen perro ========
async function fetchDogImage() {
  try {
    const response = await fetch('http://localhost:8000/api/external/dog-image');
    const data = await response.json();
    document.getElementById('dog-image-container').innerHTML = `
      <img src="${data.message}" alt="Imagen de un perro" style="max-width: 100%; border-radius: 8px;" />
    `;
  } catch (error) {
    console.error('Error al cargar la imagen del perro:', error);
  }
}

// Elimina las llamadas automáticas al cargar la página
// fetchProducts();
// fetchWeather();
// fetchDogImage();

// Agrega un botón para cargar productos manualmente en el HTML:
// <button id="btn-cargar-productos">Cargar productos</button>

// Y el event listener:
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('btn-cargar-productos');
  if (btn) {
    btn.addEventListener('click', fetchProducts);
  }
});

// ======== Gestión de Productos ========
async function createProduct(productData) {
  try {
    const response = await fetch('http://localhost:8000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }
    alert('Producto creado exitosamente');
    fetchProducts();
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
}

async function editProduct(productId, productData) {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Error al editar el producto');
    }
    alert('Producto editado exitosamente');
    fetchProducts();
  } catch (error) {
    console.error('Error al editar el producto:', error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
    alert('Producto eliminado exitosamente');
    fetchProducts();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.imageUrl; // URL generada por Firebase
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
}

// Formulario para crear/editar productos
function showProductForm(product = null) {
  const formContainer = document.createElement('div');
  formContainer.className = 'bg-white p-4 rounded shadow';

  formContainer.innerHTML = `
    <form id="product-form">
      <label class="block mb-2">Nombre:</label>
      <input type="text" id="product-name" class="border p-2 w-full mb-4" value="${product ? product.name : ''}" required />

      <label class="block mb-2">Descripción:</label>
      <textarea id="product-description" class="border p-2 w-full mb-4" required>${product ? product.description : ''}</textarea>

      <label class="block mb-2">Precio:</label>
      <input type="number" id="product-price" class="border p-2 w-full mb-4" value="${product ? product.price : ''}" required />

      <label class="block mb-2">Imagen:</label>
      <input type="file" id="product-image" class="border p-2 w-full mb-4" ${product ? '' : 'required'} />

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">${product ? 'Editar' : 'Crear'} Producto</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  const form = document.getElementById('product-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const imageFile = document.getElementById('product-image').files[0];

    let imageUrl = product ? product.image_url : null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const productData = { name, description, price, image_url: imageUrl };

    if (product) {
      editProduct(product.id, productData);
    } else {
      createProduct(productData);
    }

    formContainer.remove();
  });
}

// Mostrar botones de edición y eliminación solo para el administrador
function renderAdminControls(product) {
  const controls = document.createElement('div');
  controls.className = 'flex space-x-2 mt-2';

  const editButton = document.createElement('button');
  editButton.className = 'bg-yellow-500 text-white px-4 py-2 rounded';
  editButton.textContent = 'Editar';
  editButton.addEventListener('click', () => showProductForm(product));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'bg-red-500 text-white px-4 py-2 rounded';
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => deleteProduct(product.id));

  controls.appendChild(editButton);
  controls.appendChild(deleteButton);

  return controls;
}

// ======== Autenticación ========
async function registerUser(userData) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    alert('Usuario registrado exitosamente');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
  }
}

async function loginUser(credentials) {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token); // Guardar el token en localStorage
    alert('Inicio de sesión exitoso');

    // Mostrar catálogo o CRUD en index.html según el rol
    // Aquí puedes llamar funciones para mostrar la interfaz en index.html
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
}

async function logoutUser() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    localStorage.removeItem('authToken'); // Eliminar el token de localStorage
    alert('Cierre de sesión exitoso');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Formulario de registro
function showRegisterForm() {
  const formContainer = document.createElement('div');
  formContainer.className = 'bg-white p-4 rounded shadow';

  formContainer.innerHTML = `
    <form id="register-form">
      <label class="block mb-2">Nombre:</label>
      <input type="text" id="register-name" class="border p-2 w-full mb-4" required />

      <label class="block mb-2">Email:</label>
      <input type="email" id="register-email" class="border p-2 w-full mb-4" required />

      <label class="block mb-2">Contraseña:</label>
      <input type="password" id="register-password" class="border p-2 w-full mb-4" required />

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const userData = { name, email, password };
    await registerUser(userData);
    formContainer.remove();
  });
}

// Formulario de inicio de sesión
function showLoginForm() {
  const formContainer = document.createElement('div');
  formContainer.className = 'bg-white p-4 rounded shadow';

  formContainer.innerHTML = `
    <form id="login-form">
      <label class="block mb-2">Email:</label>
      <input type="email" id="login-email" class="border p-2 w-full mb-4" required />

      <label class="block mb-2">Contraseña:</label>
      <input type="password" id="login-password" class="border p-2 w-full mb-4" required />

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Iniciar Sesión</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const credentials = { email, password };
    await loginUser(credentials);
    formContainer.remove();
  });
}

// ======== Ventana externa para login ========
// Eliminada la lógica de ventanas externas. Todo se muestra en index.html.

// ======== Control de acceso basado en roles ========
async function checkUserRole() {
  try {
    // Si ya tenemos el rol y el token en localStorage, lo usamos
    const cachedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    if (cachedRole && token) return cachedRole;
    // Desactivado: no hacer llamada automática a /api/user
    // Si necesitas el rol, solicita manualmente con un botón o acción explícita
    return null;
  } catch (error) {
    console.error('Error al verificar el rol del usuario:', error);
    return null;
  }
}

async function initializeApp() {
  // Solo ejecuta checkUserRole una vez al cargar la app
  // Obtener el rol del usuario (solo una vez por sesión)
  const userRole = await checkUserRole();

  if (!userRole || !localStorage.getItem('authToken')) {
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) loginContainer.style.display = 'block';
    // Solo limpiar datos si realmente no hay sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    return;
  }

  if (userRole === 'admin' || userRole === 'user') {
    // Mostrar el contenedor del catálogo y ocultar el login
    const catalogContainer = document.getElementById('catalog-container');
    const loginContainer = document.querySelector('.login-container');
    if (catalogContainer) catalogContainer.style.display = 'block';
    if (loginContainer) loginContainer.style.display = 'none';
    // No actualizar productos ni clima automáticamente
    // Solo se actualizarán cuando el usuario lo solicite
  }
// ======== API Externa: Clima ========
async function mostrarClima() {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Error al iniciar sesión');
    }

    const data = await response.json();
    if (data.success && data.token && data.role) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);
      // Mostrar catálogo y ocultar login sin recargar ni reconstruir el body
      const catalogContainer = document.getElementById('catalog-container');
      const loginContainer = document.querySelector('.login-container');
      if (catalogContainer) catalogContainer.style.display = 'block';
      if (loginContainer) loginContainer.style.display = 'none';
      // Solo actualiza productos y clima, no el contenedor principal
      // No actualizar productos ni clima automáticamente
      // Solo se actualizarán cuando el usuario lo solicite
    } else {
      throw new Error('Credenciales inválidas o respuesta incompleta');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8000/api/favorites/${productId}`, {
      method: isFavorite ? 'DELETE' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al actualizar favoritos');
    }

    alert(isFavorite ? 'Producto eliminado de favoritos' : 'Producto añadido a favoritos');
    fetchFavorites();
  } catch (error) {
    console.error('Error al actualizar favoritos:', error);
  }
}

async function fetchFavorites() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8000/api/favorites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cargar favoritos');
    }

    const favorites = await response.json();
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favorites.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'border p-2 rounded';

      productDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" class="h-40 w-full object-cover" />
        <h2 class="font-bold">${product.name}</h2>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
        <button class="bg-red-500 text-white px-4 py-2 rounded">Eliminar de Favoritos</button>
      `;

      productDiv.querySelector('button').addEventListener('click', () => toggleFavorite(product.id, true));
      favoritesList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error al cargar favoritos:', error);
  }
}

// ======== Comentarios ========
async function addComment(productId, comment) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8000/api/products/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      throw new Error('Error al añadir comentario');
    }

    alert('Comentario añadido exitosamente');
    fetchProductComments(productId);
  } catch (error) {
    console.error('Error al añadir comentario:', error);
  }
}

async function fetchProductComments(productId) {
  try {
    const response = await fetch(`http://localhost:8000/api/products/${productId}/comments`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al cargar comentarios');
    }

    const comments = await response.json();
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'border p-2 rounded mb-2';

      commentDiv.innerHTML = `
        <p>${comment.user_name}: ${comment.comment}</p>
      `;

      commentsList.appendChild(commentDiv);
    });
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
  }
}

// Función para mostrar catálogo de productos para usuario logueado
async function mostrarCatalogoUsuario() {
  const token = localStorage.getItem('authToken');
  const res = await fetch('http://localhost:8000/api/products', {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const productos = await res.json();
  const catalogoDiv = document.getElementById('catalogo-usuario');
  catalogoDiv.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.image_url}" alt="${prod.name}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;">
      <h3>${prod.name}</h3>
      <p>${prod.description}</p>
      <p>Precio: ${prod.price}</p>
      <button class="btn-detalle" data-id="${prod.id}">Ver detalle</button>
      <button class="btn-favorito" data-id="${prod.id}">❤ Favorito</button>
    `;
    catalogoDiv.appendChild(card);
  });
  // Event listeners para detalle y favoritos
  catalogoDiv.querySelectorAll('.btn-detalle').forEach(btn => {
    btn.addEventListener('click', function() {
      mostrarDetalleProducto(this.dataset.id);
    });
  });
  catalogoDiv.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', function() {
      toggleFavorito(this.dataset.id);
    });
  });
}

// Función para mostrar detalle de producto
async function mostrarDetalleProducto(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`http://localhost:8000/api/products/${id}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const prod = await res.json();
  // Aquí puedes mostrar el detalle en un modal o sección
  alert(`Producto: ${prod.name}\nDescripción: ${prod.description}\nPrecio: ${prod.price}`);
}

// Función para marcar/desmarcar favorito
async function toggleFavorito(productId) {
  const token = localStorage.getItem('authToken');
  // Aquí puedes consultar si ya es favorito y alternar
  await fetch('http://localhost:8000/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId })
  });
  alert('Producto marcado como favorito');
}