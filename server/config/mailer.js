const nodemailer = require('nodemailer');

// On utilise un compte Gmail simple pour le projet
// Activer "Mots de passe d'application" dans votre compte Google
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre.email@gmail.com',   // ← remplacer
    pass: 'votre_mot_de_passe_app'   // ← remplacer (mot de passe d'application Google)
  }
});

const sendValidationEmail = (toEmail, pseudo, token) => {
  const lien = `http://localhost:5000/api/auth/validate/${token}`;

  const mailOptions = {
    from:    '"SkiConnect 🎿" <votre.email@gmail.com>',
    to:      toEmail,
    subject: 'Validez votre inscription SkiConnect',
    html: `
      <h2>Bienvenue sur SkiConnect, ${pseudo} !</h2>
      <p>Cliquez sur le lien ci-dessous pour valider votre compte :</p>
      <a href="${lien}" style="
        background:#1e88e5;
        color:white;
        padding:12px 24px;
        border-radius:6px;
        text-decoration:none;
        font-weight:bold;
      ">Valider mon compte</a>
      <p style="color:#888;margin-top:20px;font-size:12px;">
        Ce lien est valable 24h. Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
      </p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendValidationEmail };
