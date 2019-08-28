import firebase from 'firebase';

const config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
    apiKey: "AIzaSyCfHfbOsNZhuLJCoYnB2XjcgbFwFFb9mEE",
    authDomain: "go-long-1aff6.firebaseapp.com",
    databaseURL: "https://go-long-1aff6.firebaseio.com",
    projectId: "go-long-1aff6",
    storageBucket: "",
    messagingSenderId: "71359417424",
    appId: "1:71359417424:web:2cdd5b9eac9888e5"
};
const fire = firebase.initializeApp(config);
export default fire;