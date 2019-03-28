(function(rootScope) {


  function getJson(url) {

    return fetch(url).then(function(response) {
      return response.json();
    });

  }


  const _unsavedData = {};


  AE.gameData = {


    getSavedGameData: function() {

      const savedData = rootScope.localStorage.getItem('AE_SAVE_DATA');

      return savedData ? JSON.parse(savedData) : {};

    },


    getJsonDataPath: function() {

      const staticData = rootScope.AE_DATA;
      const defaultJsonPath = 'data/';
  
      let jsonDataPath = defaultJsonPath;
  
      if (typeof staticData === 'object' && staticData.hasOwnProperty('config') && staticData.config.hasOwnProperty('jsonDataPath')) {
        jsonDataPath = staticData.config.jsonDataPath;
      }

      return jsonDataPath;

    },


    fetchEngineData: function(onComplete) {

      const entities = ['config', 'states', 'items', 'translations', 'interactions', 'actions'];
      const savedData = this.getSavedGameData();

      let engineData = {};
      let numFetched = 0;

      function onEntityFetched(key, data) {
        engineData[key] = data;
        numFetched += 1;
        if (numFetched === entities.length) {
          onComplete.apply(this, [_.deepExtend(engineData, savedData)]);
        }
      }
  
      entities.forEach(el => {
  
        getJson(this.getJsonDataPath() + el + '.json').then(function(jsonData) {
          if (jsonData && typeof rootScope.AE_DATA === 'object' && AE_DATA.hasOwnProperty(el)) {
            jsonData = _.deepExtend(jsonData, rootScope.AE_DATA[el]);
          }
          onEntityFetched(el, jsonData);
        });
    
      });

    },


    saveGameData: function(dataToSave) {

      dataToSave = dataToSave || _unsavedData;
      
      localStorage.setItem('AE_SAVE_DATA', JSON.stringify(dataToSave));

    },


    saveGameOption: function(optionData) {

      const dataToSave = this.getSavedGameData();

      dataToSave.config = dataToSave.config || {};
      dataToSave.config.gameOptions = dataToSave.config.gameOptions || {};
      dataToSave.config.gameOptions[optionData.key] = optionData.value;

      _.deepExtend(AE.store.config.gameOptions, { [optionData.key]: optionData.value });

      this.saveGameData(dataToSave);

    },


    /**
     * This method is invoked from app.js, just after the event bus has been created.
     */
    addEventHandlers: function() {

      AE.eventBus.$on('state-loaded', state => {
        _unsavedData.currentState = state.id;
      });

      AE.eventBus.$on('option-changed', this.saveGameOption.bind(this));

    }


  };

}(this));
