<template>
  <ul>
    <li
      v-for="pane in panes"
      :key="pane.id"
      role="presentation"
      :class="selectedPane(pane.id) ? 'active' : ''"
      @click="selectPane(pane.id)"
    >
      {{ pane.title }}
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    panes() {
      return this.$store.getters.panes;
    },
  },
  methods: {
    selectedPane(paneId) {
      return this.$store.getters.selectedPaneId === paneId;
    },
    selectPane(paneId) {
      this.$store.commit('setSelectedPaneId', paneId);
    },
  },
};
</script>
