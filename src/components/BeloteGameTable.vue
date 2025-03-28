<template>
  <div class="game-table">
    <div class="table-container">
      <!-- Table ronde avec bordure -->
      <div class="table-border">
        <div class="table">
          <!-- Centre de la table -->
          <div class="table-center">
            <div v-if="centerCard" class="center-card">
              <div class="card" :class="getSuitClass(centerCard.suit)">
                <div class="card-corner top-left">
                  <div class="card-value">{{ centerCard.value }}</div>
                  <div class="card-suit" :class="getSuitClass(centerCard.suit)">{{ getSuitSymbol(centerCard.suit) }}</div>
                </div>
                <div class="card-center" :class="getSuitClass(centerCard.suit)">{{ getSuitSymbol(centerCard.suit) }}</div>
                <div class="card-corner bottom-right">
                  <div class="card-value">{{ centerCard.value }}</div>
                  <div class="card-suit" :class="getSuitClass(centerCard.suit)">{{ getSuitSymbol(centerCard.suit) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Joueurs positionnés autour de la table -->
      <div class="player north" :class="{'active': currentPlayer === playerPositions.north}">
        <!-- Indicateur de distributeur -->
        <div v-if="dealer === playerPositions.north" class="player-indicator-wrapper">
          <div class="dealer-indicator">
            <span class="dealer-icon">D</span>
          </div>
        </div>
        <!-- Indicateur de tour de prise -->
        <div v-if="currentPlayer === playerPositions.north" class="player-indicator-wrapper turn-wrapper">
          <div class="turn-indicator">
            <span class="turn-icon">?</span>
          </div>
        </div>
        <div class="player-avatar" :class="getTeamClass(playerPositions.north)">
          <div class="player-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
            </svg>
          </div>
          <div class="player-name">{{ players[playerPositions.north].name }}</div>
        </div>
      </div>

      <div class="player east" :class="{'active': currentPlayer === playerPositions.east}">
        <!-- Indicateur de distributeur -->
        <div v-if="dealer === playerPositions.east" class="player-indicator-wrapper">
          <div class="dealer-indicator">
            <span class="dealer-icon">D</span>
          </div>
        </div>
        <!-- Indicateur de tour de prise -->
        <div v-if="currentPlayer === playerPositions.east" class="player-indicator-wrapper turn-wrapper">
          <div class="turn-indicator">
            <span class="turn-icon">?</span>
          </div>
        </div>
        <div class="player-avatar" :class="getTeamClass(playerPositions.east)">
          <div class="player-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
            </svg>
          </div>
          <div class="player-name">{{ players[playerPositions.east].name }}</div>
        </div>
      </div>

      <div class="player south" :class="{'active': currentPlayer === playerPositions.south}">
        <!-- Indicateur de distributeur -->
        <div v-if="dealer === playerPositions.south" class="player-indicator-wrapper">
          <div class="dealer-indicator">
            <span class="dealer-icon">D</span>
          </div>
        </div>
        <!-- Indicateur de tour de prise -->
        <div v-if="currentPlayer === playerPositions.south" class="player-indicator-wrapper turn-wrapper">
          <div class="turn-indicator">
            <span class="turn-icon">?</span>
          </div>
        </div>
        <div class="player-avatar" :class="getTeamClass(playerPositions.south)">
          <div class="player-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
            </svg>
          </div>
          <div class="player-name">{{ players[playerPositions.south].name }}</div>
        </div>
      </div>

      <div class="player west" :class="{'active': currentPlayer === playerPositions.west}">
        <!-- Indicateur de distributeur -->
        <div v-if="dealer === playerPositions.west" class="player-indicator-wrapper">
          <div class="dealer-indicator">
            <span class="dealer-icon">D</span>
          </div>
        </div>
        <!-- Indicateur de tour de prise -->
        <div v-if="currentPlayer === playerPositions.west" class="player-indicator-wrapper turn-wrapper">
          <div class="turn-indicator">
            <span class="turn-icon">?</span>
          </div>
        </div>
        <div class="player-avatar" :class="getTeamClass(playerPositions.west)">
          <div class="player-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
            </svg>
          </div>
          <div class="player-name">{{ players[playerPositions.west].name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BeloteGameTable',
  props: {
    teams: {
      type: Object,
      required: true
    },
    dealer: {
      type: Number,
      default: 0
    },
    currentPlayer: {
      type: Number,
      default: 1
    },
    centerCard: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      playerPositions: {
        north: 2,
        east: 3,
        south: 0,
        west: 1
      }
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
    }
  },
  methods: {
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
.game-table {
  margin: 0 auto;
  width: 100%;
}

.table-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* Crée un rapport d'aspect carré */
  max-width: 600px; /* Augmentation de la taille maximale */
  margin: 0 auto;
}

.table-border {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #7e5739;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.table {
  width: 95%;
  height: 95%;
  border-radius: 50%;
  background-color: #1a633a;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.5);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table:before {
  content: '';
  position: absolute;
  width: 85%;
  height: 85%;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.table-center {
  position: absolute;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Styles des cartes */
.center-card .card {
  width: 80px;   /* Réduction de la taille de la carte */
  height: 120px; /* Réduction de la taille de la carte */
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.center-card .card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%);
  border-radius: 10px;
  pointer-events: none;
}

.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-left {
  top: 5px;
  left: 5px;
}

.bottom-right {
  bottom: 5px;
  right: 5px;
  transform: rotate(180deg);
}

.card-center {
  font-size: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-value {
  font-size: 14px;
  font-weight: bold;
}

.card-suit {
  font-size: 14px;
}

.red-suit {
  color: #d32f2f;
}

.black-suit {
  color: #212121;
}

/* Positionnement des joueurs */
.player {
  position: absolute;
  width: 30%;
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease;
}

.player.active {
  z-index: 10;
}

.player.active .player-avatar {
  box-shadow: 0 0 15px #ffd54f;
  transform: scale(1.1);
}

/* Positions spécifiques */
.north {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.east {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.south {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.west {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

/* Style des avatars de joueurs */
.player-avatar {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.player-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
}

.player-icon svg {
  width: 30px;
  height: 30px;
  stroke: white;
}

.player-name {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Styles des équipes */
.team-1 {
  border: 2px solid #42a5f5;
  box-shadow: 0 0 10px rgba(66, 165, 245, 0.5);
}

.team-1 .player-icon {
  background-color: rgba(66, 165, 245, 0.3);
}

.team-2 {
  border: 2px solid #ec407a;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.team-2 .player-icon {
  background-color: rgba(236, 64, 122, 0.3);
}

/* Nouveaux styles pour les indicateurs */
.player-indicator-wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 20;
}

.player-indicator-wrapper {
  position: absolute;
  z-index: 20;
}

.north .player-indicator-wrapper {
  top: 50%;
  right: -35px;
  left: auto;
  transform: translateY(-50%);
}

.south .player-indicator-wrapper {
  bottom: 50%;
  right: -35px;
  left: auto;
  transform: translateY(50%);
}

.east .player-indicator-wrapper {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.west .player-indicator-wrapper {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.dealer-indicator, .turn-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0 5px;

}

.dealer-indicator {
  background: #ff9800;
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.7);
}

.turn-indicator {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.7);
}

.turn-wrapper {
  margin-top: 2px; /* Séparation pour éviter la superposition avec l'indicateur de dealer */
}

.dealer-icon, .turn-icon {
  color: white;
  font-weight: bold;
  font-size: 16px;
}



/* Media queries améliorés pour la responsivité */
@media (max-width: 768px) {
  .table-container {
    max-width: 480px;
  }

  .center-card .card {
    width: 70px;
    height: 105px;
  }

  .card-center {
    font-size: 28px;
  }

  .card-value {
    font-size: 12px;
  }

  .card-suit {
    font-size: 12px;
  }

  .table-center {
    width: 150px;
    height: 150px;
  }

  .player-avatar {
    padding: 8px;
  }

  .player-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
  }

  .player-name {
    font-size: 12px;
    max-width: 80px;
  }

  .dealer-indicator, .turn-indicator {
    width: 24px;
    height: 24px;
  }

  .dealer-icon, .turn-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .table-container {
    max-width: 320px;
  }

  .center-card .card {
    width: 60px;
    height: 90px;
  }

  .card-center {
    font-size: 24px;
  }

  .card-value {
    font-size: 10px;
  }

  .card-suit {
    font-size: 10px;
  }

  .table-center {
    width: 100px;
  }

  .player-avatar {
    padding: 5px;
    border-radius: 8px;
  }

  .player-icon {
    width: 32px;
    height: 32px;
  }

  .player-icon svg {
    width: 20px;
    height: 20px;
  }

  .player-name {
    font-size: 10px;
    max-width: 60px;
  }

  .player.active .player-avatar {
    transform: scale(1.05);
  }

  .dealer-indicator, .turn-indicator {
    width: 20px;
    height: 20px;
  }

  .dealer-icon, .turn-icon {
    font-size: 12px;
  }
}
</style>