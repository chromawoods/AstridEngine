Vue.component('scene-portal', {

  data: () => {
    return {
      name: '',
      style: {},
      description: ''
    };
  },

  methods: {

    onClick: function() {
      AE.eventBus.$emit('enter-portal');
    }

  }

});