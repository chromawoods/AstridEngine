Vue.component('game-option', {

  data: () => {
    return {
      optionData: {}
    }
  },

  props: ['option-data'],

  mixins: [AE.i18n],

  template: `
    <div class="option-container">
      <div class="option-title">{{translate(optionData.title)}}</div>
      <div class="option-input">
        <custom-checkbox 
          :model="optionData.value"
          @custom-checkbox-changed="onOptionChanged">
        </custom-checkbox>
      </div>
    </div>
  `,

  methods: {

    onOptionChanged: function(eventTarget) {
      this.optionData.value = eventTarget.checked;
      AE.eventBus.$emit('option-changed', this.optionData);
    }

  }

});