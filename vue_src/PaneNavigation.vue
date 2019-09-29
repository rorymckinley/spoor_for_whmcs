<template>
  <nav>
    <ul class="nav nav-tabs">
      <li
        v-for="pane in panes"
        :key="pane.id"
        role="presentation"
        :class="selectedPane(pane.id) ? 'active' : ''"
        @click="selectPane(pane.id)"
      >
        <a>
          {{ pane.title }}
        </a>
      </li>
      <li
        role="presentation"
        :class="selectedPane('filter') ? 'active' : ''"
        @click="selectPane('filter')"
      >
        <a>Filter</a>
      </li>
    </ul>
  </nav>
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
