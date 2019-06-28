const DashboardView = require('../src/DashboardView.js');
const jQuery = require('jquery');
const dvsh = require('./DashboardViewSpecHelper');

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
    only_for_tests: {
      event_time: 'Sat Jun 22 2019 12:24:41 GMT+0200 (SAST)',
      type: 'Login',
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
    only_for_tests: {
      event_time: 'Sat Jun 22 2019 12:24:50 GMT+0200 (SAST)',
      type: 'Forward Added',
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
    only_for_tests: {
      event_time: 'Sat Jun 22 2019 12:24:55 GMT+0200 (SAST)',
      type: 'Forward Removed',
    },
  },
];
const observer = jest.fn();
const dashboardView = new DashboardView(jQuery);
dashboardView.addObserver(observer);

describe('#init', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="event_listing_panel">
        <table>
        </table>
      </div>
      <div id="event_detail_panel">
      </div>
    `;
  });
  it('creates table entries for each event', () => {
    dashboardView.init(eventsAsData);

    dvsh.validateTableRecords({
      table: jQuery('#event_listing_panel table'),
      events: eventsAsData,
      fields: [
        ['event_time', (event) => event.only_for_tests.event_time],
        ['type', (event) => event.only_for_tests.type],
        ['mailbox_address', 'mailbox_address'],
        ['host', 'host'],
      ],
      jQuery: jQuery,
    });
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

describe('displayMailboxEventDetail', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="event_listing_panel">
        <table>
        </table>
      </div>
      <div class="panel panel-default" id="event_detail_panel" style="display:none">
        <div class="panel-heading">Event Details</div>

        <table class="table">
          <tr>
            <th colspan=2>Event</td>
            <th colspan=2>IP Data</th>
          </tr>
          <tr>
            <td>Time</td>
            <td event-detail-item='event_time'></td>
            <td>Ip Address</td>
            <td event-detail-item='ip_ip_address'></td>
          </tr>
          <tr>
            <td>Type</td>
            <td event-detail-item='type'></td>
            <td>City</td>
            <td event-detail-item='ip_city'>
            </td>
          </tr>
          <tr>
            <td>Mailbox Address</td>
            <td event-detail-item='mailbox_address'></td>
            <td>Country Code</td>
            <td event-detail-item='ip_country_code'></td>
          </tr>
          <tr>
            <td>Host</td><td event-detail-item='host'></td><td colspan=2>Owner</td>
          </tr>
          <tr>
            <td>Forward Recipient</td>
            <td event-detail-item='forward_recipient'></td>
            <td>ISP</td>
            <td event-detail-item='ip_isp'></td>
          </tr>
          <tr>
            <td>Assessment</td>
            <td event-detail-item='assessment'>Probably Malicious</td>
            <td>Organisation</td>
            <td event-detail-item='ip_organisation'></td>
          </tr>
        </table>
      </div>

      <div class="panel panel-default col-sm-4" id="event_mailbox_associated_events_panel" style="display:none">
        <div class="panel-heading">Events Associated with the Mailbox Address</div>
        <div class="panel-overlay">Loading Data</div>

        <table class="table">
        </table>
      </div>

      <div class="panel panel-default col-sm-4" id="event_ip_actor_associated_events_panel" style="display:none">
        <div class="panel-heading">...</div>
        <div class="panel-overlay">...</div>

        <table class="table">
        </table>
      </div>

      <div class="" id="event_forward_recipient_associated_events_panel" style="display:none">
        <div class="panel-heading">...</div>
        <div class="panel-overlay">...</div>

        <table class="table">
        </table>
      </div>
    `;
  });
  it('makes the detail panel visible', () => {
    dashboardView.displayMailboxEventDetail(eventsAsData[0]);

    expect(jQuery('#event_detail_panel').css('display')).toBe('block');
  });
  it('populates the event detail panel', () => {
    dashboardView.displayMailboxEventDetail(eventsAsData[0]);

    expect(jQuery('td[event-detail-item="event_time"]')[0].innerHTML).toBe(
      (new Date(eventsAsData[0].event_time * 1000)).toString()
    );
    expect(jQuery('td[event-detail-item="type"]')[0].innerHTML).toBe('Login');
    expect(jQuery('td[event-detail-item="mailbox_address"]')[0].innerHTML).toBe(eventsAsData[0].mailbox_address);
    expect(jQuery('td[event-detail-item="host"]')[0].innerHTML).toBe(eventsAsData[0].host);
    expect(jQuery('td[event-detail-item="forward_recipient"]')[0].innerHTML).toBe('');
    expect(jQuery('td[event-detail-item="assessment"]')[0].innerHTML).toBe('Probably Malicious');

    expect(jQuery('td[event-detail-item="ip_ip_address"]')[0].innerHTML).toBe(eventsAsData[0].ip_actor.ip_address);
    expect(jQuery('td[event-detail-item="ip_city"]')[0].innerHTML).toBe(eventsAsData[0].ip_actor.city);
    expect(jQuery('td[event-detail-item="ip_country_code"]')[0].innerHTML).toBe(eventsAsData[0].ip_actor.country_code);
    expect(jQuery('td[event-detail-item="ip_isp"]')[0].innerHTML).toBe(eventsAsData[0].ip_actor.owner.isp);
    expect(jQuery('td[event-detail-item="ip_organisation"]')[0].innerHTML).toBe(
      eventsAsData[0].ip_actor.owner.organisation
    );

    dashboardView.displayMailboxEventDetail(eventsAsData[1]);
    expect(jQuery('td[event-detail-item="type"]')[0].innerHTML).toBe('Forward Added');

    dashboardView.displayMailboxEventDetail(eventsAsData[2]);
    expect(jQuery('td[event-detail-item="type"]')[0].innerHTML).toBe('Forward Removed');
  });
  it('makes the mailbox associated events panel visible', () => {
    dashboardView.displayMailboxEventDetail(eventsAsData[0]);

    expect(jQuery('#event_mailbox_associated_events_panel').css('display')).toBe('block');
  });

  it('makes the ip associated events panel visible', () => {
    dashboardView.displayMailboxEventDetail(eventsAsData[0]);

    expect(jQuery('#event_ip_actor_associated_events_panel').css('display')).toBe('block');
  });

  it('makes the forward recipient associated events panel visible', () => {
    dashboardView.displayMailboxEventDetail(eventsAsData[0]);

    expect(jQuery('#event_forward_recipient_associated_events_panel').css('display')).toBe('block');
  });
});

describe('#displayMailboxAssociatedEvents', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="panel-group" id="associated_events" role="tablist" aria-multiselectable="true">
        <div class="panel panel-default">
          <div class="panel-heading">...</div>
          <div id="associated_by_mailbox_content">
            <div class="panel-body">
              No Data
            </div>
          </div>
        </div>
      </div>
    `;
  });
  it('opens the mailbox events detail panel', () => {
    dashboardView.displayMailboxAssociatedEvents(eventsAsData);

    expect(jQuery('#associated_by_mailbox_content').hasClass('in')).toBeTruthy();
  });
  it('populates the mailbox associated events panel', () => {
    dashboardView.displayMailboxAssociatedEvents(eventsAsData);

    dvsh.validateTable({
      table: jQuery('#associated_by_mailbox_content .panel-body table'),
      events: eventsAsData,
      fields: [
        ['event_time', 'Event Time', (event) => event.only_for_tests.event_time],
        ['type', 'Type', (event) => event.only_for_tests.type],
        ['ip_ip_address', 'IP Address', (event) => event.ip_actor.ip_address],
        ['ip_country_code', 'IP Country Code', (event) => event.ip_actor.country_code],
      ],
      jQuery: jQuery,
    });
  });
});

describe('#displayIpActorAssociatedEvents', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="panel-group" id="associated_events" role="tablist" aria-multiselectable="true">
        <div class="panel panel-default">
          <div class="panel-heading">...</div>
          <div id="associated_by_ip_content">
            <div class="panel-body">
              No Data
            </div>
          </div>
        </div>
      </div>
    `;
  });
  it('opens the ip actor events detail panel', () => {
    dashboardView.displayIpActorAssociatedEvents(eventsAsData);

    expect(jQuery('#associated_by_ip_content').hasClass('in')).toBeTruthy();
  });
  it('populates the ip associated events panel', () => {
    dashboardView.displayIpActorAssociatedEvents(eventsAsData);

    dvsh.validateTable({
      table: jQuery('#associated_by_ip_content .panel-body table'),
      events: eventsAsData,
      fields: [
        ['event_time', 'Event Time', (event) => event.only_for_tests.event_time],
        ['type', 'Type', (event) => event.only_for_tests.type],
        ['mailbox_address', 'Mailbox Address', (event) => event.mailbox_address],
      ],
      jQuery: jQuery,
    });
  });
});

describe('#displayForwardRecipientAssociatedEvents', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="panel-group" id="associated_events" role="tablist" aria-multiselectable="true">
        <div class="panel panel-default">
          <div class="panel-heading">...</div>
          <div id="associated_by_forward_recipient_content">
            <div class="panel-body">
              No Data
            </div>
          </div>
        </div>
      </div>
    `;
  });
  it('opens the forward recipient events detail panel', () => {
    dashboardView.displayForwardRecipientAssociatedEvents(eventsAsData);

    expect(jQuery('#associated_by_forward_recipient_content').hasClass('in')).toBeTruthy();
  });
  it('populates the forward recipient events detail table', () => {
    dashboardView.displayForwardRecipientAssociatedEvents(eventsAsData);

    dvsh.validateTable({
      table: jQuery('#associated_by_forward_recipient_content .panel-body table'),
      events: eventsAsData,
      fields: [
        ['event_time', 'Event Time', (event) => event.only_for_tests.event_time],
        ['type', 'Type', (event) => event.only_for_tests.type],
        ['mailbox_address', 'Mailbox Address', 'mailbox_address'],
        ['ip_ip_address', 'IP Address', (event) => event.ip_actor.ip_address],
        ['ip_country_code', 'IP Country Code', (event) => event.ip_actor.country_code],
      ],
      jQuery: jQuery,
    });
  });
});
