const SOUND = {

    enabled: true,

    sounds: [

        "sounds/hey.mp3",

        "sounds/tada.mp3",

        "sounds/applause.mp3"

    ],

    playRandom() {

        if (!this.enabled) return;

        const file =
            this.sounds[Math.floor(Math.random() * this.sounds.length)];

        new Audio(file).play();

    }

};
