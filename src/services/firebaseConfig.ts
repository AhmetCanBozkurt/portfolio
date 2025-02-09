// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with CORS settings
export const db = getFirestore(app);

// Debug için Firestore bağlantısını kontrol et
if (process.env.NODE_ENV === 'development') {
  /*console.log('Firebase Config:', {
    projectId: app.options.projectId,
    databaseURL: app.options.databaseURL,
    storageBucket: app.options.storageBucket
  });*/
  
  //console.log('Firestore instance:', db);
}

// Initialize Storage with custom settings
export const storage = getStorage(app);

// Initialize Auth with custom settings
export const auth = getAuth(app);

// Debug için storage ayarlarını kontrol et
if (process.env.NODE_ENV === 'development') {
  /*console.log('Firebase Storage Config:', {
    bucket: storage.app.options.storageBucket,
    host: 'firebasestorage.googleapis.com',
    bucketUrl: `gs://${storage.app.options.storageBucket}`
  });*/
}


export default app;