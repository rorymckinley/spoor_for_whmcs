import {shallowMount} from '@vue/test-utils';
import AssociatedEvent from '../vue_src/AssociatedEvent';

describe('AssociatedEvent', () => {
  let eventData;
  beforeEach(() => {
    eventData = {
      id: '123ABC',
      host: 'host1.test.com',
      event_time: 1561199081,
      type: 'login',
      mailbox_address: 'hapless@victim.co.za',
      forward_recipient: 'youshouldnotseethisforlogin@test.com',
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
        event_time: '2019-06-22 12:24:41 GMT+2',
        type: 'Login',
        assessment: 'Confirmed Malicious',
        assessments_display: ['Confirmed Benign', 'Probably Benign', 'Probably Malicious', 'Confirmed Malicious'],
      },
    };
  });

  it('creates a table row', () => {
    const wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData,
      },
    });

    expect(wrapper.findAll('tr')).toHaveLength(1);
  });

  it('correctly populates the event details', () => {
    const wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData,
      },
    });

    const tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(0).text()).toBe(eventData.only_for_tests.event_time);
    expect(tableCells.at(1).text()).toBe(eventData.only_for_tests.type);
    expect(tableCells.at(2).text()).toBe(eventData.only_for_tests.assessment);
    expect(tableCells.at(3).text()).toBe(eventData.mailbox_address);
    expect(tableCells.at(4).text()).toBe(eventData.ip_actor.ip_address);
    expect(tableCells.at(5).text()).toBe(eventData.ip_actor.country_code);
    expect(tableCells.at(6).text()).toBe(eventData.forward_recipient);
  });

  it('correctly maps event types', () => {
    let wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData,
      },
    });
    let tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(1).text()).toBe(eventData.only_for_tests.type);

    wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {type: 'forward_added'}),
      },
    });
    tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(1).text()).toBe('Forward Added');


    wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {type: 'forward_removed'}),
      },
    });
    tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(1).text()).toBe('Forward Removed');
  });

  it('correctly maps assessments', () => {
    let wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {latest_assessment: 'confirmed_benign'}),
      },
    });
    let tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(2).text()).toBe('Confirmed Benign');

    wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {latest_assessment: 'probably_benign'}),
      },
    });
    tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(2).text()).toBe('Probably Benign');

    wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {latest_assessment: 'probably_malicious'}),
      },
    });
    tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(2).text()).toBe('Probably Malicious');

    wrapper = shallowMount(AssociatedEvent, {
      propsData: {
        eventData: Object.assign({}, eventData, {latest_assessment: 'confirmed_malicious'}),
      },
    });
    tableCells = wrapper.findAll('tr td');
    expect(tableCells.at(2).text()).toBe('Confirmed Malicious');
  });
});
