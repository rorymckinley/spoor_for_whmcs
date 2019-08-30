window.spoorLocalisation = 'en-us';

import {shallowMount} from '@vue/test-utils';
import EventDetail from '../vue_src/EventDetail.vue';

describe('EventDetail', () => {
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
        event_time: new Date(1561199081 * 1000).toLocaleString('default', {timeZoneName: 'short'}),
        type: 'Login',
        assessments_display: ['Confirmed Benign', 'Probably Benign', 'Probably Malicious', 'Confirmed Malicious'],
      },
    };
  });

  it('populates the fields with the relevant data', () => {
    const wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData,
      },
    });

    expect(wrapper.find('td[event-detail-item="event_time"]').text()).toBe(eventData.only_for_tests.event_time);
    expect(wrapper.find('td[event-detail-item="ip_ip_address"]').text()).toBe('10.0.0.1');
    expect(wrapper.find('td[event-detail-item="type"]').text()).toBe('Login');
    expect(wrapper.find('td[event-detail-item="ip_city"]').text()).toBe('Cape Town');
    expect(wrapper.find('td[event-detail-item="mailbox_address"]').text()).toBe('hapless@victim.co.za');
    expect(wrapper.find('td[event-detail-item="ip_country_code"]').text()).toBe('ZA');
    expect(wrapper.find('td[event-detail-item="host"]').text()).toBe('host1.test.com');
    expect(wrapper.find('td[event-detail-item="forward_recipient"]').text()).toBe(
      'youshouldnotseethisforlogin@test.com'
    );
    expect(wrapper.find('td[event-detail-item="ip_isp"]').text()).toBe('Foo ISP');
    expect(wrapper.find('td[event-detail-item="ip_organisation"]').text()).toBe('Bar Corp');
  });

  it('correctly maps the event type', () => {
    let wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData,
      },
    });
    expect(wrapper.find('td[event-detail-item="type"]').text()).toBe('Login');

    wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData: Object.assign(eventData, {type: 'forward_added'}),
      },
    });
    expect(wrapper.find('td[event-detail-item="type"]').text()).toBe('Forward Added');

    wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData: Object.assign(eventData, {type: 'forward_removed'}),
      },
    });
    expect(wrapper.find('td[event-detail-item="type"]').text()).toBe('Forward Removed');
  });

  it('correctly builds the assessment selector', () => {
    const wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData,
      },
    });

    const assessmentOptions = wrapper.findAll('td[event-detail-item="assessment"]  select option');
    expect(assessmentOptions).toHaveLength(4);
    expect([
      assessmentOptions.at(0).element.value,
      assessmentOptions.at(1).element.value,
      assessmentOptions.at(2).element.value,
      assessmentOptions.at(3).element.value,
    ]).toStrictEqual(eventData.operations.update.valid_assessments);
    expect([
      assessmentOptions.at(0).text(),
      assessmentOptions.at(1).text(),
      assessmentOptions.at(2).text(),
      assessmentOptions.at(3).text(),
    ]).toStrictEqual(eventData.only_for_tests.assessments_display);
    const selectedAssessment = wrapper.find('td[event-detail-item="assessment"] select option:checked');
    expect(selectedAssessment.element.value).toBe(eventData.latest_assessment);
  });

  it('emits an event when the assessment status has been changed', () => {
    const wrapper = shallowMount(EventDetail, {
      propsData: {
        eventData: Object.assign(eventData, {latest_assessment: 'probably_malicious'}),
      },
    });

    wrapper.find('option[value="confirmed_malicious"]').setSelected();
    expect(wrapper.emitted('mailbox-event-update')).toHaveLength(1);
    expect(wrapper.emitted('mailbox-event-update')[0]).toStrictEqual([
      eventData.id,
      {assessment: 'confirmed_malicious'},
    ]);
  });
});
