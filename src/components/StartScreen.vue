<template>
  <div class="belote-setup">
    <h1>Configuration de la partie de Belote</h1>

    <div class="teams-container">
      <!-- Équipe 1 -->
      <div class="team-card">
        <h2>Équipe 1</h2>
        <div class="input-group">
          <label for="team1-name">Nom de l'équipe:</label>
          <input
              id="team1-name"
              v-model="team1.name"
              type="text"
              placeholder="Nom de l'équipe 1"
          />
        </div>

        <div class="players">
          <div class="input-group">
            <label for="team1-player1">Joueur 1:</label>
            <input
                id="team1-player1"
                v-model="team1.player1"
                type="text"
                placeholder="Nom du joueur 1"
            />
          </div>

          <div class="input-group">
            <label for="team1-player2">Joueur 2:</label>
            <input
                id="team1-player2"
                v-model="team1.player2"
                type="text"
                placeholder="Nom du joueur 2"
            />
          </div>
        </div>
      </div>

      <!-- Équipe 2 -->
      <div class="team-card">
        <h2>Équipe 2</h2>
        <div class="input-group">
          <label for="team2-name">Nom de l'équipe:</label>
          <input
              id="team2-name"
              v-model="team2.name"
              type="text"
              placeholder="Nom de l'équipe 2"
          />
        </div>

        <div class="players">
          <div class="input-group">
            <label for="team2-player1">Joueur 1:</label>
            <input
                id="team2-player1"
                v-model="team2.player1"
                type="text"
                placeholder="Nom du joueur 1"
            />
          </div>

          <div class="input-group">
            <label for="team2-player2">Joueur 2:</label>
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

    <div class="action-buttons">
      <button
          @click="startGame"
          class="start-button"
          :disabled="!canStartGame"
      >
        Démarrer la partie
      </button>
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
      // Pour l'instant, cette fonction ne fait rien
      // Mais elle sera utilisée plus tard pour initialiser la partie
      console.log('Démarrage de la partie avec les équipes suivantes:')
      console.log('Équipe 1:', this.team1)
      console.log('Équipe 2:', this.team2)

      // Vous pourriez émettre un événement ici
      this.$emit('game-start', {
        team1: this.team1,
        team2: this.team2
      })
    }
  }
}
</script>

<style scoped>
.belote-setup {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.teams-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .teams-container {
    flex-direction: column;
  }
}

.team-card {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #495057;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.players {
  margin-top: 20px;
}

.action-buttons {
  text-align: center;
}

.start-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover:not(:disabled) {
  background-color: #218838;
}

.start-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.65;
}
</style>