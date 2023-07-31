// IMPORTANTE: Debes asegurarte de que el servidor Express esté sirviendo archivos estáticos desde el directorio 'frontend' en la ruta '/frontend'
// También debes asegurarte de haber instalado las dependencias de Express y Firebase antes de ejecutar el servidor (ejecuta 'npm install express firebase' en la carpeta del backend)

import { fileURLToPath } from 'url'; // Importa la función fileURLToPath
import { dirname } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import express from 'express';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAygjPo0tXG76NBKb773GCjs3oVYBM7F_8",
    authDomain: "studentapp-4f0e8.firebaseapp.com",
    projectId: "studentapp-4f0e8",
    storageBucket: "studentapp-4f0e8.appspot.com",
    messagingSenderId: "1092391974666",
    appId: "1:1092391974666:web:0c2fcb1074f188064c2cf3"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const app = express();
const port = 3000;
// Obtener la ruta del archivo actual y el directorio donde se encuentra
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir los archivos estáticos desde el directorio 'frontend'
const frontendPath = dirname(__dirname) + '/frontend';
app.use(express.static(frontendPath));
app.use(express.json());

// read all students
app.get("/api/read", async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        let response = [];
        querySnapshot.forEach((doc) => {
            const selectedItem = {
                id: doc.id,
                student: doc.data(),
            };
            response.push(selectedItem);
        });
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// read one student
app.get("/api/read/:item_id", (req, res) => {
  (async () => {
    try {
      let response = [];
      const q = query(
        collection(db, "students"),
        where("ID", "==", parseInt(req.params.item_id))
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const selectedItem = {
          id: doc.id,
          student: doc.data(),
        };
        response.push(selectedItem);
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// create student
app.post("/api/create", async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, "students"), req.body.student);
        return res.status(200).send(`Document written with ID:  ${docRef.id}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// update
app.put("/api/update/:item_id", async (req, res) => {
    try {
        const studentDocumentId = doc(db, "students", req.params.item_id);
        await updateDoc(studentDocumentId, req.body.student);
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});


// delete
app.delete("/api/delete/:item_id", async (req, res) => {
    try {
        await deleteDoc(doc(db, "students", req.params.item_id));
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`WebApi listening on port ${port}`);
});
