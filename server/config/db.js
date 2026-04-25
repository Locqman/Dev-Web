const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: 'root1234',            // si vous avez mis un mot de passe lors de l'install MySQL, mettez-le ici. Sinon laissez vide
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