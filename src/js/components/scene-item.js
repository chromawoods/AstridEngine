Vue.component('scene-item', {

  data: () => {
    return {
      style: {},
      ghost: false,
      collectable: false,
      hidden: false,
      image: false,
      imageDir: AE.store.config.itemsImageDir,
      inventory: false,
      portal: false
    };
  },

  computed: {

    name: function() {
      return this.translate('items.' + this.id + '.name');
    },

    classes: function() {
      return 'scene-item' 
        + (this.isPortal ? ' scene-portal' : '')
        + (this.ghost ? ' is-ghost' : '')
        + (this.inventory ? ' is-inventory' : '');
    },

    imageSrc: function() {
      return this.image ? (this.imageDir + this.image) : false;
    }

  },

  props: ['ghost', 'hidden', 'collectable', 'id', 'style', 'image', 'inventory', 'portal'],

  mixins: [AE.i18n],

  template: `

    <img v-if="image"
      v-show="!hidden"
      :alt="name"
      :src="imageSrc"
      :class="classes" 
      :ghost="ghost"
      :inventory="inventory"
      :style="style" 
      :id="id"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseout="onMouseOut"/>
    <div v-else
      v-show="!hidden"
      :data-name="name"
      :class="classes" 
      :ghost="ghost"
      :inventory="inventory"
      :style="style" 
      :id="id"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseout="onMouseOut">
    </div>
  `,

  methods: {

    removeItem: function() {
      this.ghost = true;
      this.hidden = true;
    },

    collectItem: function() {
      this.inventory = true;
    },

    onClick: function() {

      if (this.ghost) { return; }

      if (this.portal) {
        AE.eventBus.$emit('enter-portal', this.portal.to);
      } else {
        AE.eventBus.$emit('item-interaction', this);
      }

    },

    onMouseEnter: function() {
      AE.eventBus.$emit('show-info-message', this.name);
    },

    onMouseOut: function() {
      AE.eventBus.$emit('hide-info-message');
    }

  }
  
});