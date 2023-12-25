<template>
  <div :class="class">
    <v-data-table
      :headers="headers"
      :items="getItems"
    >
      <template v-slot:top>
        <v-row no-gutters>
          <v-col lg="6" align="left">
            <h4 class="h4 mb-2">{{ title }}</h4>
          </v-col>
          <v-col lg="6" align="right">
            <v-btn variant="plain" @click="createRowForm()" color="success" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-slot:headers="{ columns }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              {{ getTitleLabel(column) }}
            </th>
          </template>
        </tr>
      </template>

      <template
        v-for="field in getFields"
        v-slot:[`item.${field.source}`]="{ item }"
      >
        <template v-if="item._new || item[primaryKey] === editRowId">
            <!-- input elements -->
          <div class="mt-5">
            <slot name="edit" v-bind="{ field, editRowId }" />
          </div>
        </template>
        <template v-else>
          <span
            v-if="field.type == 'select'"
            :key="field.source"
            >
            {{ getSelectLabel(item, field.source) }}
          </span>
          <span v-else-if="field.type">
            <component
              :key="field.source"
              :source="field.sourceLabel ? field.sourceLabel : field.source"
              :is="`va-${field.type}-field`"
              :resource="resource"
              :item="item"
              variant="outlined"
              v-bind="checkProperty(field, 'options', 'source') ? getOptions(field.options, item[field.options.source]) : field.attributes"
              v-slot="props"
            >
              <slot
                :name="`field.${field.source}`"
                :item="props.item || item"
                v-bind="props"
              ></slot>
            </component>
          </span>
          <span v-else>
            <slot :name="`field.${field.source}`" v-bind="{ item, value }">
              {{ item[field.source] }}
            </slot>
          </span>
        </template>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          size="small"
          class="mr-2"
          v-if="item._new || item[primaryKey] === editRowId"
          @click="saveItem()"
          style="font-size: 1.2rem !important;"
        >
          mdi-content-save
        </v-icon>
        <v-icon
          size="small"
          v-if="item._new || item[primaryKey] === editRowId"
          @click="cancel"
          style="font-size: 1.2rem !important;"
        >
          mdi-close
        </v-icon>
        <v-icon
          size="small"
          v-if="!item._new && item[primaryKey] != editRowId"
          @click="editItem(item)"
          style="font-size: 1.2rem !important;"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          v-if="!item._new && item[primaryKey] != editRowId"
          @click="deleteItem(item)"
          style="font-size: 1.2rem !important;"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #bottom></template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"></v-card-title>
        <v-card-text>
          {{ $t("dialog.deleteConfirm") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cancel">{{ $t("dialog.closeDeleteButton") }}</v-btn>
          <v-btn color="green darken-1" text @click="deleteConfirm">{{ $t("dialog.confirmDeleteButton") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Input from "vuetify-admin/src/mixins/input";
import Resource from "vuetify-admin/src/mixins/resource";

/**
 * Array layout for array elements
 */
export default {
  mixins: [Input, Resource],
  inject: {
    v$: {
      default: null
    }
  },
  props: {
    class: {
      type: String,
      default() {
        return "va-array-table-input mb-5"
      },
    },
    title: {
      type: String,
    },
    headers: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: [],
    },
    primaryKey: {
      type: String
    },
    generateUid: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogDelete: false,
      form: null,
      editedIndex: -1,
      editRowId: null,
      editItems: [],
    }
  },
  computed: {
    getItems() {
      if (this.form && !this.editRowId) {
        let items = [{ _new: true }, ...this.editItems];
        return items;
      }
      return this.editItems;
    },
    getFields() {
      let fields = this.fields
        .map((f) => {
          return typeof f === "string"
            ? {
                source: f,
              }
            : f;
        })
        .map((f) => {
          return {
            ...f,
            type: f.type,
            label: f.label || this.admin.getSourceLabel(
              this.resource,
              f.labelKey || f.source
            ),
          };
        });
      fields[this.primaryKey] = null;
      return fields;
    },
  },
  created() {
    // update input
    this.editItems = Array.isArray(this.input) ? this.input : [];
  },
  watch: {
    dialogDelete(val) {
      val || this.close();
    },
    editItems: {
      handler(newValue) { // https://vuejs.org/guide/essentials/watchers.html#deep-watchers
        this.update(newValue);
      },
      deep: true
    }
  },
  methods: {
    checkProperty(field, prop1, prop2) {
      if (Object.prototype.hasOwnProperty.call(field, prop1)) {
        if (Object.prototype.hasOwnProperty.call(field[prop1], prop2)) {
           return true
        }
      }
      return false
    },
    getOptions(fieldOptions, fieldValue) {
      let opt = { options: {} } // fieldOptions.id fieldValue
      opt.options[fieldOptions.id] = fieldValue 
      if (! fieldValue && typeof fieldOptions.default != 'undefined') {
        opt.options[fieldOptions.id] = fieldOptions.default
      }
      if (Object.prototype.hasOwnProperty.call(fieldOptions, 'extra')) {
          for (const [key, value] of Object.entries(fieldOptions.extra)) {
            opt.options[key] = value
          }
      }
      return opt
    },
    getTitleLabel(column) {
      if (column.title) {
        return column.title;
      } else if (column.key) {
        return this.admin.getSourceLabel(this.resource, column.key);  
      }
      return
    },
    getSelectLabel(item, source) {
      if (item 
        && item[source] 
        && typeof item[source]["name"]) {
        return item[source].name
      }
      return null
    },
    editItem(item) {
      this.createRowForm("edit", item);
      this.editedIndex = this.editItems.indexOf(item);
    },
    createRowForm(action = "new", item = null) {
      this.form = this.fields
        .map((f) => f.source)
        .reduce((o, source) => {
          return {
            ...o,
            [source]: item ? item[source] : null,
          };
        }, {});
      if (action == "new") {
        this.editRowId = null;
        if (this.generateUid) {
          this.form[this.primaryKey] = this.createUid();
        }
      } else {
        this.editRowId = item ? item[this.primaryKey] : null;
      }
      this.$store.commit(`${this.resource}/setRow`, this.form);
    },
    saveItem() {
      const Self = this;
      let invalid = false;
      this.getFields.forEach(function(val){
        Self.v$['form'][val.source].$touch();
        if (Self.v$['form'][val.source].$invalid) {
          invalid = true
        }  
      })
      if (invalid) {
        return;
      }
      if (this.editedIndex > -1) {
        Object.assign(this.editItems[this.editedIndex], this.form);
      } else {
        this.editItems.push(this.form);
      }
      this.update(this.input);
      this.$store.commit(`${this.resource}/setRow`, null); // reset form variable
      this.close();
    },
    deleteItem(item) {
      this.editedIndex = this.editItems.indexOf(item);
      this.dialogDelete = true;
    },
    deleteConfirm() {
      this.editItems.splice(this.editedIndex, 1);
      this.$store.commit(`${this.resource}/setRow`, null); // reset form variable
      this.update(this.input);
      this.close();
    },
    cancel() {
      this.close();
    },
    close() {
      this.$nextTick(async () => {
        this.editedIndex = -1;
        this.v$.$reset();
      });
      this.form = null;
      this.editRowId = null;
      this.dialogDelete = false;
    },
    createUid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  },

};
</script>