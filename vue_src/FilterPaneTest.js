import {createLocalVue, shallowMount} from '@vue/test-utils';
import FilterBar from '../vue_src/FilterBar.vue';
import FilterPane from '../vue_src/FilterPane.vue';
// import EventList from '../vue_src/EventList.vue';
// import EventDetail from '../vue_src/EventDetail.vue';
// import AssociatedEventsContainer from '../vue_src/AssociatedEventsContainer';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';
//
const localVue = createLocalVue();
localVue.use(Vuex);

describe('a FilterPane component', () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
      )
    );
    store.dispatch = jest.fn();
  });
  it('contains a FilterBar', () => {
    const wrapper = shallowMount(FilterPane, {
      propsData: {
        viewKey: 'fooEvents',
        seedAction: ['seedAction', {foo: 'bar'}],
      },
      localVue,
      store,
    });

    expect(wrapper.findAll(FilterBar)).toHaveLength(1);
    const filterBarProps = wrapper.find(FilterBar).props();
    expect(filterBarProps).toStrictEqual({
      idPrefix: 'filter',
    });
  });

  it('triggers a filter action if one is requested', () => {
    const wrapper = shallowMount(FilterPane, {
      propsData: {
        viewKey: 'fooEvents',
        seedAction: ['seedAction', {foo: 'bar'}],
      },
      localVue,
      store,
    });

    wrapper.find(FilterBar).vm.$emit('filter-request', {filter: {start_time: 1567317600}, offset: 0});
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      'seedAction', {foo: 'bar', filter: {start_time: 1567317600}, offset: 0, records: store.getters.recordsPerPage},
    );
  });
});
