Vue.component('main-scene', {

  data: () => {
    return {
      currentInteraction: null,
      inventory: [],
      states: AE.store.states.statesList,
      items: AE.store.items.itemsList,
      portals: AE.store.items.portalsList,
      interactions: AE.store.interactions,
      actions: AE.store.actions,
      gameOptions: AE.store.config.gameOptions,
      defaultStateStyle: {
        width: '100%',
        height: '100%'
      },
      state: {},
      infoMessage: '',
      shouldShowOptions: false
    };
  },

  computed: {

    cssClasses: function() {
      return 'main-scene ' + this.currentInteraction + (this.shouldShowOptions ? ' show-options' : '');
    }

  },

  mixins: [AE.util, AE.actionHandler],

  template: `
    <div :class="cssClasses" 
      @mousemove="onMouseMove"
      @mouseout="onMouseOut">

      <custom-cursor></custom-cursor>
      <options-state :options="gameOptions"></options-state>

      <scene-state ref="state"
        :id="state.id"
        :items="state.items"
        :portals="state.portals"
        :soundFilenames="state.sounds"
        :musicFilename="state.music"
        :background="state.background">
      </scene-state>
      
      <div class="scene-ui">

        <div class="info-bar">
          <span class="info-message" v-if="infoMessage">{{infoMessage}}<span>
        </div>

        <interactions-panel :interactions="interactions" :options="gameOptions"></interactions-panel>

        <inventory-panel :items="inventory"></inventory-panel>
        
        <dialog-panel ref="dialog"></dialog-panel>

      </div>

    </div>
  `,

  methods: {

    getStateItems: function(state) {

      const itemIds = state.itemIds;
      const items = [];
      
      this.$_.each(itemIds, function(id) {
        let match = this.$_.find(this.items, (item) => item.id === id);
        match && items.push(match);
      }.bind(this));

      return items;

    },


    getStatePortals: function(state) {

      const portals = [];

      this.$_.each(this.portals, function(portal, index) {

        if (portal.from === state.id) {
          if (!portal.id) { 
            portal.id = state.id + 'Portal' + index; 
          }
          portals.push(portal);
        }

      }.bind(this));

      return portals;

    },


    loadState: function(state) {

      this.log('load state', state);

      state.items = this.getStateItems(state);
      state.portals = this.getStatePortals(state);

      this.state = state;
      this.$refs.state && this.$refs.state.load();

      AE.eventBus.$emit('state-loaded', state);

    },


    unloadCurrentState: function(onComplete) {

      this.$refs.dialog.hideMessage();
      this.$refs.state.unload();

      onComplete.apply(this);

    },


    enterPortal: function(destination) {

      let that = this;

      const state = this.$_.findWhere(this.states, { id: destination });

      this.unloadCurrentState(() => {
        if (state) {
          this.log('portal destination', destination);
          that.loadState(state);
        } else {
          this.throwError('unknown portal destination', destination);
        }
      });

    },


    getInventory: function() {
      return this.$_.where(this.items, { inventory: true });
    },


    showInfoMessage: function(message) {
      this.infoMessage = message;
    },


    showOptions: function() {
      this.shouldShowOptions = true;
    },


    closeOptions: function() {
      this.shouldShowOptions = false;
    },


    clearInfoMessage: function() {
      this.infoMessage = null;
    },


    onInteractionChosen: function(newInteraction) {
      this.currentInteraction = newInteraction;
    },


    onMouseMove: function(event) {
      const x = event.pageX - this.$el.offsetLeft;
      const y = event.pageY - this.$el.offsetTop;
      AE.eventBus.$emit('cursor-move', x, y);
    },


    onMouseOut: function() {
      AE.eventBus.$emit('hide-custom-cursor');
    }

  },

  beforeMount: function() {

    const currentState = this.$_.findWhere(this.states, { id: AE.store.currentState || AE.store.states.default });

    this.inventory = this.getInventory();

    if (currentState) {
      this.loadState(currentState);
    } else {
      this.throwError('Invalid initial state', currentState);
    }

    AE.eventBus.$on('interaction-chosen', this.onInteractionChosen);
    AE.eventBus.$on('show-info-message', this.showInfoMessage);
    AE.eventBus.$on('hide-info-message', this.clearInfoMessage);
    AE.eventBus.$on('enter-portal', this.enterPortal);
    AE.eventBus.$on('show-options', this.showOptions);
    AE.eventBus.$on('close-options', this.closeOptions);

  }

});