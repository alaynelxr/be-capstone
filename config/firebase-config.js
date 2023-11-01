const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccount.json");

const serviceAccountJSON = process.env.SERVICE_ACCOUNT_JSON;

// Parse the JSON from the environment variable
const serviceAccount = JSON.parse(serviceAccountJSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
