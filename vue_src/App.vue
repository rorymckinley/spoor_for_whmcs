<template>
  <div>
    <div>
      <PaneNavigation />
      <Pane
        v-for="pane in panes"
        :title="pane.title"
        :seed-action="pane.seedAction"
        :key="pane.title"
        v-show="selectedPane(pane.id)"
      />
    </div>
  </div>
</template>

<script>
import Pane from './Pane.vue';
import PaneNavigation from './PaneNavigation.vue';
export default {
  components: {
    Pane,
    PaneNavigation,
  },
  computed: {
    panes() {
      return this.$store.getters.panes;
    },
  },
  mounted() {
    this.panes.forEach((pane) => {
      this.$store.dispatch(...pane.seedAction);
    });
  },
  methods: {
    selectedPane(paneId) {
      return this.$store.getters.selectedPaneId === paneId;
    },
  },
};
</script>
