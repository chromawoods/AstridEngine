Vue.mixin({

  methods: {

    log: function(message, data, severity) {
      if (AE.store.config.debug) {
        severity = severity || 'log';
        console[severity]('[AE] ' + message, data);
      }
    },

    throwWarning: function(message, data) {
      this.log(message, data, 'warn');
    },

    throwError: function(message, data) {
      this.log(message, data, 'error');
    }

  }

});