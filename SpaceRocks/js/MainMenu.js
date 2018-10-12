var menuState = {
  init: function (score) {
    var score = score || 0;
    this.highestScore = this.highestScore || 0;

    this.highestScore = Math.max(score, this.highestScore);
  },
  create: function () {

    //show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    //give it speed in x
    this.background.autoScroll(-20, 0);

    this.easyButton = this.game.add.button(this.game.width * (1 / 5), this.game.height * (3 / 4), 'easyButton', this.startEasy, this);
    this.easyButton.anchor.setTo(0.5, 0.5);
    this.medButton = this.game.add.button(this.game.width * (1 / 2), this.game.height * (3 / 4), 'mediumButton', this.startMedium, this);
    this.medButton.anchor.setTo(0.5, 0.5);
    this.hardButton = this.game.add.button(this.game.width * (4 / 5), this.game.height * (3 / 4), 'hardButton', this.startHard, this);
    this.hardButton.anchor.setTo(0.5, 0.5);
    //start game text
    var text = "Choose a difficulty to start:";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width / 2, this.game.height / 2, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "Highest score: " + this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };

    var h = this.game.add.text(this.game.width / 2, this.game.height / 2 + 50, text, style);
    h.anchor.set(0.5);
  },
  update: function () {
    //if(this.game.input.activePointer.justPressed()) {
    // this.game.state.start('Game');
    //}
  },

  startEasy: function () {
    SpaceHipster.global.skillLevel = 'EASY';
    this.game.state.start('Game');
  },
  startMedium: function () {
    SpaceHipster.global.skillLevel = 'MEDIUM';
    this.game.state.start('Game');
  },
  startHard: function () {
    SpaceHipster.global.skillLevel = 'HARD';
    this.game.state.start('Game');
  },
};