<template>
  <div>
    <Pane
      title="Probably Malicious Events"
      :seed-action="['fetchProbablyMaliciousEvents']"
    />
  </div>
</template>

<script>
import Pane from './Pane.vue';
export default {
  components: {
    Pane,
  },
};
</script>
