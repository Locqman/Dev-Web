const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: 'root1234',            
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