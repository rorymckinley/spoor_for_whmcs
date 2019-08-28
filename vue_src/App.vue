<template>
  <div>
    <div>
      <PaneNavigation />
      <Pane
        v-for="pane in panes"
        v-show="selectedPane(pane.id)"
        :id="pane.id"
        :key="pane.id"
        :title="pane.title"
        :seed-action="pane.seedAction"
        :view-key="pane.viewKey"
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
  methods: {
    selectedPane(paneId) {
      return this.$store.getters.selectedPaneId === paneId;
    },
  },
};
</script>
