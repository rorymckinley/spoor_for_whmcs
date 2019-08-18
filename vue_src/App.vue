<template>
  <div>
    <div>
      <PaneNavigation />
      <Pane
        v-for="pane in panes"
        :title="pane.title"
        :seed-action="pane.seed_action"
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
  computed: {
    panes() {
      return this.$store.getters.panes;
    },
  },
  components: {
    Pane,
    PaneNavigation,
  },
  methods: {
    selectedPane(paneId) {
      return this.$store.getters.selectedPaneId === paneId;
    },
  },
};
</script>
