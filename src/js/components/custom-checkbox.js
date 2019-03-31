Vue.component('custom-checkbox', {

  props: ['model'],

  template: `
    <label class="custom-checkbox">
      <input type="checkbox" 
        v-model="model"
        @change="$emit('custom-checkbox-changed', $event.target)">
        <div class="custom-checkbox-dummy">&#10004;</div>
      </label>
  `

});