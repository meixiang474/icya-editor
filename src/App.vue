<template>
  <div class="app">
    <icya-editor v-model="state" :config="IcyaEditorConfig"></icya-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import data from "./data.json";
import { IcyaEditor, IcyaEditorConfig } from "./packages";
import "./packages/index.scss";

export default defineComponent({
  name: "App",
  components: {
    IcyaEditor,
  },
  setup() {
    const state = ref(data);

    return {
      state,
      IcyaEditorConfig,
    };
  },
});
</script>

<style lang="scss"></style>
