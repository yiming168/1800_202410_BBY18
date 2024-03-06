//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBy4gSQNpxx8wMcKkEDBRKoMxAUTbtBgmg",
  authDomain: "bby18-6af8d.firebaseapp.com",
  projectId: "bby18-6af8d",
  storageBucket: "bby18-6af8d.appspot.com",
  messagingSenderId: "1015274578073",
  appId: "1:1015274578073:web:49a920e799d5faf5901808"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
