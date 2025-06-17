// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, Firestore, getDocs, getFirestore } from "firebase/firestore"
import type { Item } from "../Context/Item";

// Your web app's Firebase configuration
//Should be taking from enviromnet variable .env
const firebaseConfig = {
  apiKey: "AIzaSyA253UQE1-uLeD2O5n89pgpGYhQ6ZGejao",
  authDomain: "react-olx-dc12c.firebaseapp.com",
  projectId: "react-olx-dc12c",
  storageBucket: "react-olx-dc12c.firebasestorage.app",
  messagingSenderId: "826481767154",
  appId: "1:826481767154:web:1ec4638050caca4d32d66b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth:any = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage();
export const fireStore = getFirestore();


export const fetchFromFirestore = async () => {
    try{
        const productsCollection = collection(fireStore,"Products");
        // console.log(productsCollection);
        const productSnapshot = await getDocs(productsCollection);
        // console.log("Product Snapshot",productSnapshot);
        const productList = productSnapshot.docs.map(doc => ({
            id:doc.id, 
            ...doc.data()
        })) as Item[];
        console.log("Fetched products from FireStore",productList);
        return productList;
    }
    catch(err){
        console.log("Error fetching products from firestore",err);
        return [];

    }
}
