Vue.component('inventory-panel', {

  data: () => {
    return {
      items: {}
    };
  },

  props: ['items'],

  template: `
    <div class="inventory-panel">

        <scene-item 
          v-for="item in items"
          :class="'is-inventory'" 
          :id="item.id" 
          :image="getItemImage(item)"
          :hidden="false"
          :inventory="true">
        </scene-item>

    </div>
  `,

  methods: {

    getItemImage: function(item) {
      return item.inventoryImage || item.image || false;
    },

    collectItem: function(item) {
      item.inventory = true;
      this.items.push(item);
      this.log('collect item', item);
    }

  },

  mounted: function() {
    AE.eventBus.$on('collect-item', this.collectItem);
  }

});