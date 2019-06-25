const DashboardView = require('../src/DashboardView.js');
const jQuery = require('jquery');

const eventsAsData = [
  {
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
  },
  {
    id: '789GHI',
    host: 'host2.test.com',
    event_time: 1561199090,
    type: 'forward_added',
    mailbox_address: 'unwitting@victim.co.za',
    forward_recipient: 'dodgymailbox@gmail.com',
    ip_actor: {
      id: '234ABC',
      ip_address: '10.0.0.2',
      city: 'Reykjavik',
      country_code: 'IS',
      owner: {
        isp: 'Not Foo ISP',
        organisation: 'Not Bar Corp',
      },
    },
  },
  {
    id: '890BVF',
    host: 'host3.test.com',
    event_time: 1561199095,
    type: 'forward_removed',
    mailbox_address: 'protected@victim.co.za',
    forward_recipient: 'dodgymailbox@yahoo.com',
    ip_actor: {
      id: '443ZXY',
      ip_address: '10.0.0.3',
      city: 'Wellington',
      country_code: 'NZ',
      owner: {
        isp: 'Bar ISP',
        organisation: 'Baz Corp',
      },
    },
  },
];
const observer = jest.fn();
const dashboardView = new DashboardView(jQuery, observer);

describe('#init', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="event_listing_panel">
        <table>
        </table>
      </div>
    `;
  });
  it('creates table entries for each event', () => {
    dashboardView.init(eventsAsData);

    const tableEntries = jQuery('#event_listing_panel table tr');
    expect(tableEntries.length).toBe(eventsAsData.length);

    const firstEntry = jQuery(tableEntries[0]);
    expect(firstEntry.attr('event-id')).toBe('123ABC');
    expect(firstEntry.find('td[event-property="event_time"]')[0].innerHTML).toBe(
      'Sat Jun 22 2019 12:24:41 GMT+0200 (SAST)'
    );
    expect(firstEntry.find('td[event-property="type"]')[0].innerHTML).toBe('Login');
    expect(firstEntry.find('td[event-property="mailbox_address"]')[0].innerHTML).toBe('hapless@victim.co.za');

    const secondEntry = jQuery(tableEntries[1]);
    expect(secondEntry.attr('event-id')).toBe('789GHI');
    expect(secondEntry.find('td[event-property="event_time"]')[0].innerHTML).toBe(
      'Sat Jun 22 2019 12:24:50 GMT+0200 (SAST)'
    );
    expect(secondEntry.find('td[event-property="type"]')[0].innerHTML).toBe('Forward Added');

    const thirdEntry = jQuery(tableEntries[2]);
    expect(thirdEntry.find('td[event-property="type"]')[0].innerHTML).toBe('Forward Removed');
  });
  it('adds a listener whch notifies the observer when an event has been clicked', () => {
    dashboardView.init(eventsAsData);

    const targetEvent = jQuery(jQuery('#event_listing_panel table tr')[0]);
    targetEvent.click();

    expect(observer.mock.calls.length).toBe(1);
    expect(observer.mock.calls[0][0]).toStrictEqual(
      {action: 'show_detail', object_type: 'MailboxEvent', id: '123ABC'}
    );
  });
});
