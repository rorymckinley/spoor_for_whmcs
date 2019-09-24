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
                metadata: {offset: 10, records: 20, more_records: true},
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
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.find('div.panel-heading span').text()).toContain('Foo-Bar-Baz');
  });

  it('uses the header to show data pertaining to the metadata', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.find('div.panel-heading span').text()).toContain('Records 11 to 30');
  });

  it('creates page navigation controls', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.findAll('nav[aria-label="foo_bar_baz_event_list pagination"]')).toHaveLength(1);
    expect(wrapper.findAll('li#foo_bar_baz_event_list_older_page')).toHaveLength(1);
    expect(wrapper.findAll('li#foo_bar_baz_event_list_newer_page')).toHaveLength(1);
  });

  it('does not show the newer page link on the first page', () => {
    store.dispatch = stubbedDispatch;
    store.state.paneViews.relevantEvents.metadata.offset = 0;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.find('li#foo_bar_baz_event_list_newer_page').isVisible()).toBeFalsy();
  });

  it('does not show the older page link on the last page', () => {
    store.dispatch = stubbedDispatch;
    store.state.paneViews.relevantEvents.metadata.more_records = false;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    expect(wrapper.find('li#foo_bar_baz_event_list_older_page').isVisible()).toBeFalsy();
  });

  it('can trigger an event to fetch a page of newer events', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    wrapper.find('li#foo_bar_baz_event_list_newer_page').trigger('click');
    expect(wrapper.emitted('fetch-newer-events-page')).toHaveLength(1);
  });

  it('can trigger an event to fetch a page of older events', () => {
    store.dispatch = stubbedDispatch;
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
        title: 'Foo-Bar-Baz',
        seedAction: ['aFunctionToSeedTheList'],
        viewKey: 'relevantEvents',
      },
      store,
      localVue,
    });
    wrapper.find('li#foo_bar_baz_event_list_older_page').trigger('click');
    expect(wrapper.emitted('fetch-older-events-page')).toHaveLength(1);
  });

  it('generates a collection of events for each event id in the specified pane view', async () => {
    store.dispatch = stubbedDispatch;
    expect.assertions(5);
    const wrapper = shallowMount(EventList, {
      propsData: {
        id: 'foo_bar_baz_event_list',
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
        id: 'foo_bar_baz_event_list',
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
        id: 'foo_bar_baz_event_list',
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

