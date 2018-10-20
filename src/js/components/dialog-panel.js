Vue.component('dialog-panel', {

  data: () => {
    return {
      message: '',
      timer: null,
      minDelay: 1500
    };
  },

  computed: {

    delay: function() {
      return this.minDelay + (this.message.length * 50);
    }

  },

  mixins: [AE.i18n],

  template: `
    <div class="dialog-panel" v-if="message" @click="hideMessage">{{message}}</div>
  `,

  methods: {

    hideMessage: function() {
      this.message = '';
      clearTimeout(this.timer);
    },

    printMessage: function(message) {

      clearTimeout(this.timer);

      this.message = message;
      this.timer = setTimeout(this.hideMessage, this.delay);
      this.log('print dialog:', message);

    },

    printFromKey: function(key, fallbackKey) {
      let message = this.translate(key) || this.translate(fallbackKey);
      message && this.printMessage(message);
    },

    printItemAttr: function(item, attr) {
      let message = this.translate('items.' + item.id + '.' + attr) || this.translate('items.default.' + attr);
      this.printMessage(message);
    }

  },

  mounted: function() {
    AE.eventBus.$on('print-from-key', this.printFromKey);
    AE.eventBus.$on('print-item-attribute', this.printItemAttr);
    AE.eventBus.$on('print-message', this.printMessage);
  }

});