import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBoB01fZg7vQCFQ_RqCNVbj6R25RIhEiOk",
  authDomain: "civicreport-10c2a.firebaseapp.com",
  projectId: "civicreport-10c2a",
  storageBucket: "civicreport-10c2a.firebasestorage.app",
  messagingSenderId: "960452463957",
  appId: "1:960452463957:web:09529e9fa4a62bf8efb3dc",
  measurementId: "G-SL7ZB69D6X"
};


// Alternative configuration - use the one that matches your project
// const firebaseConfig = {
//   apiKey: "AIzaSyBe801fZg7v0CFO_ReDWbj6R2S8hEDb",
//   authDomain: "civicreport-10c2a.firebaseapp.com",
//   projectId: "civicreport-10c2a",
//   storageBucket: "civicreport-10c2a.appspot.com",
//   messagingSenderId: "960452463957",
//   appId: "1:960452463957:web:your-actual-app-id-here" // You need to get this from Firebase Console
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Optional: Configure auth settings
auth.useDeviceLanguage();

// Optional: Export firebase config for other uses
export { firebaseConfig };

// Export Firebase services
export { app, analytics, auth, db, storage };

// Default export
export default app;