//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyC16cCS-v8sJe6b6TfHo3bDVtMKsaqc0r8",
    authDomain: "comp1800-20240220-demo.firebaseapp.com",
    projectId: "comp1800-20240220-demo",
    storageBucket: "comp1800-20240220-demo.appspot.com",
    messagingSenderId: "701735076076",
    appId: "1:701735076076:web:f28c367583331a4523e5c9"
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
