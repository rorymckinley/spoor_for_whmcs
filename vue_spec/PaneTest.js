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
  const paneId = 'foo';
  const selectedEventId = '1C';

  beforeEach(() => {
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
        {
          state: {
            associatedEventIds: {
            },
            events: [
              {id: '1A', latest_assessment: 'probably_malicious'},
              {id: '1B', latest_assessment: 'probably_benign'},
              {id: '1C', latest_assessment: 'probably_benign'},
              {id: '1D', latest_assessment: 'probably_malicious'},
              {id: '1E', latest_assessment: 'probably_malicious'},
            ],
            paneViews: {
              seedKey: {
                ids: [],
                metadata: {offset: 20, records: 10, more_records: false},
              },
            },
            probablyMaliciousEventIds: ['1A', '1D', '1E'],
            panes: [
              {id: 'foo', selectedEventId: null},
              {id: 'bar', selectedEventId: null},
            ],
            recordsPerPage: 3,
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
        id: paneId,
      },
      store,
      localVue,
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      seedAction[0], {option: 'some value', viewKey, records: store.state.recordsPerPage, offset: 0}
    );
  });

  it('creates a event list instance', () => {
    const wrapper = shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
        id: paneId,
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
      id: `${paneId}_event_list`,
    });
  });

  describe('when a refresh is requested for the list of events', () => {
    it('triggers a call to the backend with the current offset', () => {
      store.state.paneViews.seedKey.metadata.offset = 99;
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      wrapper.find(EventList).vm.$emit('refresh-list');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch.mock.calls[1]).toEqual(
        [seedAction[0], {option: 'some value', viewKey, records: store.state.recordsPerPage, offset: 99}]
      );
    });
  });

  it('does not display the event detail if an event has not been selected', () => {
    const wrapper = shallowMount(Pane, {
      propsData: {
        title: 'Some crazy stuff',
        seedAction,
        viewKey,
        id: paneId,
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
        id: paneId,
      },
      store,
      localVue,
    });

    expect(wrapper.findAll(AssociatedEventsContainer)).toHaveLength(0);
  });

  describe('the EventList emits a `mailbox-event-selected` event', () => {
    it('sets the selectedEventId when the EventList emits a `mailbox-event-selected` event', () =>{
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });

      const eventList = wrapper.find(EventList);
      eventList.vm.$emit('mailbox-event-selected', '123ABC');
      expect(store.getters.selectedEventId(paneId)).toEqual('123ABC');
    });

    it('initialises the associated events structure for the selected event id', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });

      const eventList = wrapper.find(EventList);
      eventList.vm.$emit('mailbox-event-selected', '123ABC');

      expect(store.state.associatedEventIds).toStrictEqual({
        '123ABC': {
          byForwardRecipient: [],
          byIpAddress: [],
          byMailboxAddress: [],
        },
      });
    });

    it('asks the store to fetch events associated with the event that was selected', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      const eventList = wrapper.find(EventList);
      eventList.vm.$emit('mailbox-event-selected', '123ABC');

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith('fetchAssociatedMailboxEvents', '123ABC');
    });
  });

  describe('when an event is selected', () => {
    test('it makes the event detail pane visible', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', {paneId, selectedEventId});

      expect(wrapper.findAll(EventDetail)).toHaveLength(1);
    });

    test('it passes the detail for the selected event to the detail component', () => {
      const eventData = store.state.events.find((event) => event.id === selectedEventId);
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', {paneId, selectedEventId});

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
          id: paneId,
        },
        store,
        localVue,
      });
      store.commit('setSelectedEventId', {paneId, selectedEventId});

      expect(wrapper.findAll(AssociatedEventsContainer)).toHaveLength(1);
      const container = wrapper.find(AssociatedEventsContainer);
      expect(container.props()).toStrictEqual({
        selectedEventId,
        prefix: paneId,
      });
    });
  });

  describe('when a mailbox event is updated', () => {
    it('triggers an update to the backend', () => {
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      store.commit('setSelectedEventId', {paneId, selectedEventId});

      wrapper.find(EventDetail).vm.$emit('mailbox-event-update', '1C', {assessment: 'foo_bar_baz'});
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        'updateMailboxEvent', {mailboxEventId: '1C', mailboxEvent: {assessment: 'foo_bar_baz'}}
      );
    });
  });

  describe('fetching events for other pages', () => {
    it('fetches a page of newer events', () => {
      const nextOffset = store.state.paneViews.seedKey.metadata.offset - store.state.recordsPerPage;
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      wrapper.find(EventList).vm.$emit('fetch-newer-events-page');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch.mock.calls[1]).toEqual(
        [seedAction[0], {option: 'some value', viewKey, records: store.state.recordsPerPage, offset: nextOffset}]
      );
    });
    it('fetches a page of older events', () => {
      const nextOffset = store.state.paneViews.seedKey.metadata.offset + store.state.recordsPerPage;
      const wrapper = shallowMount(Pane, {
        propsData: {
          title: 'Some crazy stuff',
          seedAction,
          viewKey,
          id: paneId,
        },
        store,
        localVue,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1); // On mounting

      wrapper.find(EventList).vm.$emit('fetch-older-events-page');
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch.mock.calls[1]).toEqual(
        [seedAction[0], {option: 'some value', viewKey, records: store.state.recordsPerPage, offset: nextOffset}]
      );
    });
  });
});
