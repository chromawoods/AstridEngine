AE.i18n = {

  data: () => {
    return {
      translations: AE.store.translations,
      language: AE.store.language
    };
  },

  mixins: [AE.util],

  methods: {

    translate: function(path) {

      if (this.translations.hasOwnProperty(this.language)) {
        let message = this.getAttrFromString(path, this.translations[this.language]) || '';
        this.log('translate key:', [path, message]);
        return message;
      } else {
        this.throwError('unknown language: ', this.language);
      }
      
    }
    
  }

};