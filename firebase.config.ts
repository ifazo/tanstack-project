// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_eUhiz0hnZwV00wBBB5ZckWrkOTv7CT0",
  authDomain: "ifaz-tanstack-project.firebaseapp.com",
  projectId: "ifaz-tanstack-project",
  storageBucket: "ifaz-tanstack-project.firebasestorage.app",
  messagingSenderId: "286409010708",
  appId: "1:286409010708:web:b87abdace7e725afaec101",
  measurementId: "G-546WL2N3CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;