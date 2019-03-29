Vue.component('game-option', {

  props: ['option-data'],

  mixins: [AE.i18n],

  template: `
    <div class="option-container">
      <div class="option-title">{{translate(optionData.title)}}</div>
      <div class="option-input">
        <input type="checkbox" 
          v-model="optionData.value"
          @change="() => AE.eventBus.$emit('option-changed', this.optionData)">
      </div>
    </div>
  `

});