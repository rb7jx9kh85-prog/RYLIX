// Connexion Firebase du site public — lecture seule, en direct depuis Firestore.
//
// Le projet Firestore (admin-rylix) autorise la lecture publique anonyme sur
// les collections dates/parcours/galerie (voir firestore.rules côté admin) :
// la clé ci-dessous est la clé web publique du projet, pas un secret — elle
// identifie l'app auprès de Firebase, elle n'autorise rien à elle seule.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCOGgJTY4J6ugZPFi1cRYAWmjD372sbrik',
  authDomain: 'admin-rylix.firebaseapp.com',
  projectId: 'admin-rylix',
  storageBucket: 'admin-rylix.firebasestorage.app',
  messagingSenderId: '858520257275',
  appId: '1:858520257275:web:95c9de1f0e34dfc73fe65e',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
