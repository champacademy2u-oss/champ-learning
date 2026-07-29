import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJ_pqxqo4bCmSPQ0COG1ZkWw64ukX0SoM",
  authDomain: "champion-course.firebaseapp.com",
  projectId: "champion-course",
  storageBucket: "champion-course.firebasestorage.app",
  messagingSenderId: "337920852937",
  appId: "1:337920852937:web:fab67a792d3b15c574de18",
  measurementId: "G-3RZV6TX39W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
