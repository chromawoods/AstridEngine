Vue.component('interactions-panel', {

  data: () => {
    return {
      interactions: {}
    };
  },

  props: ['interactions'],

  methods: {

    setInteraction: function(interactionId) {
      AE.eventBus.$emit('interaction-chosen', interactionId);
      this.log('set interaction:', interactionId);
    },

    interactionChosen: function(interaction) {
      this.setInteraction(interaction.id);
    },

    getClasses: function(i) {
      return i.classes;
    }
    
  },

  template: `
    <div class="interactions-panel" :interactions="interactions">

      <interaction-icon 
        v-for="interaction in interactions.types" 
        :id="interaction.id"
        :image="interaction.uiIcon"
        :class="interaction.id"
        :description="interaction.description"
        v-on:interaction-clicked="interactionChosen(interaction)">
      </interaction-icon>

    </div>
  `,

  mounted: function() {
    this.setInteraction(this.interactions.defaultInteraction);
  }

});