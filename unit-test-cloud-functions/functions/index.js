const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Simple HTTP function that returns the "?text" query parameter in the response text.
 */
exports.simpleHttp = functions.https
  .onRequest((request, response) => {
    response.send(`text: ${request.query.text}`);
  });

/**
 * Simple callable function that adds two numbers.
 */
exports.simpleCallable = functions.https
  .onCall((data, context) => {
    // This function implements addition (a + b = c)
    const sum = data.a + data.b;
    return {
      c: sum,
    };
  });

/**
 * Firestore-triggered function which uppercases a string field of a document.
 */
exports.firestoreUppercase = functions.firestore
  // .document("/lowercase/{doc}")
  .document("/lowercase/{lowercaseId}")
  .onCreate(async (snapshot, context) => {

    /**
     * // const docId = snapshot.id;
     * 
     * I wouldn't get the id from the snapshot like this. Rather, I'd use
     * wildcard capture variable in the document path by pulling it out
     * of the context params. But the variable can't be captured automatically
     * when using the firebase-functions-test SDK. You have to pass it in
     * as part of the ContextOptions when calling the wrapped function.
     * Look in functions.spec.js to see this.
     * 
     * context will only have params when passed in:
     * console.log(`firestoreUppercase context:`, context);
     * 
     * snapshot.ref.path will have a document ID that isn't used
     * console.log(`snapshot.ref.path:`, snapshot.ref.path);
     * 
     * I found a question about it and answered it here:
     * https://stackoverflow.com/a/69169408/1341838
     * 
     * And here's an issue about it on the repo:
     * https://github.com/firebase/firebase-functions-test/issues/10
     */

    const { lowercaseId } = context.params
    const { text: lowercaseText } = snapshot.data();
    const adminDb = admin.firestore();
    
    await adminDb
      .collection("uppercase")
      .doc(lowercaseId)
      .set({
        text: lowercaseText.toUpperCase(),
      });
  });

/**
 * Auth-triggered function which writes a user document to Firestore.
 */
exports.userSaver = functions.auth.user()
  .onCreate(async (user, context) => {
    const adminDb = admin.firestore();

    // console.log(`userSaver context:`, context);
    // console.log(`user`, user);

    const {
      uid, // Probably wouldn't save this.
      email,
      emailVerified,
      displayName,
      photoURL,
      phoneNumber,
      disabled,
      providerData,
      customClaims,
      passwordSalt,
      passwordHash,
      tokensValidAfterTime,
      metadata,
    } = user;

    // Make a document in the user's collection with everything we know about the user
    await adminDb
      .collection("users")
      .doc(user.uid)
      // .set(user.toJSON());
      .set({
        uid, // Probably wouldn't save this.
        email,
        displayName,
        photoURL,
        phoneNumber,
        // I don't think these should come through from creating in the emulator
        // customClaims,
      });
  });
