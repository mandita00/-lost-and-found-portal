@'
require('dotenv').config();
const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

(async () => {
  try {
    const [rows] = await db.query(
      `SELECT photo_public_id FROM reports WHERE photo_public_id IS NOT NULL`
    );
    console.log(`Found ${rows.length} photo(s) to delete from Cloudinary.`);

    await db.query(`DELETE FROM notifications`);
    await db.query(`DELETE FROM matches`);
    await db.query(`DELETE FROM reports`);
    console.log('Cleared notifications, matches, and reports tables.');

    for (const { photo_public_id } of rows) {
      try {
        await cloudinary.uploader.destroy(photo_public_id, {
          resource_type: 'image',
          type: 'private',
        });
        console.log(`Deleted from Cloudinary: ${photo_public_id}`);
      } catch (err) {
        console.error(`Failed to delete ${photo_public_id}:`, err.message);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
})();
'@ | Set-Content -Path scripts\clearReports.js -Encoding UTF8