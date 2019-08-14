window.requestPath = 'https://far/bar/baz';

import {createLocalVue, shallowMount} from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Vuex from 'vuex';
import EventList from '../vue_src/EventList';
import Event from '../vue_src/Event';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Event list component', () => {
  let store;
  const stubbedDispatch = jest.fn((action) => {
    if (action !== 'aFunctionToSeedTheList') {
      throw new Error(`Unexpected action ${action}`);
    }
  });

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
          },
        },
      )
    );
  });

  it('sets the header based on the property', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
      },
      store,
      localVue,
    });
    expect(wrapper.find('div.panel-heading span').text()).toContain('Foo-Bar-Baz');
  });

  it('fetches and renders EventSummary items for each event returned from the backend', () => {
    store.dispatch = stubbedDispatch;
    shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
      },
      store,
      localVue,
    });

    expect(store.dispatch).toHaveBeenCalledWith('aFunctionToSeedTheList');
  });

  it('generates a collection of events for each probably malicious event', async () => {
    store.dispatch = stubbedDispatch;
    expect.assertions(3);
    const wrapper = shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
      },
      store,
      localVue,
    });
    const events = wrapper.findAll(Event);

    expect(events.length).toBe(3);

    expect(events.at(0).props()).toStrictEqual({
      eventData: {id: '1A', latest_assessment: 'probably_malicious'},
    });

    store.commit('setEventAssessment', {id: '1A', assessment: 'probably_benign'});

    await flushPromises();

    const updatedEvents = wrapper.findAll(Event);
    expect(updatedEvents.at(0).props()).toStrictEqual({
      eventData: {id: '1A', latest_assessment: 'probably_benign'},
    });
  });

  it('emits an event to refresh the list of probably malicious events', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
      },
      store,
      localVue,
    });

    wrapper.find('span#refresh_list').trigger('click');
    expect(wrapper.emitted('refresh-list')).toHaveLength(1);
  });
});

