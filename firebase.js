import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBJJW3nhf7gHLHbdvQ0CSJNHI21VZQ7knE",
  authDomain: "notes-4278b.firebaseapp.com",
  projectId: "notes-4278b",
  storageBucket: "notes-4278b.appspot.com",
  messagingSenderId: "246523000830",
  appId: "1:246523000830:web:355a8763d27c1f726cb2af",
};
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();

export { db };
