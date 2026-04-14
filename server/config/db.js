const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',        // à changer selon votre config MySQL
  password: '',            // à changer selon votre config MySQL
  database: 'skiconnect'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur connexion MySQL :', err.message);
    process.exit(1);
  }
  console.log('Connecté à MySQL ✅');
});

module.exports = db;
