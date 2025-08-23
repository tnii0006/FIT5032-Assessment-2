// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL6EsXncjHxd_gTZuwUSnlPXsNZo0kxuI",
  authDomain: "assignment3-4d2ad.firebaseapp.com",
  projectId: "assignment3-4d2ad",
  storageBucket: "assignment3-4d2ad.firebasestorage.app",
  messagingSenderId: "567359564352",
  appId: "1:567359564352:web:98722224750950bc9ccda5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };