// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Substitua pelos dados do seu projeto no Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCDJlsABff9kT5szgEcjVmZ9ZE-pao0Dn8",
    authDomain: "diario-f3e8a.firebaseapp.com",
    projectId: "diario-f3e8a",
    storageBucket: "diario-f3e8a.firebasestorage.app",
    messagingSenderId: "594204670944",
    appId: "1:594204670944:web:8a898140255328e85f4985",
    
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 

