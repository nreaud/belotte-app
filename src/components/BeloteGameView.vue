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
      />

      <BeloteBiddingPhase
          v-if="gamePhase === 'bidding'"
          :teams="teams"
          :dealer="dealer"
          :humanPlayerIndex="humanPlayerIndex"
          :playerCards="playerCards"
          @bidding-complete="onBiddingComplete"
          @restart-bidding="onRestartBidding"
      />
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
      playerCards: [] // Main du joueur humain
    }
  },
  computed: {
    trumpCardForTable() {
      // Fournir la carte d'atout au composant de table si nous sommes en phase de prise
      if (this.gamePhase === 'bidding') {
        return this.trumpCard
      }
      return null
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

      // Générer la main du joueur humain
      this.dealPlayerCards()

      // Simuler une carte d'atout potentielle pour la phase de prise
      this.generateTrumpCard()
    },
    dealPlayerCards() {
      // Simuler la distribution de 5 cartes au joueur humain (phase de prise en belote)
      const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']
      const newHand = []

      // Distribuer 5 cartes aléatoires
      for (let i = 0; i < 5; i++) {
        const randomValue = values[Math.floor(Math.random() * values.length)]
        const randomSuit = suits[Math.floor(Math.random() * suits.length)]

        // Vérifier si la carte est déjà dans la main
        const cardExists = newHand.some(card =>
            card.value === randomValue && card.suit === randomSuit
        )

        if (!cardExists) {
          newHand.push({
            value: randomValue,
            suit: randomSuit
          })
        } else {
          // Si carte déjà existante, refaire un tour de boucle
          i--
        }
      }

      // Trier les cartes par couleur puis par valeur
      const suitOrder = { 'hearts': 0, 'diamonds': 1, 'clubs': 2, 'spades': 3 }
      const valueOrder = { '7': 0, '8': 1, '9': 2, '10': 3, 'J': 4, 'Q': 5, 'K': 6, 'A': 7 }

      newHand.sort((a, b) => {
        if (a.suit !== b.suit) {
          return suitOrder[a.suit] - suitOrder[b.suit]
        }
        return valueOrder[a.value] - valueOrder[b.value]
      })

      this.playerCards = newHand
    },
    generateTrumpCard() {
      // Simuler une carte d'atout potentielle
      const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']

      let randomValue, randomSuit, validCard = false

      // Générer une carte qui n'existe pas dans la main du joueur
      while (!validCard) {
        randomValue = values[Math.floor(Math.random() * values.length)]
        randomSuit = suits[Math.floor(Math.random() * suits.length)]

        // Vérifier si la carte est déjà dans la main du joueur
        validCard = !this.playerCards.some(card =>
            card.value === randomValue && card.suit === randomSuit
        )
      }

      this.trumpCard = {
        value: randomValue,
        suit: randomSuit
      }
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
        this.dealPlayerCards()
        this.generateTrumpCard()
      }, 3000)
    },
    onRestartBidding(data) {
      console.log('Redistribution:', data)

      // Mettre à jour le distributeur
      this.dealer = data.newDealer
      this.currentPlayer = (this.dealer + 1) % 4

      // Redistribuer les cartes au joueur
      this.dealPlayerCards()

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

/* Sur les écrans larges, afficher les composants côte à côte */
@media (min-width: 1200px) {
  .game-content {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 30px;
  }

  /* Limiter la taille des composants pour éviter tout chevauchement */
  .game-content > * {
    flex: 0 0 48%; /* Chaque composant prend 48% de la largeur */
    max-width: 48%;
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