<template>
  <div>
    <div>
      <PaneNavigation />
      <Pane
        title="Probably Malicious Events"
        :seed-action="['fetchProbablyMaliciousEvents']"
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
};
</script>
