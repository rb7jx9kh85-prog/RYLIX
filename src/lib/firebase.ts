// Connexion Firebase du site public — lecture seule, en direct depuis Firestore.
//
// Le projet Firestore (rylix-admin) autorise la lecture publique anonyme sur
// les collections dates/parcours/galerie (voir firestore.rules côté admin) :
// la clé ci-dessous est la clé web publique du projet, pas un secret — elle
// identifie l'app auprès de Firebase, elle n'autorise rien à elle seule.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBysz83TEPq_03K9qgNdyj4l5RmjsoIxAg',
  authDomain: 'rylix-admin.firebaseapp.com',
  projectId: 'rylix-admin',
  storageBucket: 'rylix-admin.firebasestorage.app',
  messagingSenderId: '984517115719',
  appId: '1:984517115719:web:6cc24ebc5e138ffd979662',
  measurementId: 'G-DY1NQC8597',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
