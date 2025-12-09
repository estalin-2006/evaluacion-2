# Frontend - instrucciones

1. Entrar en la carpeta `frontend/`
2. `npm install`
3. Completar `src/firebaseConfig.js` si quieres subir imágenes desde el frontend a Firebase Storage.
   - Alternativa: subir desde el backend (ver FirebaseStorageService).
4. `npm run dev` para levantar la app (Vite).
5. Ajustar `src/api.js` con la URL correcta del backend.

Notas:
- En producción configurar CORS y tokens (Sanctum).
- La carga de imágenes desde frontend puede hacerse con Firebase JS SDK y luego enviar la URL al backend al crear producto.
