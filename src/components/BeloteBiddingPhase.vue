<template>
  <div class="bidding-phase">
    <div class="current-player-action">
      <div class="action-message">C'est à {{ players[currentPlayerIndex].name }} de jouer</div>

      <!-- Affichage de la main du joueur actuel -->
      <div class="player-hand" v-if="playerHand.length > 0">
        <div class="hand-cards">
          <div
              v-for="(card, index) in playerHand"
              :key="index"
              class="hand-card"
              :style="{
                left: `calc(50% - ${(playerHand.length - 1) * 21}px + ${index * 42}px - 42px)`,
                transform: `rotate(${-10 + index * 5}deg)`
              }"
          >
            <div class="card mini-card" :class="getSuitClass(card.suit)">
              <div class="card-corner top-left">
                <div class="card-value">{{ card.value }}</div>
                <div class="card-suit" :class="getSuitClass(card.suit)">{{ getSuitSymbol(card.suit) }}</div>
              </div>
              <div class="card-center" :class="getSuitClass(card.suit)">{{ getSuitSymbol(card.suit) }}</div>
              <div class="card-corner bottom-right">
                <div class="card-value">{{ card.value }}</div>
                <div class="card-suit" :class="getSuitClass(card.suit)">{{ getSuitSymbol(card.suit) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button
            class="action-button take-button"
            @click="takeAction(true)"
            :disabled="biddingRound === 2 && !selectedSuit"
        >
          {{ biddingRound === 1 ? 'Prendre' : 'Prendre à' }}
          <span v-if="biddingRound === 2" class="selected-suit">
            {{ selectedSuit ? getSuitSymbol(selectedSuit) : 'Choisir' }}
          </span>
        </button>

        <button
            class="action-button pass-button"
            @click="takeAction(false)"
        >
          Passer
        </button>
      </div>

      <div class="suit-selection" v-if="biddingRound === 2">
        <div class="suit-selector-label">Choisir une couleur:</div>
        <div class="suit-selector">
          <div
              v-for="suit in availableSuits"
              :key="suit"
              class="suit-option"
              :class="{
              'selected': selectedSuit === suit,
              'disabled': suit === trumpCard.suit
            }"
              @click="selectSuit(suit)"
          >
            <span class="suit-symbol" :class="getSuitClass(suit)">
              {{ getSuitSymbol(suit) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BeloteBiddingPhase',
  props: {
    teams: {
      type: Object,
      required: true
    },
    dealer: {
      type: Number,
      default: 0
    },
    humanPlayerIndex: {
      type: Number,
      default: 0 // Position du joueur humain (sud par défaut)
    },
    playerCards: {
      type: Array,
      default: () => [] // Main du joueur actuel
    },
    trumpCard: {
      type: Object,
      required: true // Carte d'atout potentielle déplacée en prop
    }
  },
  data() {
    return {
      biddingRound: 1,
      currentPlayerIndex: 0, // L'index du joueur actuel
      selectedSuit: null,
      suits: ['hearts', 'diamonds', 'clubs', 'spades'],
      playerHand: [] // Copie locale de la main du joueur
    }
  },
  computed: {
    players() {
      // Créer un tableau des joueurs avec leur nom et leur équipe
      return [
        { name: this.teams.team1.player1, team: 1 },
        { name: this.teams.team2.player1, team: 2 },
        { name: this.teams.team1.player2, team: 1 },
        { name: this.teams.team2.player2, team: 2 }
      ]
    },
    availableSuits() {
      // Au second tour, toutes les couleurs sauf celle de l'atout potentiel
      if (this.biddingRound === 2) {
        return this.suits.filter(suit => suit !== this.trumpCard.suit)
      }
      return []
    }
  },
  created() {
    // Initialiser le joueur actuel à l'humanPlayerIndex passé en props
    this.currentPlayerIndex = this.humanPlayerIndex

    // Copier la main du joueur
    this.playerHand = [...this.playerCards]
  },
  watch: {
    // Observer les changements de la main du joueur
    playerCards: {
      handler(newCards) {
        this.playerHand = [...newCards]
      },
      deep: true
    },
    // Observer les changements du joueur humain
    humanPlayerIndex: {
      handler(newIndex) {
        this.currentPlayerIndex = newIndex
      }
    }
  },
  methods: {
    selectSuit(suit) {
      // Ne peut pas sélectionner la même couleur que l'atout potentiel au 2ème tour
      if (this.biddingRound === 2 && suit !== this.trumpCard.suit) {
        this.selectedSuit = suit
      }
    },
    takeAction(isTaking) {
      if (isTaking) {
        // Le joueur prend
        if (this.biddingRound === 1) {
          this.endBidding(this.currentPlayerIndex, this.trumpCard.suit)
        } else {
          // Second tour
          if (this.selectedSuit) {
            this.endBidding(this.currentPlayerIndex, this.selectedSuit)
          }
        }
      } else {
        // Le joueur passe
        // Passer au joueur suivant
        this.nextPlayer()
      }
    },
    nextPlayer() {
      // Passer au joueur suivant dans le sens des aiguilles d'une montre
      const nextPlayer = (this.currentPlayerIndex + 1) % 4

      // Émettre un événement pour indiquer le changement de joueur
      this.$emit('switch-player', { nextPlayer })

      // Mettre à jour le joueur actuel
      this.currentPlayerIndex = nextPlayer

      // Si on a fait un tour complet
      if (this.currentPlayerIndex === (this.dealer + 1) % 4) {
        if (this.biddingRound === 1) {
          // Personne n'a pris au premier tour, passer au second
          this.biddingRound = 2
          this.selectedSuit = null // Réinitialiser la couleur sélectionnée
        } else {
          // Personne n'a pris au second tour, redistribuer
          this.restartBidding()
        }
      }
    },
    endBidding(playerIndex, trumpSuit) {
      // Quelqu'un a pris, la phase de prise est terminée
      // Émettre un événement avec les informations nécessaires pour continuer la partie
      this.$emit('bidding-complete', {
        taker: playerIndex,
        trumpSuit: trumpSuit
      })
    },
    restartBidding() {
      // Personne n'a pris au second tour, il faut redistribuer
      // Changer le distributeur
      const newDealer = (this.dealer + 1) % 4
      this.$emit('restart-bidding', { newDealer })
    },
    getTeamClass(playerIndex) {
      const team = this.players[playerIndex].team
      return team === 1 ? 'team-1' : 'team-2'
    },
    getSuitSymbol(suit) {
      switch(suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
        default: return '';
      }
    },
    getSuitClass(suit) {
      if (suit === 'hearts' || suit === 'diamonds') {
        return 'red-suit';
      }
      return 'black-suit';
    }
  }
}
</script>

<style scoped>
.bidding-phase {
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

/* Styles pour la main du joueur */
.player-hand {
  margin: 15px auto;
  position: relative;
  background-color: rgba(21, 87, 36, 0.5);
  border-radius: 15px;
  padding: 15px 20px 30px 20px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 213, 79, 0.3);
  min-height: 150px;
  overflow: visible;
  width: 350px; /* Largeur fixe de 350px */
}

.hand-cards {
  display: flex;
  height: 120px;
  position: relative;
  margin: 0 auto;
  width: 100%;
  perspective: 1000px;
  overflow: visible;
  min-width: 240px; /* Réduire la largeur minimale */
  display: flex;
  justify-content: center; /* Centrer les cartes */
}

.hand-card {
  position: absolute;
  transition: all 0.3s ease;
  transform-origin: bottom center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.hand-card:hover {
  transform: translateY(-20px) scale(1.1) rotate(0deg) !important;
  z-index: 20;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
}

.mini-card {
  width: 70px;
  height: 110px;
  background-color: white;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.mini-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%);
  pointer-events: none;
}

.mini-card .card-center {
  font-size: 36px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mini-card .card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mini-card .top-left {
  top: 5px;
  left: 5px;
}

.mini-card .bottom-right {
  bottom: 5px;
  right: 5px;
  transform: rotate(180deg);
}

.mini-card .card-value {
  font-size: 16px;
  font-weight: bold;
}

.mini-card .card-suit {
  font-size: 14px;
}

.mini-card.red-suit {
  background: linear-gradient(to bottom, #ffffff, #ffeeee);
}

.mini-card.black-suit {
  background: linear-gradient(to bottom, #ffffff, #eeeeff);
}

.current-player-action {
  margin-bottom: 15px;
}

.action-message {
  text-align: center;
  margin-bottom: 15px;
  font-size: 16px;
  color: #ffd54f;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.action-button {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.take-button {
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  color: white;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.take-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
}

.take-button:disabled {
  background: #4e4e4e;
  cursor: not-allowed;
  box-shadow: none;
}

.pass-button {
  background: linear-gradient(45deg, #f44336, #c62828);
  color: white;
  box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
}

.pass-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(244, 67, 54, 0.7);
}

.selected-suit {
  margin-left: 5px;
  font-size: 20px;
}

.suit-selection {
  margin-top: 15px;
}

.suit-selector-label {
  text-align: center;
  margin-bottom: 8px;
  color: #bdbdbd;
}

.suit-selector {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.suit-option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.suit-option:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.suit-option.selected {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #ffd54f;
}

.suit-option.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.suit-symbol {
  font-size: 30px;
}

.red-suit {
  color: #d32f2f;
}

.black-suit {
  color: #212121;
}

/* Styles responsifs pour mobile */
@media (max-width: 768px) {
  .bidding-phase {
    padding: 12px;
  }

  .player-hand {
    padding: 10px 15px 25px 15px;
    min-height: 130px;
  }

  .hand-cards {
    height: 100px;
  }

  .mini-card {
    width: 60px;
    height: 90px;
  }

  .mini-card .card-center {
    font-size: 28px;
  }

  .mini-card .card-value {
    font-size: 14px;
  }

  .mini-card .card-suit {
    font-size: 12px;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .suit-option {
    width: 40px;
    height: 40px;
  }

  .suit-symbol {
    font-size: 24px;
  }
}

/* Styles pour très petits écrans */
@media (max-width: 480px) {
  .bidding-phase {
    padding: 8px;
  }

  .mini-card {
    width: 50px;
    height: 75px;
  }

  .mini-card .card-center {
    font-size: 22px;
  }

  .mini-card .card-value,
  .mini-card .card-suit {
    font-size: 10px;
  }

  .action-button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .suit-option {
    width: 36px;
    height: 36px;
  }

  .suit-symbol {
    font-size: 20px;
  }

  /* Améliorer la disposition des cartes en main pour petits écrans */
  .hand-card {
    transform: translateY(calc(var(--index, 0) * 5px));
  }

  .hand-cards {
    height: 90px;
  }
}
</style>