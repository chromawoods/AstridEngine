Vue.component('options-state', {

  data: () => {
    return {
      options: {}
    };
  },

  props: ['options'],

  mixins: [AE.i18n],

  computed: {

    optionsToRender: function() {

      const renderOpts = [];

      this.options.hasSound && renderOpts.push({
        key: 'soundOn',
        title: 'options.soundTitle',
        type: 'boolean',
        value: this.options.soundOn
      });

      this.options.hasMusic && renderOpts.push({
        key: 'musicOn',
        title: 'options.musicTitle',
        type: 'boolean',
        value: this.options.musicOn
      });

      return renderOpts;

    }

  },

  template: `
    <div class="options-state">
      <span class="close-symbol" @click="() => AE.eventBus.$emit('close-options')"></span>
      <h1>{{translate('options.mainTitle')}}</h1>

      <game-option
        v-for="renderOpt in optionsToRender" 
        :option-data="renderOpt">
      </game-option>

    </div>
  `

});