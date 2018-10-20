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

    },

    hasArrayDiff: function(arr1, arr2) {

      let isDiff = false;

      if (arr1.length === arr2.length) {
        arr1.forEach((element, index) => {
          if (element !== arr2[index]) {
            isDiff = true;
          }
        });
      } else {
        isDiff = true;
      }

      return isDiff;

    }

  }
  
};