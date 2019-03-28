Vue.component('game-option', {

  data: () => {
    return {
    };
  },

  props: ['option-data'],

  mixins: [AE.i18n],

  template: `
    <div class="option-container">
      <span class="option-title">{{translate(optionData.title)}}</span>
      <span class="option-input">
        <input type="checkbox" 
          v-model="optionData.value"
          @change="() => AE.eventBus.$emit('option-changed', this.optionData)">
      </span>
    </div>
  `

});