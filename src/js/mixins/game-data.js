(function(rootScope) {


  function getJson(url) {

    return fetch(url).then(function(response) {
      return response.json();
    });

  }


  const _defaultSaveData = {
    config: {
      gameOptions: {}
    },
    states: {},
    items: {
      itemsList: [],
      portalsList: []
    },
    actions: {
      combineItems: [],
      use: [],
      look: [],
      speak: [],
      enterState: []
    },
    milestones: []
  };


  let _unsavedData = null;


  AE.gameData = {


    getSavedGameData: function() {

      const savedData = rootScope.localStorage.getItem('AE_SAVE_DATA');

      return savedData ? JSON.parse(savedData) : _defaultSaveData;

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

      let engineData = {};
      let numFetched = 0;

      function onEntityFetched(key, data) {
        engineData[key] = data;
        numFetched += 1;
        if (numFetched === entities.length) {
          engineData.milestones = [];
          onComplete.apply(this, [_.deepExtend(engineData, _unsavedData)]);
        }
      }
  
      _unsavedData = this.getSavedGameData();

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
      AE.app.log('saving game data', dataToSave);
      localStorage.setItem('AE_SAVE_DATA', JSON.stringify(dataToSave));

    },


    saveGameOption: function(optionData) {

      const dataToSave = this.getSavedGameData();

      dataToSave.config = dataToSave.config || { gameOptions: {}};
      dataToSave.config.gameOptions[optionData.key] = optionData.value;

      _.deepExtend(AE.store.config.gameOptions, { [optionData.key]: optionData.value });

      this.saveGameData(dataToSave);

    },


    onActionChanged: function(scope, action) {

      const existingActionIndex = _.findIndex(_unsavedData.actions[scope], existing => { existing.trigger === action.trigger });

      AE.app.log('action changed', arguments);

      if (existingActionIndex >= 0) {
        _unsavedData.actions[scope][existingActionIndex] = action;
      } else {
        _unsavedData.actions[scope].push(action);
      }

    },


    onStateLoaded: function(state) {
      _unsavedData.currentState = state.id;
    },


    /**
     * This method is invoked from app.js, just after the event bus has been created.
     */
    addEventHandlers: function() {

      AE.eventBus.$on('state-loaded', this.onStateLoaded);
      AE.eventBus.$on('action-changed', this.onActionChanged);
      AE.eventBus.$on('option-changed', this.saveGameOption.bind(this));

    }


  };

}(this));
