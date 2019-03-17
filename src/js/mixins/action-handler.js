AE.actionHandler = {

  data: () => {
    return {
      allowedResultMethods: [
        'removeItems', 
        'removeItem', 
        'hideItem',
        'unhideItem',
        'collectItem',
        'printMessageFromKey', 
        'playSound',
        'delay'
      ],
      allowedActionMethods: [
        'combineItems',
        'use',
        'look',
        'speak',
        'enterState'
      ]
    };
  },

  mixins: [AE.i18n],

  methods: {


    populateActions: function(actions) {
      this.actions = actions;
    },


    removeItem: function(id) {

      this.log('removeItem', id);

      let item = this.getItem(id);

      item.ghost = true;
      item.hidden = true;

      AE.eventBus.$emit('rerender-state');

    },


    hideItem: function(id) {

      this.log('hideItem', id);

      let item = this.getItem(id);

      item.hidden = true;

      AE.eventBus.$emit('rerender-state');

    },


    unhideItem: function(id) {

      this.log('unhideItem', id);

      let item = this.getItem(id);

      item.hidden = false;

      AE.eventBus.$emit('rerender-state');

    },


    removeItems: function() {
      [].slice.call(arguments).forEach(this.removeItem);
    },


    getItem: function(id) {
      return this.$_.findWhere(AE.store.items.itemsList, { id: id });
    },


    getStateItem: function(id) {
      return this.$_.findWhere(this.items, { id: id });
    },


    collectItem: function(id) {

      let item = this.getItem(id);

      item.inventory = true;

      AE.eventBus.$emit('collect-item', item);
      AE.eventBus.$emit('rerender-state');
      
    },


    playSound: function(sound) {
      AE.eventBus.$emit('play-state-sound', sound);
    },


    executeActionResults: function(action, resultIndex) {

      resultIndex = resultIndex || 0;

      const currentResult = action.results[resultIndex].split(':');
      const resultFnName = currentResult.shift();
      const self = this;

      function checkActionMilestone() {
        if (action.reachMilestone) {
          let milestones = AE.store.milestones;
          milestones = milestones || [];
          milestones.push(action.reachMilestone);
        }
      }

      function nextResult() {
        resultIndex += 1;
        if (resultIndex >= action.results.length) {
          checkActionMilestone();
        } else {
          self.executeActionResults(action, resultIndex)
        }
      }

      if (this.allowedResultMethods.indexOf(resultFnName) >= 0) {
        if (resultFnName !== 'delay') {
          this[resultFnName].apply(this, currentResult[0].split(','));
          nextResult();
        } else {
          setTimeout(nextResult, currentResult[0]);
        }

      }

    },


    getActionScope: function(scopeId) {

      let scope = false;

      if (this.actions.hasOwnProperty(scopeId)) {
        scope = this.actions[scopeId];
      } else {
        this.throwWarning('invalid action scope', scopeId);
      }

      return scope;

    },


    getAction: function(scopeId, trigger) {

      let action = false;
      let scope = this.getActionScope(scopeId);

      trigger = (typeof trigger === 'string') ? [trigger] : trigger;

      if (scope) {
        for (let i = 0; i < scope.length; i++) {
          if (this.hasArrayDiff(scope[i].trigger.split(','), trigger) === false) {
            action = scope[i];
            break;
          }
        }
      }

      return action;

    },


    combineItems: function(itemIds) {

      let action = this.getAction('combineItems', itemIds);

      if (action) {
        this.executeActionResults(action);
      } else {
        AE.eventBus.$emit('print-message', this.translate('actions.default'));
      }

      AE.store.usingInventoryItem = false;

    },


    printMessageFromKey: function(key) {
      AE.eventBus.$emit('print-from-key', key);
    },


    handleInventoryInteraction: function(item, interaction) {

      let isInventoryInteraction = false;

      if (AE.store.usingInventoryItem) {
        AE.eventBus.$emit('action', 'combineItems', [item.id, AE.store.usingInventoryItem]);
        isInventoryInteraction = true;
      }
      else if (item.inventory && interaction === 'use') {
        AE.store.usingInventoryItem = item.id;
        isInventoryInteraction = true;
      }

      return isInventoryInteraction;

    },


    getInteractionMessage: function(item, interaction) {

      const defaultMessage = this.translate('items.' + item.id + '.' + interaction) || this.translate('items.default.' + interaction);

      let message = defaultMessage;

      if (item.inventory) {
        message = this.translate('items.' + item.id + '.' + interaction + 'Inventory') || defaultMessage;
      }

      return message;

    },


    onStateLoaded: function(state) {

      let action = this.getAction('enterState', state.id);

      if (action) {
        this.executeActionResults(action);
      }

    },


    onAction: function() {

      let args = [].slice.call(arguments);
      let eventId = args.shift();

      if (this.allowedActionMethods.indexOf(eventId) >= 0) {
        this.log('action event:', eventId);
        this[eventId].apply(this, args);
      } else {
        this.throwWarning('illegal action', eventId);
      }

    },

    
    onItemInteraction: function(item) {

      let interaction = this.currentInteraction;

      if (!this.handleInventoryInteraction(item, interaction)) {

        let action = this.getAction(interaction, item.id);

        if (action && !item.inventory) {
          this.executeActionResults(action);
        }
        else if (interaction === 'use' && item.collectable) {
          this.collectItem(item.id);
        }
        else {
          let message = this.getInteractionMessage(item, interaction);
          AE.eventBus.$emit('print-message', message);
        }

      }

    }

  },

  mounted: function() {
    AE.eventBus.$on('action', this.onAction);
    AE.eventBus.$on('item-interaction', this.onItemInteraction);
    AE.eventBus.$on('state-loaded', this.onStateLoaded);
  }

};