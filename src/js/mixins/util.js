AE.util = {

  methods: {

    getAttrFromString: function(path, haystack) {

      path = path.split('.');
      key = path.shift();

      if (haystack.hasOwnProperty(key)) {
        return path.length ? this.getAttrFromString(path.join('.'), haystack[key]) : haystack[key];
      } else {
        this.throwWarning('could not find object attribute: ', path);
        return undefined;
      }

    }

  }
  
};