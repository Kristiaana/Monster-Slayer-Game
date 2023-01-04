function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHP: 100,
      monsterHP: 100,
      roundCount: 0,
      winner: null,
      logs: [],
    };
  },

  ////////////////////// COMPUTED /////////////////////////

  computed: {
    monsterBarStyles() {
      if (this.monsterHP <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHP + "%" };
    },
    playerBarStyles() {
      if (this.playerHP <= 0) {
        return { width: "0%" };
      }
      return { width: this.playerHP + "%" };
    },
    mayUseSA() {
      return this.roundCount % 3 !== 0;
    },
  },

  ////////////////////// WATCHERS /////////////////////////

  watch: {
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },

  ////////////////////// METHODS /////////////////////////

  methods: {
    startGame() {
      this.playerHP = 100;
      this.monsterHP = 100;
      this.roundCount = 0;
      this.winner = null;
      this.logs = [];
    },

    attackMonster() {
      this.roundCount++;
      const lostHP = getRandomValue(5, 12);
      this.monsterHP -= lostHP;
      this.attackPlayer();
      this.addLogs("player", "attack", lostHP);
    },

    attackPlayer() {
      const lostHP = getRandomValue(8, 15);
      this.playerHP -= lostHP;
      this.addLogs("monster", "attack", lostHP);
    },

    specialAttackMonster() {
      this.roundCount++;
      const lostHP = getRandomValue(10, 25);
      this.monsterHP -= lostHP;
      this.attackPlayer();
      this.addLogs("player", "special attack", lostHP);
    },

    healPlayer() {
      this.roundCount++;
      const receivedHP = getRandomValue(8, 20);
      if (this.playerHP + receivedHP > 100) {
        this.playerHP = 100;
      } else {
        this.playerHP += receivedHP;
      }
      this.addLogs("player", "heal", receivedHP);
      this.attackPlayer();
    },

    surrender() {
      this.winner = "monster";
    },

    addLogs(who, what, value) {
      this.logs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
