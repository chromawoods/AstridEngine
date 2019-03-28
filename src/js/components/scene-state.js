Vue.component('scene-state', {

  data: () => {
    return {
      id: '',
      background: '',
      items: [],
      portals: [],
      soundFilenames: []
    }
  },


  computed: {

    backgroundSrc: function() {
      return AE.store.config.backgroundsImageDir + this.background;
    },

    cssBackground: function() {
      return 'background-image:url("' + this.backgroundSrc + '");';
    }

  },
  

  props: ['id', 'items', 'portals', 'soundFilenames', 'background', 'musicFilename'],


  mixins: [AE.soundHandler],


  template: `
    <div 
      :class="'scene-state ' + id" 
      :style="cssBackground">

      <div class="scene-items">

        <scene-item
          v-if="!item.inventory"
          v-for="item in items" 
          :id="item.id"
          :ghost="item.ghost"
          :portal="item.portal"
          :hidden="item.hidden"
          :image="item.image"
          :style="item.style"
          :collectable="item.collectable"
          :inventory="false">
        </scene-item>

        <scene-item
          v-for="portal in portals" 
          :id="portal.id"
          :hidden="portal.hidden"
          :image="portal.image"
          :style="portal.style"
          :inventory="false"
          :portal="{ 'from': portal.from, 'to': portal.to }">
        </scene-item>

      </div>

    </div>
  `,


  methods: {

    unload: function() {
      this.unloadStateSounds();
    },

    loadSounds: function() {

      if (this.soundFilenames && this.soundFilenames.length) {
        this.loadStateSounds(this.soundFilenames);
      }

      if (this.musicFilename) {
        this.playMusic(this.musicFilename);
      }

    },

    load: function() {
      Vue.nextTick().then(this.loadSounds);
    },

    rerender: function() {
      AE.eventBus.$emit('hide-info-message');
      this.$forceUpdate();
    },

    onOptionChanged: function(optionData) {

      if (optionData.key === 'musicOn') {

        if (optionData.value === true) {
          this.playMusic(this.musicFilename);
        } else {
          this.stopMusic();
        }

      }

    }

  },


  beforeMount: function() {
    AE.eventBus.$on('rerender-state', this.rerender.bind(this));
    AE.eventBus.$on('option-changed', this.onOptionChanged.bind(this));
  },


  mounted: function() {
    this.load();
  }

})