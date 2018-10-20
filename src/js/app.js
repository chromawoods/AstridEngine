(function(rootScope) {

  AE = rootScope.AE || {};

  function getJson(url) {

    return fetch(url).then(function(response) {
      return response.json();
    });

  }

  function fetchEngineData(entities, path, onComplete) {

    let engineData = {}, 
      numFetched = 0;

    function onEntityFetched(key, data) {
      engineData[key] = data;
      numFetched += 1;
      if (numFetched === entities.length) {
        onComplete.apply(this, [engineData]);
      }
    }

    entities.forEach(el => {

      getJson(path + el + '.json').then(function(jsonData) {
        if (jsonData && typeof rootScope.AE_DATA === 'object' && AE_DATA.hasOwnProperty(el)) {
          jsonData = _.extend(jsonData, rootScope.AE_DATA[el]);
        }
        onEntityFetched(el, jsonData);
      });
  
    });

  }

  function startEngine(engineData) {

    // Add UnderscoreJS to Vue
    Object.defineProperty(Vue.prototype, '$_', { value: rootScope._ });

    // HowlerJS, for sound management
    AE.Howl = rootScope.Howl;

    // Global data store
    AE.store = engineData;
    AE.store.language = engineData.config.gameOptions.defaultLanguage;

    AE.app = new Vue({

      el: '#astrid-engine',

      template: `
        <div class="astrid">
          <main-scene></main-scene>
        </div>
      `,

      created: function() {
        AE.eventBus = new Vue(); // Serves as an independent event bus
      }

    });

  }

  function init() {

    const staticData = rootScope.AE_DATA;
    const defaultJsonPath = 'data/';

    let jsonDataPath = defaultJsonPath;

    if (typeof staticData === 'object' && staticData.hasOwnProperty('config') && staticData.config.hasOwnProperty('jsonDataPath')) {
      jsonDataPath = staticData.config.jsonDataPath;
    }

    fetchEngineData(['config', 'states', 'items', 'translations', 'interactions', 'actions'], jsonDataPath, startEngine);

  }

  document.addEventListener("DOMContentLoaded", init);

}(this));