import firebase from 'firebase/compat/app'
import { getDatabase } from 'firebase/database'
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import 'firebase/compat/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyAdAvJcnTusezscXMgpgDqhFXK5UnkDito",
//   authDomain: "bustrackingmay23.firebaseapp.com",
//   databaseURL: "https://bustrackingmay23-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "bustrackingmay23",
//   storageBucket: "bustrackingmay23.appspot.com",
//   messagingSenderId: "953441453417",
//   appId: "1:953441453417:web:40c5403c8e569dd9f569f8",
//   measurementId: "G-LNHB3N46K9"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCBmMVzMUnjtfhhiMNa4LBL4FgCaloa0zg",
  authDomain: "fsd-june-30.firebaseapp.com",
  projectId: "fsd-june-30",
  storageBucket: "fsd-june-30.appspot.com",
  messagingSenderId: "192755786656",
  appId: "1:192755786656:web:4d34b0da4f5a63d369bac5",
  measurementId: "G-JDM3P68FS2"
};


if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const auth=firebase.auth();
const db = getDatabase();
const dbfirestore = getFirestore();
export {db , dbfirestore,auth}




