import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express'
import * as cors from 'cors';

// Express
// const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://friendlychat-38809.firebaseio.com",
});
const db = admin.firestore();

// Express
const app = express();
app.use(cors({ origin: true }));

app.get('/categories', async (_req, res) => {
  functions.logger.info('Get categories.', {structuredData: true});

  const categoriesRef = db.collection('categories');
  const docsSnap = await categoriesRef.get();
  const categories = docsSnap.docs.map((doc) => doc.data());
  res.json(categories);
});

app.get('/ventures', async (req, res) => {
  functions.logger.info('Get ventures.', {structuredData: true});
  const { query } = req;

  const category = query.category || ''
  console.log(category)

  const venturesRef = category.length
    ? db.collection('ventures').where('category', '==', category)
    : db.collection('ventures')

  const docsSnap = await venturesRef.get();
  const ventures = docsSnap.docs.map((doc) => doc.data());
  res.json(ventures);
});

app.post('/ventures', async (req, res) => {
  functions.logger.info('Create a new venture.', {structuredData: true});

  const { body } = req;
  const errors = []

  if (!body.account) errors.push('Account is required');
  if (!body.phone) errors.push('Phone is required');
  if (!body.category) errors.push('Category is required');

  if (errors.length) return res.status(403).json({ message: 'Missing required fields.', errors })

  const ventureRef = db.collection('ventures');
  await ventureRef.add({
    account: body.account,
    phone: body.phone,
    category: body.category,
  });

  return res.status(200).json({
    message: 'Successfully added new venture.',
  });
});

export const api = functions.https.onRequest(app);
