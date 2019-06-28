const DashboardController = require('../src/DashboardController.js');

const dataStore = {
  fetchProbablyMaliciousMailboxEvents: jest.fn(),
  fetchEventsForMailbox: jest.fn(),
  fetchEventsForIpActor: jest.fn(),
  fetchEventsForForwardRecipient: jest.fn(),
};
const dashboardView = {
  init: jest.fn(),
  addObserver: jest.fn(),
  displayMailboxEventDetail: jest.fn(),
  displayMailboxAssociatedEvents: jest.fn(),
  displayIpActorAssociatedEvents: jest.fn(),
  displayForwardRecipientAssociatedEvents: jest.fn()
};

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
    id: '789',
    host: 'host2.test.com',
    event_time: 1561199090,
    type: 'forward_added',
    mailbox_address: 'unwitting@victim.co.za',
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
];

const dashboardController = new DashboardController(dataStore, dashboardView);

describe('on initialisation', () => {
  it('adds an observer function to the view', () => {
    new DashboardController(dataStore, dashboardView);

    expect(dashboardView.addObserver.mock.calls.length).toBe(1);
  });
});

describe('#init', () =>{
  it('has no mailbox events loaded when it is initialised', () => {
    const dc = new DashboardController(dataStore, dashboardView);
    expect(dc.mailboxEvents).toStrictEqual({probablyMalicious: []});
  });
  it('fetches a list of probably malicious mailbox events', () => {
    dashboardController.init();

    expect(dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls.length).toBe(1);
  });

  it('stores the retrieved events', () => {
    dashboardController.init();

    // trigger the callback that was passed to the datastore
    dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls[0][0](eventsAsData);

    expect(dashboardController.mailboxEvents.probablyMalicious).toBe(eventsAsData);
  });

  it('passes the events to the view to initialise', () => {
    dashboardController.init();

    // trigger the callback that was passed to the datastore
    dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls[0][0](eventsAsData);

    expect(dashboardView.init.mock.calls.length).toBe(1);
    expect(dashboardView.init.mock.calls[0][0]).toStrictEqual(eventsAsData);
  });
});

describe('observing view events', () => {
  describe('`show_detail` event', () => {
    it('passes the detail to the view for display', () => {
      const dashboardController = new DashboardController(dataStore, dashboardView);
      dashboardController.mailboxEvents.probablyMalicious = eventsAsData;

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      expect(dashboardView.displayMailboxEventDetail.mock.calls.length).toBe(1);
      expect(dashboardView.displayMailboxEventDetail.mock.calls[0][0]).toStrictEqual(eventsAsData[0]);
    });

    it('requests all events for the associated mailbox address', () => {
      const dashboardController = new DashboardController(dataStore, dashboardView);
      dashboardController.mailboxEvents.probablyMalicious = eventsAsData;

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      expect(dataStore.fetchEventsForMailbox.mock.calls.length).toBe(1);
      expect(dataStore.fetchEventsForMailbox.mock.calls[0][0]).toBe(eventsAsData[0].id);
    });

    it('passes events associated with the mailbox address to the view', () => {
      const dashboardController = new DashboardController(dataStore, dashboardView);
      dashboardController.mailboxEvents.probablyMalicious = eventsAsData;
      const associatedEvents = [{event: 1}, {event: 2}];

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      // trigger the callback to process the associated events data
      dataStore.fetchEventsForMailbox.mock.calls[0][1](associatedEvents);

      expect(dashboardView.displayMailboxAssociatedEvents.mock.calls.length).toBe(1);
      expect(dashboardView.displayMailboxAssociatedEvents.mock.calls[0][0]).toStrictEqual(associatedEvents);
    });

    it('requests all events for the associated ip actor', () => {
      const dashboardController = new DashboardController(dataStore, dashboardView);
      dashboardController.mailboxEvents.probablyMalicious = eventsAsData;

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      expect(dataStore.fetchEventsForIpActor.mock.calls.length).toBe(1);
      expect(dataStore.fetchEventsForIpActor.mock.calls[0][0]).toBe(eventsAsData[0].id);
    });

    it('passes events associated with the IP actor to the view', () => {
      new DashboardController(dataStore, dashboardView);
      const associatedEvents = [{event: 1}, {event: 2}];

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      // trigger the callback to process the associated events data
      dataStore.fetchEventsForIpActor.mock.calls[0][1](associatedEvents);

      expect(dashboardView.displayIpActorAssociatedEvents.mock.calls.length).toBe(1);
      expect(dashboardView.displayIpActorAssociatedEvents.mock.calls[0][0]).toStrictEqual(associatedEvents);
    });

    it('requests all events for the associated forward recipient', () => {
      const dashboardController = new DashboardController(dataStore, dashboardView);

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      expect(dataStore.fetchEventsForForwardRecipient.mock.calls.length).toBe(1);
      expect(dataStore.fetchEventsForForwardRecipient.mock.calls[0][0]).toBe(eventsAsData[0].id);
    });

    it('passes events associated with the forward recipient to the view', () => {
      new DashboardController(dataStore, dashboardView);
      const associatedEvents = [{event: 1}, {event: 2}];

      // trigger the observer callback
      dashboardView.addObserver.mock.calls[0][0](
        {action: 'show_detail', object_type: 'MailboxEvent', id: eventsAsData[0].id}
      );

      // trigger the callback to process the associated events data
      dataStore.fetchEventsForForwardRecipient.mock.calls[0][1](associatedEvents);

      expect(dashboardView.displayForwardRecipientAssociatedEvents.mock.calls.length).toBe(1);
      expect(dashboardView.displayForwardRecipientAssociatedEvents.mock.calls[0][0]).toBe(associatedEvents);
    });
  });
});
