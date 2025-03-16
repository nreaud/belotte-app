<template>
  <div class="game-table">
    <div class="table-container">
      <div class="table">
        <!-- Position Nord -->
        <div class="player-position north">
          <div class="player-avatar" :class="{'active': currentPlayer === playerPositions.north}">
            <div class="player-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="player-name">{{ players[playerPositions.north].name }}</div>
            <div class="team-indicator" :class="getTeamClass(playerPositions.north)"></div>
          </div>
        </div>

        <!-- Position Ouest -->
        <div class="player-position west">
          <div class="player-avatar" :class="{'active': currentPlayer === playerPositions.west}">
            <div class="player-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="player-name">{{ players[playerPositions.west].name }}</div>
            <div class="team-indicator" :class="getTeamClass(playerPositions.west)"></div>
          </div>
        </div>

        <!-- Centre de la table -->
        <div class="table-center">
          <div v-if="centerCard" class="center-card">
            <div class="card">
              <span class="card-value">{{ centerCard.value }}</span>
              <span class="card-suit" :class="getSuitClass(centerCard.suit)">{{ getSuitSymbol(centerCard.suit) }}</span>
            </div>
          </div>
        </div>

        <!-- Position Est -->
        <div class="player-position east">
          <div class="player-avatar" :class="{'active': currentPlayer === playerPositions.east}">
            <div class="player-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="player-name">{{ players[playerPositions.east].name }}</div>
            <div class="team-indicator" :class="getTeamClass(playerPositions.east)"></div>
          </div>
        </div>

        <!-- Position Sud -->
        <div class="player-position south">
          <div class="player-avatar" :class="{'active': currentPlayer === playerPositions.south}">
            <div class="player-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div class="player-name">{{ players[playerPositions.south].name }}</div>
            <div class="team-indicator" :class="getTeamClass(playerPositions.south)"></div>
          </div>
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
  margin-bottom: 20px;
}

.table-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin: 0 auto;
}

.table {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a633a;
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(0, 0, 0, 0.3);
  border: 15px solid #7e5739;
}

.player-position {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 120px;
}

.north {
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
}

.south {
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
}

.east {
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
}

.west {
  left: -50px;
  top: 50%;
  transform: translateY(-50%);
}

.player-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.player-avatar.active {
  box-shadow: 0 0 15px #ffd54f;
  transform: scale(1.05);
}

.player-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
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
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-indicator {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 5px;
  border-radius: 2px;
}

.team-1 {
  background-color: #42a5f5;
  box-shadow: 0 0 10px rgba(66, 165, 245, 0.7);
}

.team-2 {
  background-color: #ec407a;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.7);
}

.table-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-card .card {
  width: 70px;
  height: 105px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-value {
  font-size: 30px;
  font-weight: bold;
  position: absolute;
  top: 5px;
  left: 10px;
}

.card-suit {
  font-size: 40px;
  position: absolute;
  bottom: 5px;
  right: 10px;
}

.red-suit {
  color: #d32f2f;
}

.black-suit {
  color: #212121;
}
</style>