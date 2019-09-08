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
            paneViews: {
              relevantEvents: {
                ids: ['1A', '1D', '1E'],
              },
            },
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
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.find('div.panel-heading span').text()).toContain('Foo-Bar-Baz');
  });

  it('generates a collection of events for each event id in the specified pane view', async () => {
    store.dispatch = stubbedDispatch;
    expect.assertions(5);
    const wrapper = shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    const events = wrapper.findAll(Event);

    expect(events.length).toBe(3);

    expect(events.at(0).props()).toStrictEqual({
      eventData: {id: '1A', latest_assessment: 'probably_malicious'},
    });
    expect(events.at(1).props()).toStrictEqual({
      eventData: {id: '1D', latest_assessment: 'probably_malicious'},
    });
    expect(events.at(2).props()).toStrictEqual({
      eventData: {id: '1E', latest_assessment: 'probably_malicious'},
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
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });

    wrapper.find('span#refresh_list').trigger('click');
    expect(wrapper.emitted('refresh-list')).toHaveLength(1);
  });

  it('passes through an emitted `mailbox-event-selected` event', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    const events = wrapper.findAll(Event);

    events.at(0).vm.$emit('mailbox-event-selected', '123ABC');
    expect(wrapper.emitted('mailbox-event-selected')).toHaveLength(1);
    expect(wrapper.emitted('mailbox-event-selected')[0]).toEqual(['123ABC']);
  });
});

