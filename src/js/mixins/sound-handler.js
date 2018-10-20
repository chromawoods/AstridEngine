AE.soundHandler = {

  data: function() {
    return {
      path: AE.store.config.soundsDir,
      sounds: {
        global: [],
        state: []
      }
    };
  },

  methods: {


    loadHowlSounds: function(scope, sounds) {
console.log(arguments);
      this.sounds[scope] = this.$_.map(sounds, function(sound) {

        let src = this.path + sound;

        return {
          sound: sound,
          howl: new AE.Howl({ src: src })
        };

      }.bind(this));

    },


    loadGlobalSounds: function(sounds) {
      this.loadHowlSounds('global', sounds);
    },


    loadStateSounds: function(sounds) {
      console.log("helo!");
      this.loadHowlSounds('state', sounds);
    },


    unloadStateSounds: function() {

      this.$_.each(this.sounds.state, function(soundObj) {
        soundObj.howl.unload();
      });

    },


    playHowlSound: function(scope, sound) {

      this.log('play ' + scope + ' sound', sound);
console.log(this.sounds);
      let soundObj = this.$_.findWhere(this.sounds[scope], { sound: sound });

      if (soundObj) {
        soundObj.howl.play();
      } else {
        this.throwError('Invalid ' + scope + ' sound: ' + sound);
      }

    },


    playStateSound: function(sound) {
      this.playHowlSound('state', sound);
    },


    playGlobalSound: function(sound) {
      this.playHowlSound('global', sound);
    }


  },

  mounted: function() {
    AE.eventBus.$on('play-global-sound', this.playGlobalSound);
    AE.eventBus.$on('play-state-sound', this.playStateSound);
  }

};