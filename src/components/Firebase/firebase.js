import app from 'firebase'

import {productConverter} from "../../models/models";

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

/***
 * Firebase React API
 */
class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
        this.firestore = app.firestore();
        this.firestore.enablePersistence().catch(error => {});
        this.storage = app.storage();
    }

    // *** AUTH API *** //
    /***
     *
     * @param email
     * @param password
     * @returns {Promise<firebase.auth.UserCredential>}
     */
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    /***
     *
     * @param email
     * @param password
     * @returns {Promise<firebase.auth.UserCredential>}
     */
    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    /***
     *
     * @returns {Promise<void>}
     */
    doSignOut = () => this.auth.signOut();
    /***
     *
     * @param email
     * @returns {Promise<void>}
     */
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    /***
     *
     * @param password
     * @returns {Promise<void>}
     */
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // *** USER API *** //

    /***
     * @param uid
     * @returns {firebase.database.Reference}
     */
    user = uid => this.db.ref(`users/${uid}`);

    /***
     * @returns {firebase.database.Reference}
     */
    users = () => this.db.ref('users');

    // *** FIRESTORE API *** //

    product = id => this.firestore.collection('products').doc(id);

    products = () => this.firestore.collection('products');

    doAddProduct = product =>
        this.firestore.collection('products').doc(product.name).withConverter(productConverter).set(product);
    doImageUpload = image => {
        const storageRef = this.storage.ref();
        const productImageRef = storageRef.child(`product/images/${image.name}`);
        let imageUrl = "";
        // Create the file metadata

// Upload file and metadata to the object 'images/mountains.jpg'
        return productImageRef.put(image);
    }
}

export default Firebase;