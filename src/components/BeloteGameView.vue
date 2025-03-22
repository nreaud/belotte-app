<template>
  <div class="container-fluid bg-game py-3">
    <div class="container">
      <!-- Header Row -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="score-display d-flex justify-content-center">
            <div class="team-score team-1-score me-3">
              <div class="team-name">{{ teams.team1.name }}</div>
              <div class="score-value">0</div>
            </div>
            <div class="team-score team-2-score">
              <div class="team-name">{{ teams.team2.name }}</div>
              <div class="score-value">0</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Row -->
      <div class="row mb-4">
        <div class="col-12">
          <BeloteGameTable
              :teams="teams"
              :dealer="dealer"
              :currentPlayer="currentPlayer"
              :centerCard="trumpCardForTable"
              :allPlayerCards="allPlayerCards"
          />
        </div>
      </div>

      <!-- Bidding Row -->
      <div class="row mb-4">
        <div class="col-12">
          <BeloteBiddingPhase
              v-if="gamePhase === 'bidding'"
              :teams="teams"
              :dealer="dealer"
              :humanPlayerIndex="currentPlayer"
              :playerCards="allPlayerCards[currentPlayer]"
              :trumpCard="trumpCard"
              @bidding-complete="onBiddingComplete"
              @restart-bidding="onRestartBidding"
              @switch-player="onSwitchPlayer"
          />
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
  mounted() {
    // S'assurer que Bootstrap est chargé
    if (typeof bootstrap === 'undefined') {
      // Charger Bootstrap CSS si ce n'est pas déjà fait
      if (!document.getElementById('bootstrap-css')) {
        const link = document.createElement('link');
        link.id = 'bootstrap-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
      }

      // Charger Bootstrap JS si ce n'est pas déjà fait
      if (!document.getElementById('bootstrap-js')) {
        const script = document.createElement('script');
        script.id = 'bootstrap-js';
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        document.body.appendChild(script);
      }
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
<style scoped>
  /* Couleur de fond personnalisée */
.bg-game {
  background-color: #1a1a36;
  min-height: 100vh;
}

/* Styles pour les scores d'équipe */
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
  color: white;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

/* Styles responsifs */
@media (max-width: 768px) {
  .team-score {
    min-width: unset;
    flex: 1;
    max-width: 120px;
  }
}

@media (max-width: 480px) {
  .team-score {
    padding: 6px;
  }

  .score-value {
    font-size: 16px;
  }
}
</style>