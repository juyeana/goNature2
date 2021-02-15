import firebase from 'firebase/app'
import 'firebase/storage'

  var config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'gonature-a4df6.firebaseapp.com',
    databaseURL: process.env.FIREBASE_DB_URL,
    projectId: 'gonature-a4df6',
    storageBucket: 'gonature-a4df6.appspot.com',
    messagingSenderId: '219646329702',
  };

  // var config = {
  //   apiKey: process.env.API_KEY,
  //   authDomain: process.env.AUTO_DOMAIN,
  //   databaseURL: process.env.DATABASE_URL,
  //   projectId: process.env.PROJECT_ID,
  //   storageBucket: process.env.STORAGE_BUCKET,
  //   messagingSenderId: process.env.MESSAGING_SENDER_ID,
  // };


  firebase.initializeApp(config);
  
  var storage = firebase.storage();
  
  export { storage, firebase as default };
