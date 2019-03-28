(function(rootScope) {

  AE = rootScope.AE || {};

  rootScope._.deepExtend = function(target, source) {
    for (let prop in source) {
        if (prop in target && typeof(target[prop]) == 'object' && typeof(source[prop]) == 'object') {
          rootScope._.deepExtend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
  };

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