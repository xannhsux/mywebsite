/**
 * Cloud Function — rate-limited hi increment.
 *
 * Deploy: firebase deploy --only functions
 *
 * Rate limiting strategy:
 *   - Uses caller's IP (from request headers) as identifier
 *   - Stores { ip: lastSentDate } in a "rate-limits" collection
 *   - Allows 1 hi per IP per day
 *   - IP is hashed (SHA-256) before storing for privacy
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

exports.sendHi = functions.https.onCall(async (data, context) => {
  // Get caller IP
  const ip = context.rawRequest?.ip || context.rawRequest?.headers['x-forwarded-for'] || 'unknown';
  const ipHash = hashIP(ip);
  const today = new Date().toISOString().slice(0, 10);

  // Check rate limit
  const limitRef = db.collection('rate-limits').doc(ipHash);
  const limitDoc = await limitRef.get();

  if (limitDoc.exists && limitDoc.data().lastDate === today) {
    return { success: false, reason: 'already_sent_today' };
  }

  // Increment hi count for today
  const countRef = db.collection('hi-counts').doc(today);
  await db.runTransaction(async (tx) => {
    const countDoc = await tx.get(countRef);
    const current = countDoc.exists ? countDoc.data().count || 0 : 0;
    tx.set(countRef, {
      count: current + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.set(limitRef, { lastDate: today });
  });

  return { success: true, date: today };
});
