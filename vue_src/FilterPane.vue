<template>
  <div>
    <FilterBar
      id-prefix="filter"
      @filter-request="filterEvents"
    />
  </div>
</template>

<script>
import FilterBar from './FilterBar.vue';
export default {
  components: {
    FilterBar,
  },
  props: {
    seedAction: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    filterEvents(searchParams) {
      const [action, options] = this.seedAction;
      this.$store.dispatch(action, Object.assign(
        {}, options, {filter: searchParams, records: this.$store.getters.recordsPerPage, offset: 0}
      ));
    },
  },
};
</script>
