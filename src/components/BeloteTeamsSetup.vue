<template>
  <div class="belote-setup">
    <div class="logo-container">
      <div class="logo">
        <div class="card-container">
          <div class="card card-blue"><span>A</span><span class="symbol">♣</span></div>
          <div class="card card-purple"><span>A</span><span class="symbol">♦</span></div>
          <div class="card card-pink"><span>A</span><span class="symbol">♥</span></div>
        </div>
        <h1 class="logo-text">Belote</h1>
      </div>
    </div>

    <div class="teams-container">
      <!-- Équipe 1 -->
      <div class="team-card team-card-blue">
        <div class="card-glow"></div>
        <h2>Équipe 1</h2>
        <div class="input-group">
          <label for="team1-name">Nom de l'équipe</label>
          <input
              id="team1-name"
              v-model="team1.name"
              type="text"
              placeholder="Nom de l'équipe 1"
          />
        </div>

        <div class="players">
          <div class="player-row">
            <div class="player-icon player-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="input-group">
              <label for="team1-player1">Joueur 1</label>
              <input
                  id="team1-player1"
                  v-model="team1.player1"
                  type="text"
                  placeholder="Nom du joueur 1"
              />
            </div>
          </div>

          <div class="player-row">
            <div class="player-icon player-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="input-group">
              <label for="team1-player2">Joueur 2</label>
              <input
                  id="team1-player2"
                  v-model="team1.player2"
                  type="text"
                  placeholder="Nom du joueur 2"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Équipe 2 -->
      <div class="team-card team-card-pink">
        <div class="card-glow"></div>
        <h2>Équipe 2</h2>
        <div class="input-group">
          <label for="team2-name">Nom de l'équipe</label>
          <input
              id="team2-name"
              v-model="team2.name"
              type="text"
              placeholder="Nom de l'équipe 2"
          />
        </div>

        <div class="players">
          <div class="player-row">
            <div class="player-icon player-icon-pink">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="input-group">
              <label for="team2-player1">Joueur 1</label>
              <input
                  id="team2-player1"
                  v-model="team2.player1"
                  type="text"
                  placeholder="Nom du joueur 1"
              />
            </div>
          </div>

          <div class="player-row">
            <div class="player-icon player-icon-pink">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="input-group">
              <label for="team2-player2">Joueur 2</label>
              <input
                  id="team2-player2"
                  v-model="team2.player2"
                  type="text"
                  placeholder="Nom du joueur 2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button
          @click="startGame"
          class="start-button"
          :disabled="!canStartGame"
      >
        <span class="button-text">Démarrer la partie</span>
      </button>
    </div>

    <div class="cards-decoration">
      <div class="decoration-card card-1">
        <span class="card-content">A</span>
        <span class="card-symbol">♠</span>
      </div>
      <div class="decoration-card card-2">
        <span class="card-content">A</span>
        <span class="card-symbol">♥</span>
      </div>
      <div class="decoration-card card-3">
        <span class="card-content">A</span>
        <span class="card-symbol">♣</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BeloteTeamsSetup',
  data() {
    return {
      team1: {
        name: 'Nous',
        player1: 'Joueur 1',
        player2: 'Joueur 2'
      },
      team2: {
        name: 'Eux',
        player1: 'Joueur 3',
        player2: 'Joueur 4'
      }
    }
  },
  computed: {
    canStartGame() {
      // Vérifie que tous les champs obligatoires sont remplis
      return (
          this.team1.name.trim() !== '' &&
          this.team1.player1.trim() !== '' &&
          this.team1.player2.trim() !== '' &&
          this.team2.name.trim() !== '' &&
          this.team2.player1.trim() !== '' &&
          this.team2.player2.trim() !== ''
      )
    }
  },
  methods: {
    startGame() {
      console.log('Démarrage de la partie avec les équipes suivantes:')
      console.log('Équipe 1:', this.team1)
      console.log('Équipe 2:', this.team2)

      // Émettre un événement avec les données des équipes
      this.$emit('game-start', {
        team1: this.team1,
        team2: this.team2
      })

      // Rediriger vers la page de jeu
      // Si vous utilisez Vue Router
      if (this.$router) {
        this.$router.push({
          name: 'game',
          params: {
            teams: JSON.stringify({
              team1: this.team1,
              team2: this.team2
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.belote-setup {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: white;
  min-height: 100vh;
  background-color: #1a1a36;
  position: relative;
  overflow: hidden;
}

/* Logo */
.logo-container {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.logo {
  position: relative;
  display: inline-block;
}

.card-container {
  display: flex;
  justify-content: center;
  transform: translateY(30px);
}

.logo .card {
  width: 60px;
  height: 90px;
  background-color: #272751;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  margin: 0 -15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  position: relative;
  transform: rotate(0);
  transition: transform 0.3s ease;
}

.logo .card:hover {
  transform: translateY(-10px) rotate(0);
  z-index: 2;
}

.logo .card-blue {
  border: 2px solid #42a5f5;
  box-shadow: 0 0 15px rgba(66, 165, 245, 0.5);
  transform: rotate(-15deg);
}

.logo .card-purple {
  border: 2px solid #7e57c2;
  box-shadow: 0 0 15px rgba(126, 87, 194, 0.5);
  z-index: 1;
}

.logo .card-pink {
  border: 2px solid #ec407a;
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.5);
  transform: rotate(15deg);
}

.logo .card span {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.logo .card .symbol {
  font-size: 20px;
}

.logo-text {
  font-size: 60px;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #ffd54f, #ffb300);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 213, 79, 0.4);
  position: relative;
  z-index: 2;
}

/* Teams Container */
.teams-container {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .teams-container {
    flex-direction: column;
  }
}

.team-card {
  flex: 1;
  border-radius: 12px;
  padding: 25px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  background-color: rgba(30, 30, 60, 0.7);
  border: 1px solid;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.2;
  filter: blur(20px);
}

.team-card-blue {
  border-color: #42a5f5;
}

.team-card-blue .card-glow {
  background: radial-gradient(circle at center, #42a5f5, transparent 70%);
}

.team-card-pink {
  border-color: #ec407a;
}

.team-card-pink .card-glow {
  background: radial-gradient(circle at center, #ec407a, transparent 70%);
}

h2 {
  color: #ffd54f;
  margin-top: 0;
  margin-bottom: 25px;
  text-align: center;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(255, 213, 79, 0.6);
}

.input-group {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #e0e0e0;
}

input {
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ffd54f;
}

.players {
  margin-top: 25px;
}

.player-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.player-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.player-icon svg {
  width: 24px;
  height: 24px;
}

.player-icon-blue {
  border: 2px solid #42a5f5;
  box-shadow: 0 0 10px rgba(66, 165, 245, 0.5);
}

.player-icon-blue svg {
  stroke: #42a5f5;
}

.player-icon-pink {
  border: 2px solid #ec407a;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.player-icon-pink svg {
  stroke: #ec407a;
}

.action-buttons {
  text-align: center;
  position: relative;
  z-index: 2;
}

.start-button {
  background: linear-gradient(45deg, #ffd54f, #ffb300);
  color: #1a1a36;
  border: none;
  padding: 14px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(255, 213, 79, 0.6);
  position: relative;
  overflow: hidden;
}

.start-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.start-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(255, 213, 79, 0.8);
}

.start-button:hover:not(:disabled)::before {
  left: 100%;
}

.start-button:disabled {
  background: #4e4e4e;
  cursor: not-allowed;
  box-shadow: none;
}

/* Decoration Cards */
.cards-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.decoration-card {
  position: absolute;
  width: 80px;
  height: 120px;
  border-radius: 10px;
  background-color: #272751;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.15;
  font-size: 30px;
  font-weight: bold;
}

.decoration-card .card-content {
  font-size: 30px;
  position: absolute;
  top: 10px;
  left: 10px;
}

.decoration-card .card-symbol {
  font-size: 40px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.card-1 {
  top: 5%;
  right: 5%;
  transform: rotate(15deg);
  border: 2px solid #42a5f5;
  box-shadow: 0 0 15px rgba(66, 165, 245, 0.5);
}

.card-2 {
  bottom: 10%;
  left: 5%;
  transform: rotate(-10deg);
  border: 2px solid #ec407a;
  box-shadow: 0 0 15px rgba(236, 64, 122, 0.5);
}

.card-3 {
  top: 40%;
  left: 10%;
  transform: rotate(-25deg);
  border: 2px solid #7e57c2;
  box-shadow: 0 0 15px rgba(126, 87, 194, 0.5);
}

/* Styles responsives pour mobile */
@media (max-width: 768px) {
  .belote-setup {
    padding: 15px;
  }

  .logo-container {
    margin-bottom: 25px;
  }

  .card-container {
    transform: translateY(20px);
  }

  .logo .card {
    width: 45px;
    height: 68px;
    margin: 0 -10px;
  }

  .logo .card span {
    font-size: 18px;
  }

  .logo .card .symbol {
    font-size: 16px;
  }

  .logo-text {
    font-size: 40px;
  }

  .teams-container {
    gap: 20px;
    margin-bottom: 25px;
  }

  .team-card {
    padding: 15px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .input-group {
    margin-bottom: 10px;
  }

  label {
    font-size: 14px;
  }

  input {
    padding: 8px 10px;
    font-size: 14px;
  }

  .players {
    margin-top: 15px;
  }

  .player-row {
    margin-bottom: 10px;
  }

  .player-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .player-icon svg {
    width: 20px;
    height: 20px;
  }

  .start-button {
    padding: 12px 25px;
    font-size: 16px;
  }

  /* Ajuster ou masquer les cartes décoratives sur mobile */
  .decoration-card {
    width: 60px;
    height: 90px;
  }

  .decoration-card .card-content {
    font-size: 24px;
  }

  .decoration-card .card-symbol {
    font-size: 30px;
  }

  /* Repositionner les cartes pour éviter qu'elles ne gênent le contenu */
  .card-1 {
    top: 2%;
    right: 2%;
  }

  .card-2 {
    bottom: 5%;
    left: 2%;
  }

  .card-3 {
    display: none; /* Masquer la troisième carte sur mobile */
  }
}

/* Styles pour très petits écrans */
@media (max-width: 480px) {
  .belote-setup {
    padding: 10px;
  }

  .logo-container {
    margin-bottom: 20px;
  }

  .logo .card {
    width: 40px;
    height: 60px;
    margin: 0 -8px;
  }

  .logo .card span {
    font-size: 16px;
  }

  .logo .card .symbol {
    font-size: 14px;
  }

  .logo-text {
    font-size: 30px;
  }

  .team-card {
    padding: 12px;
    border-radius: 8px;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  label {
    font-size: 12px;
  }

  input {
    padding: 6px 8px;
    font-size: 13px;
  }

  .player-icon {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }

  .player-icon svg {
    width: 18px;
    height: 18px;
  }

  .start-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  /* Réduire encore la taille des cartes ou les masquer davantage */
  .decoration-card {
    width: 50px;
    height: 75px;
    opacity: 0.1; /* Réduire l'opacité pour moins distraire */
  }

  .card-2 {
    display: none; /* Masquer une autre carte sur très petits écrans */
  }
}
</style>