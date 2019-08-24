import {createLocalVue, shallowMount} from '@vue/test-utils';
import Event from '../vue_src/Event';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Event component', () => {
  let eventData;
  let store;

  beforeEach(() => {
    store = new Vuex.Store(storeConfig);
    eventData = {
      id: '123ABC',
      host: 'host1.test.com',
      event_time: 1561199081,
      type: 'login',
      mailbox_address: 'hapless@victim.co.za',
      ip_actor: {
        id: '456DEF',
        ip_address: '10.0.0.1',
        city: 'Cape Town',
        country_code: 'ZA',
        owner: {
          isp: 'Foo ISP',
          organisation: 'Bar Corp',
        },
      },
      latest_assessment: 'confirmed_malicious',
      operations: {
        update: {
          valid_assessments: ['confirmed_benign', 'probably_benign', 'probably_malicious', 'confirmed_malicious'],
        },
      },
      only_for_tests: {
        event_time: new Date(1561199081 * 1000).toLocaleString('default', {timeZoneName: 'short'}),
        type: 'Login',
        assessments_display: ['Confirmed Benign', 'Probably Benign', 'Probably Malicious', 'Confirmed Malicious'],
      },
    };
  });
  it('represents the event as a table row', () => {
    const wrapper = shallowMount(Event, {
      propsData: {
        eventData,
      },
      store,
      localVue,
    });
    expect(wrapper.findAll('tr').length).toBe(1);
  });

  it('populates the table cells with the necessary data', () => {
    const wrapper = shallowMount(Event, {
      propsData: {
        eventData,
      },
      store,
      localVue,
    });

    const tds = wrapper.findAll('tr td');
    expect(tds.length).toBe(4);
    expect(tds.at(0).text()).toBe(eventData.only_for_tests.event_time);
    expect(tds.at(1).text()).toBe('Login');
    expect(tds.at(2).text()).toBe('hapless@victim.co.za');
    expect(tds.at(3).text()).toBe('host1.test.com');
  });

  it('correctly displays the event types', () => {
    let wrapper = shallowMount(Event, {
      propsData: {
        eventData: {type: 'login'},
      },
    });
    expect(wrapper.findAll('tr td').at(1).text()).toBe('Login');

    wrapper = shallowMount(Event, {
      propsData: {
        eventData: {type: 'forward_added'},
      },
    });
    expect(wrapper.findAll('tr td').at(1).text()).toBe('Forward Added');

    wrapper = shallowMount(Event, {
      propsData: {
        eventData: {type: 'forward_removed'},
      },
    });
    expect(wrapper.findAll('tr td').at(1).text()).toBe('Forward Removed');
  });

  it('sets the selectedEventId in the store if the table row is clicked on', () => {
    store.dispatch = jest.fn();
    const wrapper = shallowMount(Event, {
      propsData: {
        eventData,
      },
      store,
      localVue,
    });

    wrapper.find('tr').trigger('click');
    expect(store.getters.selectedEventId).toBe(eventData.id);
  });

  it('initialises the associated events structure for the selected event id', () => {
    store.dispatch = jest.fn();
    const wrapper = shallowMount(Event, {
      propsData: {
        eventData,
      },
      store,
      localVue,
    });

    wrapper.find('tr').trigger('click');
    expect(store.state.associatedEventIds).toStrictEqual({
      '123ABC': {
        byForwardRecipient: [],
        byIpAddress: [],
        byMailboxAddress: [],
      },
    });
  });

  it('asks the store to fetch events associated with the event that was selected', () => {
    store.dispatch = jest.fn();
    const wrapper = shallowMount(Event, {
      propsData: {
        eventData,
      },
      store,
      localVue,
    });

    wrapper.find('tr').trigger('click');
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('fetchAssociatedMailboxEvents', eventData.id);
  });
});
