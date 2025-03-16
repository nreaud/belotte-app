<template>
  <div class="app">
    <router-view @game-start="onGameStart" />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    onGameStart(teamsData) {
      console.log('Démarrage du jeu avec les équipes:', teamsData)
      // La navigation est maintenant gérée dans le composant BeloteTeamsSetup
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
}

body {
  background-color: #121225;
  background-image: linear-gradient(135deg, #121225 0%, #2d2b55 100%);
  color: white;
  background-attachment: fixed;
}

.app {
  min-height: 100vh;
}

/* Styles globaux pour les scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>