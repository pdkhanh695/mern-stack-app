import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBlcdC-hRJLsOA4adHXGBtMvrbEVxyBHfM",
  authDomain: "graphqlreactnode-c1e87.firebaseapp.com",
  //databaseURL: "https://graphqlreactnode-c1e87.firebaseio.com",
  projectId: "graphqlreactnode-c1e87",
  storageBucket: "graphqlreactnode-c1e87.appspot.com",
  //messagingSenderId: "246697223078",
  appId: "1:246697223078:web:4accf1626a466624e8a567",
  measurementId: "G-FBNMG3W5WK",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export default firebase;

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
