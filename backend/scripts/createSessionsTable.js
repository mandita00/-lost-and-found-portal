require('dotenv').config();
const db = require('../config/db');

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
        expires INT(11) UNSIGNED NOT NULL,
        data MEDIUMTEXT COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id)
      ) ENGINE=InnoDB;
    `);
    console.log('sessions table created (or already existed).');
  } catch (err) {
    console.error('Error creating sessions table:', err.message);
  }
  process.exit(0);
})();
