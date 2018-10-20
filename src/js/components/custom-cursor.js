Vue.component('custom-cursor', {

  data: function() {

    const relRoot = AE.store.config.relRoot;
    const dir = relRoot + '/assets/graphics/ui';
    const interactionsData = AE.store.interactions;

    return {
      x: 0,
      y: 0,
      active: false,
      relRoot: relRoot,
      dir: dir,
      pointer: dir + '/' + interactionsData.pointer,
      interactionsData: interactionsData,
      interactionId: null,
      icon: null
    };

  },

  template: `
    <div class="custom-cursor" v-show="active">
      <img class="cursor-pointer" :src="pointer">
      <img v-if="icon" class="cursor-icon" :src="icon">
    </div>
  `,

  methods: {


    startCursorAnimation: function() {

      let that = this;

      this.active = true;

      requestAnimationFrame(function animateCursor() {
        that.$el.style.transform = 'translate(' + that.x + 'px, ' + that.y + 'px)';
        if (that.active) {
          requestAnimationFrame(animateCursor);
        }
      });

    },


    moveCursor: function(x, y) {

      this.x = x;
      this.y = y;

      if (!this.active) {
        this.startCursorAnimation();
      }

    },


    setIcon: function(icon) {
      this.icon = icon;
    },


    hideCursor: function() {
      this.active = false;
    },


    setCurrentInteractionIcon: function() {
      let interactionIcon = this.getInteractionIcon(this.interactionId);
      interactionIcon && this.setIcon(interactionIcon);
    },


    getInteractionIcon: function(id) {

      let icon = false;
      let interaction = this.$_.findWhere(this.interactionsData.types, { id: id });

      if (interaction) {
        icon = this.dir + '/' + interaction.cursorIcon;
      }

      return icon;

    },


    onInteractionChosen: function(interactionId) {
      this.interactionId = interactionId;
      this.setCurrentInteractionIcon();
    },


    onItemInteraction: function(item) {

      if (item.inventory && this.interactionId === 'use' && !AE.store.usingInventoryItem) {
        this.setIcon(this.relRoot + '/' + item.imageSrc);
      } else {
        this.setCurrentInteractionIcon();
      }

    }


  },

  mounted: function() {
    AE.eventBus.$on('cursor-move', this.moveCursor);
    AE.eventBus.$on('hide-custom-cursor', this.hideCursor);
    AE.eventBus.$on('item-interaction', this.onItemInteraction);
  },

  beforeMount: function() {
    AE.eventBus.$on('interaction-chosen', this.onInteractionChosen);
  }

});