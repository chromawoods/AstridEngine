Vue.component('interaction-icon', {
  
  props: ['description', 'id', 'image'],

  data: function() {
    return {
      classes: { 
        'interaction-icon': true,
        selected: false
      },
      id: null,
      image: null
    };
  },

  computed: {

    iconSrc: function() {
      return AE.store.config.uiImageDir + this.image;
    },

    cssBackground: function() {
      return 'background-image:url("' + this.iconSrc + '");';
    }

  },

  mixins: [AE.i18n],

  template: `
    <div 
      :style="cssBackground"
      :class="classes"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseout="onMouseOut"></div>
  `,

  methods: {

    onClick: function() {
      this.$emit('interaction-clicked', this);
    },

    onInteractionChosen: function(interaction) {
      this.classes.selected = (this.id === interaction);
    },

    onMouseEnter: function() {
      AE.eventBus.$emit('show-info-message', this.translate('interactions.' + this.id));
    },

    onMouseOut: function() {
      AE.eventBus.$emit('hide-info-message');
    }

  },

  mounted: function() {
    AE.eventBus.$on('interaction-chosen', this.onInteractionChosen);
  }

});