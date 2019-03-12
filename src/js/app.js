(function(rootScope) {

  AE = rootScope.AE || {};

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
        AE.gameData.addEventHandlers();
      }

    });

  }

  function init() {

    AE.gameData.fetchEngineData(startEngine);

  }

  document.addEventListener("DOMContentLoaded", init);

}(this));