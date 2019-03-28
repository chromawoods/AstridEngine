AE.soundHandler = {

  data: function() {
    return {
      soundPath: AE.store.config.soundsDir,
      musicPath: AE.store.config.musicDir,
      sounds: {
        global: [],
        state: []
      },
      currentMusic: { name: false, howl: false }
    };
  },

  methods: {


    loadHowlSounds: function(scope, sounds) {

      this.sounds[scope] = this.$_.map(sounds, function(soundName) {

        const src = this.soundPath + soundName;

        return {
          name: soundName,
          howl: new AE.Howl({ src: src })
        };

      }.bind(this));

    },


    loadGlobalSounds: function(sounds) {
      this.loadHowlSounds('global', sounds);
    },


    loadStateSounds: function(sounds) {
      this.loadHowlSounds('state', sounds);
    },


    unloadStateSounds: function() {

      this.$_.each(this.sounds.state, function(soundObj) {
        soundObj.howl.unload();
      });

    },


    getSoundObject: function(scope, soundName) {
      return this.$_.findWhere(this.sounds[scope], { name: soundName });
    },


    playHowlSound: function(soundObj) {

      this.log('play sound', soundObj.name);

      if (soundObj) {
        soundObj.howl.play();
      } else {
        this.throwError('Invalid sound: ' + soundObj.name);
      }

    },


    unloadMusic: function() {

      if (this.currentMusic.howl) {
        this.currentMusic.howl.unload();
        this.currentMusic.name = false;
      }

    },


    stopMusic: function() {

      if (this.currentMusic.howl && this.currentMusic.howl.playing()) {
        this.currentMusic.howl.stop();
        this.currentMusic.name = false;
      }

      return this;

    },


    playMusic: function(musicName) {

      if (AE.store.config.gameOptions.musicOn && this.currentMusic.name !== musicName) {

        const src = this.musicPath + musicName;

        this.unloadMusic();
        
        this.currentMusic = {
          name: musicName,
          howl: new Howl({
            src: src,
            loop: true
          })
        };

        this.log('play music', this.currentMusic);

        this.playHowlSound(this.currentMusic);

      }
      
    },


    playStateSound: function(soundName) {

      if (AE.store.config.gameOptions.soundOn) {
        const soundObj = this.getSoundObject('state', soundName);
        this.playHowlSound(soundObj);
      }

    },


    playGlobalSound: function(soundName) {

      if (AE.store.config.gameOptions.soundOn) {
        const soundObj = this.getSoundObject('global', soundName);
        this.playHowlSound(soundObj);
      }

    }


  },

  mounted: function() {
    AE.eventBus.$on('play-global-sound', this.playGlobalSound);
    AE.eventBus.$on('play-state-sound', this.playStateSound);
  }

};