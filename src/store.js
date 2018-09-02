import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import NotifyReducer from "./reducers/NotifyReducer";
import SettingReducer from "./reducers/SettingReducer";

const firebaseConfig = {
  apiKey: "AIzaSyAhieCRHtgkn6U9H6MiApZ-yj3Ej-PbrvI",
  authDomain: "reactclientpanel-3d4e6.firebaseapp.com",
  databaseURL: "https://reactclientpanel-3d4e6.firebaseio.com",
  projectId: "reactclientpanel-3d4e6",
  storageBucket: "reactclientpanel-3d4e6.appspot.com",
  messagingSenderId: "1070450511022"
};

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

//Init firebase instance

firebase.initializeApp(firebaseConfig);

//Init fireStore

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: NotifyReducer,
  settings: SettingReducer
});

//check for settings in local storage
if (localStorage.getItem("settings") === null) {
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };
  // set to localstorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create initial state

const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

//create Store

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
