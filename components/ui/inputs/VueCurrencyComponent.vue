<template>
  <v-text-field
    density="compact"
    :filled="filled"
    :modelValue="formattedValue"
    ref="inputRef" 
  >  
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
    </template>
  </v-text-field>
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue';

export default {
  props: {
    /**
     * Text to be edited.
     * @model
     */
    modelValue: {
      default: "",
    },
    /**
     * Use full filled background color style.
     */
    filled: {
      type: Boolean,
      default: true,
    },
    /**
     * Currency options
     */
    options: Object,
  },
  setup (props) {
    const {
      inputRef,
      formattedValue
    } = useCurrencyInput(props.options)
    // Ersin:
    // 
    // ! Warning:  don't uncomment here ...
    // 
    // this side managed from form state handler within va-form component
    // 
    // watch(() => props.modelValue, (value) => {
    //   setValue(value)
    // })
    return { inputRef, formattedValue }
  }
};
</script>
