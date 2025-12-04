import { storage, ref, uploadBytesResumable, getDownloadURL } from "../firebase";

export async function uploadImageFile(file) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
