const router = require('express').Router();
const db = require('../config/db');
const { upload, cloudinary } = require('../config/cloudinary');
const isAuthenticated = require('../middleware/auth');
const axios = require('axios');
const sendMatchEmail = require('../config/mailer');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ---------- POST /api/reports/lost ----------
router.post('/lost', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { item_name, description, location } = req.body;
    const user_id = req.user.id;

    if (!item_name) return res.status(400).json({ error: 'Item name is required' });

    const photo_url       = req.file?.path     || null;
    const photo_public_id = req.file?.filename || null;

    console.log(`[/lost] file received:`, req.file?.originalname, req.file?.size, 'bytes → public_id:', req.file?.filename);

    const [result] = await db.query(
      `INSERT INTO reports
        (user_id, type, item_name, description, location, photo_url, photo_public_id)
       VALUES (?, 'lost', ?, ?, ?, ?, ?)`,
      [user_id, item_name, description, location, photo_url, photo_public_id]
    );

    res.status(201).json({
      message: 'Lost item reported successfully',
      report_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- POST /api/reports/found ----------
router.post('/found', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { item_name, description, location } = req.body;
    const user_id = req.user.id;

    if (!item_name) return res.status(400).json({ error: 'Item name is required' });

    const photo_url       = req.file?.path     || null;
    const photo_public_id = req.file?.filename || null;

    console.log(`[/found] file received:`, req.file?.originalname, req.file?.size, 'bytes → public_id:', req.file?.filename);

    const [result] = await db.query(
      `INSERT INTO reports
        (user_id, type, item_name, description, location, photo_url, photo_public_id)
       VALUES (?, 'found', ?, ?, ?, ?, ?)`,
      [user_id, item_name, description, location, photo_url, photo_public_id]
    );

    const found_report_id = result.insertId;

    // ✅ Respond immediately — user is not kept waiting for AI
    res.status(201).json({
      message: 'Found item reported successfully',
      report_id: found_report_id,
    });

    // 🤖 Run AI matching in the background after response is already sent
    if (photo_public_id) {
      setImmediate(async () => {
        try {
          const [lostReports] = await db.query(
            `SELECT id, photo_public_id, user_id FROM reports
             WHERE type = 'lost' AND status = 'open' AND photo_public_id IS NOT NULL`
          );

          if (lostReports.length === 0) {
            console.log('[AI background] No open lost reports with photos to match against.');
            return;
          }

          const aiPayload = {
            found_public_id: photo_public_id,
            lost_items: lostReports.map(r => ({
              id: r.id,
              public_id: r.photo_public_id,
              user_id: r.user_id,
            })),
          };

          const aiRes = await axios.post(`${AI_SERVICE_URL}/match-all`, aiPayload, {
            timeout: 60000,
          });

          const { best_match, checked } = aiRes.data;
          console.log(`[AI background] Checked ${checked} lost report(s). Best match:`, best_match);

          if (best_match) {
            const [matchResult] = await db.query(
              `INSERT INTO matches
                (found_report_id, lost_report_id, similarity_score, confidence, status)
               VALUES (?, ?, ?, ?, 'pending')`,
              [found_report_id, best_match.report_id,
               best_match.similarity, best_match.confidence]
            );

            const match_id = matchResult.insertId;
            console.log(`[AI background] Match record created: Found #${found_report_id} ↔ Lost #${best_match.report_id} (${best_match.confidence} - ${best_match.similarity})`);

            if (best_match.is_match) {
              const [[lostReport]] = await db.query(
                `SELECT r.item_name, u.id AS user_id, u.email
                 FROM reports r
                 JOIN users u ON u.id = r.user_id
                 WHERE r.id = ?`,
                [best_match.report_id]
              );

              if (lostReport) {
                const message = `A possible match (${best_match.confidence}) was found for your lost item "${lostReport.item_name}".`;

                // In-app notification
                await db.query(
                  `INSERT INTO notifications (user_id, match_id, message)
                   VALUES (?, ?, ?)`,
                  [lostReport.user_id, match_id, message]
                );

                // Email notification
if (lostReport.email) {
  const subject = `Possible match found for your lost item: ${lostReport.item_name}`;
  const htmlContent = `
    <h2>Great news!</h2>
    <p>A found item report matching your lost item <strong>"${lostReport.item_name}"</strong> has been submitted.</p>
    <p>Match Confidence: <strong>${best_match.confidence}</strong></p>
    <p>Log in to your account to check the details and verify the match.</p>
  `;

  await sendMatchEmail(lostReport.email, subject, htmlContent);
}

                console.log(`[AI background] Notification sent to ${lostReport.email}`);
              }
            } else {
              console.log('[AI background] Low-confidence match recorded — no notification sent.');
            }
          } else {
            console.log('[AI background] No match found above threshold.');
          }
        } catch (aiErr) {
          console.error('[AI background] Matching error:', aiErr.code, aiErr.message);
          console.error('[AI background] AI response data:', JSON.stringify(aiErr.response?.data, null, 2));
        }
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- GET /api/reports/mine ----------
router.get('/mine', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, type, item_name, description, location, status, created_at
       FROM reports WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- GET /api/reports/notifications ----------
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, match_id, message, is_read, created_at
       FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- PATCH /api/reports/notifications/:id/read ----------
router.patch('/notifications/:id/read', isAuthenticated, async (req, res) => {
  try {
    await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- GET /api/reports/search ----------
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q || '';

    if (!searchTerm.trim()) {
      return res.json([]);
    }

    const searchPattern = `%${searchTerm}%`;
    const [rows] = await db.query(
      `SELECT id, type, item_name, description, location, photo_url, status, created_at, user_id
       FROM reports
       WHERE (item_name LIKE ? OR description LIKE ? OR location LIKE ?)
       AND status = 'open'
       ORDER BY created_at DESC
       LIMIT 50`,
      [searchPattern, searchPattern, searchPattern]
    );

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;