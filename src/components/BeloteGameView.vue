<template>
  <div class="game-view">
    <div class="game-header">
      <h1 class="game-title">Belote</h1>
      <div class="score-display">
        <div class="team-score team-1-score">
          <div class="team-name">{{ teams.team1.name }}</div>
          <div class="score-value">0</div>
        </div>
        <div class="team-score team-2-score">
          <div class="team-name">{{ teams.team2.name }}</div>
          <div class="score-value">0</div>
        </div>
      </div>
    </div>

    <div class="game-content">
      <BeloteGameTable
          :teams="teams"
          :dealer="dealer"
          :currentPlayer="currentPlayer"
          :centerCard="trumpCardForTable"
          :allPlayerCards="allPlayerCards"
      />

      <BeloteBiddingPhase
          v-if="gamePhase === 'bidding'"
          :teams="teams"
          :dealer="dealer"
          :humanPlayerIndex="currentPlayer"
          :playerCards="allPlayerCards[currentPlayer]"
          @bidding-complete="onBiddingComplete"
          @restart-bidding="onRestartBidding"
          @switch-player="onSwitchPlayer"
      />

      <div class="player-controls">
        <button class="control-button" @click="switchToNextPlayer">
          Changer de joueur
        </button>
        <div class="current-player-info">
          Joueur actuel: <span class="current-player-name">{{ players[currentPlayer].name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeloteGameTable from './BeloteGameTable.vue'
import BeloteBiddingPhase from './BeloteBiddingPhase.vue'

export default {
  name: 'BeloteGameView',
  components: {
    BeloteGameTable,
    BeloteBiddingPhase
  },
  props: {
    initialTeams: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      teams: this.initialTeams || {
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
      },
      gamePhase: 'bidding', // 'bidding', 'playing', 'scoring'
      dealer: 0, // L'index du joueur qui distribue
      currentPlayer: 1, // L'index du joueur actuel (commence à gauche du dealer)
      humanPlayerIndex: 0, // Position du joueur humain (par défaut le premier joueur de l'équipe 1)
      trump: null, // Couleur d'atout choisie
      trumpTaker: null, // Joueur qui a pris
      scores: {
        team1: 0,
        team2: 0
      },
      trumpCard: null, // Carte d'atout potentielle
      allPlayerCards: [[], [], [], []] // Mains de tous les joueurs
    }
  },
  computed: {
    trumpCardForTable() {
      // Fournir la carte d'atout au composant de table si nous sommes en phase de prise
      if (this.gamePhase === 'bidding') {
        return this.trumpCard
      }
      return null
    },
    players() {
      // Créer un tableau des joueurs avec leur nom et leur équipe
      return [
        { name: this.teams.team1.player1, team: 1 },
        { name: this.teams.team2.player1, team: 2 },
        { name: this.teams.team1.player2, team: 1 },
        { name: this.teams.team2.player2, team: 2 }
      ]
    }
  },
  created() {
    // Récupérer les équipes depuis les paramètres d'URL si disponibles
    if (this.$route && this.$route.params.teams) {
      try {
        const teamsData = JSON.parse(this.$route.params.teams)
        if (teamsData.team1 && teamsData.team2) {
          this.teams = teamsData
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des équipes:', e)
      }
    }

    // Initialiser le jeu
    this.initGame()
  },
  methods: {
    initGame() {
      // Choisir un distributeur aléatoire pour commencer
      this.dealer = Math.floor(Math.random() * 4)
      // Le joueur à gauche du distributeur commence
      this.currentPlayer = (this.dealer + 1) % 4

      // Distribuer les cartes à tous les joueurs
      this.dealAllPlayerCards()

      // Simuler une carte d'atout potentielle pour la phase de prise
      this.generateTrumpCard()
    },
    dealAllPlayerCards() {
      const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']

      // Créer un jeu de 32 cartes
      const deck = []
      for (const suit of suits) {
        for (const value of values) {
          deck.push({ value, suit })
        }
      }

      // Mélanger le jeu
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[deck[i], deck[j]] = [deck[j], deck[i]]
      }

      // Distribuer 5 cartes à chaque joueur (pour la phase de prise)
      this.allPlayerCards = [[], [], [], []]
      for (let i = 0; i < 5; i++) {
        for (let player = 0; player < 4; player++) {
          this.allPlayerCards[player].push(deck.pop())
        }
      }

      // Trier les mains
      for (let player = 0; player < 4; player++) {
        this.sortPlayerHand(player)
      }
    },
    sortPlayerHand(playerIndex) {
      // Trier les cartes par couleur puis par valeur
      const suitOrder = { 'hearts': 0, 'diamonds': 1, 'clubs': 2, 'spades': 3 }
      const valueOrder = { '7': 0, '8': 1, '9': 2, '10': 3, 'J': 4, 'Q': 5, 'K': 6, 'A': 7 }

      this.allPlayerCards[playerIndex].sort((a, b) => {
        if (a.suit !== b.suit) {
          return suitOrder[a.suit] - suitOrder[b.suit]
        }
        return valueOrder[a.value] - valueOrder[b.value]
      })
    },
    generateTrumpCard() {
      // Simuler une carte d'atout potentielle
      const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']

      let randomValue, randomSuit, validCard = false

      // Vérifier toutes les mains des joueurs
      const isCardInAnyHand = (value, suit) => {
        return this.allPlayerCards.some(hand =>
            hand.some(card => card.value === value && card.suit === suit)
        )
      }

      // Générer une carte qui n'existe dans aucune main
      while (!validCard) {
        randomValue = values[Math.floor(Math.random() * values.length)]
        randomSuit = suits[Math.floor(Math.random() * suits.length)]

        validCard = !isCardInAnyHand(randomValue, randomSuit)
      }

      this.trumpCard = {
        value: randomValue,
        suit: randomSuit
      }
    },
    switchToNextPlayer() {
      // Passer au joueur suivant manuellement
      this.currentPlayer = (this.currentPlayer + 1) % 4
    },
    onSwitchPlayer(data) {
      // Appelé depuis la phase de prise quand on passe au joueur suivant
      this.currentPlayer = data.nextPlayer
    },
    onBiddingComplete(data) {
      console.log('Prise terminée:', data)

      // Enregistrer qui a pris et à quelle couleur
      this.trumpTaker = data.taker
      this.trump = data.trumpSuit

      // Passer à la phase de jeu (pour l'instant, nous allons simplement réinitialiser la prise)
      // Dans une implémentation complète, vous passeriez à la phase de jeu
      // this.gamePhase = 'playing'

      // Pour l'instant, nous allons juste réinitialiser la phase de prise après un délai
      setTimeout(() => {
        this.dealer = (this.dealer + 1) % 4
        this.currentPlayer = (this.dealer + 1) % 4
        this.dealAllPlayerCards()
        this.generateTrumpCard()
      }, 3000)
    },
    onRestartBidding(data) {
      console.log('Redistribution:', data)

      // Mettre à jour le distributeur
      this.dealer = data.newDealer
      this.currentPlayer = (this.dealer + 1) % 4

      // Redistribuer les cartes
      this.dealAllPlayerCards()

      // Générer une nouvelle carte d'atout
      this.generateTrumpCard()
    }
  }
}
</script>

<style scoped>
.game-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: white;
  min-height: 100vh;
  background-color: #1a1a36;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.game-title {
  margin: 0;
  color: #ffd54f;
  font-size: 32px;
  text-shadow: 0 0 15px rgba(255, 213, 79, 0.6);
}

.score-display {
  display: flex;
  gap: 30px;
}

.team-score {
  min-width: 120px;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid;
}

.team-1-score {
  border-color: #42a5f5;
  background-color: rgba(66, 165, 245, 0.1);
  box-shadow: 0 0 10px rgba(66, 165, 245, 0.3);
}

.team-2-score {
  border-color: #ec407a;
  background-color: rgba(236, 64, 122, 0.1);
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.3);
}

.team-name {
  font-size: 14px;
  margin-bottom: 5px;
  opacity: 0.9;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
}

.game-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.player-controls {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.control-button {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #64b5f6, #0d47a1);
  color: white;
  box-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
}

.control-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(100, 181, 246, 0.7);
}

.current-player-info {
  font-size: 16px;
  color: #e0e0e0;
}

.current-player-name {
  font-weight: bold;
  color: #ffd54f;
}

/* Sur les écrans larges, afficher les composants côte à côte */
@media (min-width: 1200px) {
  .game-content {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 30px;
  }

  /* Limiter la taille des composants pour éviter tout chevauchement */
  .game-content > *:not(.player-controls) {
    flex: 0 0 48%; /* Chaque composant prend 48% de la largeur */
    max-width: 48%;
  }

  .player-controls {
    flex: 0 0 100%;
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
  }

  .score-display {
    width: 100%;
  }

  .team-score {
    flex: 1;
  }
}
</style>