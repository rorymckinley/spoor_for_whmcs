import {createLocalVue, shallowMount} from '@vue/test-utils';
import FilterBar from '../vue_src/FilterBar';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('a SearchBar component', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
      )
    );
  });

  describe('Submitting a search request', () => {
    it('can search for all events after a given date and time', () => {
      const selectedDate = new Date(2019, 8, 1, 8, 0, 0);
      const wrapper = shallowMount(FilterBar, {
        propsData: {
          idPrefix: 'foo',
        },
        localVue,
        store,
      });

      const startDate = wrapper.find('input#foo_search_bar_date_start');
      startDate.setValue('2019-09-01');
      const startTime = wrapper.find('input#foo_search_bar_time_start');
      startTime.setValue('08:00');
      wrapper.find('button#foo_search_bar_submit').trigger('click');

      expect(wrapper.emitted('filter-request')).toHaveLength(1);
      expect(wrapper.emitted('filter-request')[0]).toStrictEqual([
        {event_time: {start: selectedDate.getTime() / 1000}},
      ]);
    });
  });
  it('contains fields to search by event time', () => {
    const wrapper = shallowMount(FilterBar, {
      propsData: {
        idPrefix: 'foo',
      },
      localVue,
    });

    expect(wrapper.findAll('input#foo_search_bar_date_start')).toHaveLength(1);
    expect(wrapper.find('input#foo_search_bar_date_start').attributes('type')).toStrictEqual('date');
    expect(wrapper.findAll('input#foo_search_bar_time_start')).toHaveLength(1);
    expect(wrapper.find('input#foo_search_bar_time_start').attributes('type')).toStrictEqual('time');

    expect(wrapper.findAll('input#foo_search_bar_date_end')).toHaveLength(1);
    expect(wrapper.find('input#foo_search_bar_date_end').attributes('type')).toStrictEqual('date');
    expect(wrapper.findAll('input#foo_search_bar_time_end')).toHaveLength(1);
    expect(wrapper.find('input#foo_search_bar_time_end').attributes('type')).toStrictEqual('time');
  });
});
