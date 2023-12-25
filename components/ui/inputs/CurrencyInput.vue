<template>
  <va-vue-currency-component 
    density="compact"
    v-bind="commonProps"
    :options="options"
    :variant="variant"
    @update:modelValue="update"
  >
  ></va-vue-currency-component>
</template>

<script>
import Input from "vuetify-admin/src/mixins/input";
import Editable from "vuetify-admin/src/mixins/editable";

export default {
  mixins: [Input, Editable],
  props: {
    /**
     * Currency options
     */
    options: Object,
    /**
     * Use different styles: 
     * 
     * | 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
     */
    variant: {
      type: String,
      default: "filled",
    },
  },
};
</script>
