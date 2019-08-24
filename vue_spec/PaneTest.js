import {createLocalVue, shallowMount} from '@vue/test-utils';
import Pane from '../vue_src/Pane.vue';
import EventList from '../vue_src/EventList.vue';
import EventDetail from '../vue_src/EventDetail.vue';
import AssociatedEventsContainer from '../vue_src/AssociatedEventsContainer';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('A pane component', () => {
  let store;
  const seedAction = ['aFunctionToSeedTheList', {option: 'some value'}];
  const viewKey = 'seedKey';

  beforeEach(() => {
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
        {
          state: {
            events: [
              {id: '1A', latest_assessment: 'probably_malicious'},
              {id: '1B', latest_assessment: 'probably_benign'},
              {id: '1C', latest_assessment: 'probably_benign'},
              {id: '1D', latest_assessment: 'probably_malicious'},
              {id: '1E', latest_assessment: 'probably_malicious'},
            ],
            probablyMaliciousEventIds: ['1A', '1D', '1E'],
            selectedEventId: null,
          },
        },
      )
    );
    store.dispatch = jest.fn();
  });

  it('calls the seedAction with any parameters when the Pane is mounted', () => {
    shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
      },
      store,
      localVue,
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(seedAction[0], {option: 'some value', viewKey});
  });

  it('creates a event list instance', () => {
    const wrapper = shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
      },
      store,
      localVue,
    });

    const eventListInstances = wrapper.findAll(EventList);
    expect(eventListInstances.length).toBe(1);
    const props = eventListInstances.at(0).props();
    expect(props).toEqual({
      title: 'Some crazy stuff',
      seedAction,
      viewKey,
    });
  });

  describe('when a refresh is requested for the list of events', () => {
    it('triggers a call to the backend', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      wrapper.find(EventList).vm.$emit('refresh-list');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch.mock.calls[1]).toEqual([seedAction[0], {option: 'some value', viewKey}]);
    });
  });

  it('does not display the event detail if an event has not been selected', () => {
    const wrapper = shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
      },
      store,
      localVue,
    });

    expect(wrapper.findAll(EventDetail)).toHaveLength(0);
  });

  it('does not display the associated events listing if an event has not been selected', () => {
    const wrapper = shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
      },
      store,
      localVue,
    });

    expect(wrapper.findAll(AssociatedEventsContainer)).toHaveLength(0);
  });

  describe('when an event is selected', () => {
    test('it makes the event detail pane visible', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', '1C');

      expect(wrapper.findAll(EventDetail)).toHaveLength(1);
    });

    test('it passes the detail for the selected event to the detail component', () => {
      const eventData = store.state.events.find((event) => event.id === '1C');
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', '1C');

      expect(wrapper.find(EventDetail).props()).toStrictEqual({
        eventData,
      });
    });

    test('it makes the associated events container visible', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', '1C');

      expect(wrapper.findAll(AssociatedEventsContainer)).toHaveLength(1);
    });
  });

  describe('when a mailbox event is updated', () => {
    it('triggers an update to the backend', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      store.commit('setSelectedEventId', '1C');

      wrapper.find(EventDetail).vm.$emit('mailbox-event-update', '1C', {assessment: 'foo_bar_baz'});
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        'updateMailboxEvent', {mailboxEventId: '1C', mailboxEvent: {assessment: 'foo_bar_baz'}}
      );
    });
  });
});
