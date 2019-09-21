<?php
use PHPUnit\Framework\TestCase;

use WHMCS\Module\Addon\Spoor\Controller;
use WHMCS\Module\Addon\Spoor\SessionManager;
use WHMCS\Module\Addon\Spoor\SpoorApiClient;
use WHMCS\Module\Addon\Spoor\View;

class ControllerTest extends TestCase {
  protected function setUp(): void {
    $this->api_client = $this->createMock(SpoorApiClient::class);
    $this->view = new View(new Smarty());
    $this->session = array('spoor_session_authenticity_token' => 1000123);
    $this->session_manager = new SessionManager($this->session);
    $this->whmcs_config = [
      'modulelink' => 'admin/addonmodules.php?module=spoor',
      'spoor_localisation' => 'en-za'
    ];
    $this->params = [
    ];
    $this->controller = new Controller([
      'config' => $this->whmcs_config, 
      'api_client' => $this->api_client,
      'view' => $this->view,
      'session_manager' => $this->session_manager
    ]);
  }

  public function testDefaultRoute() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $this->api_client->method('getProbablyMaliciousMailboxEvents')
               ->willReturn($events);

    $action = null;

    $output = $this->controller->route($action, $this->params, []);

    $this->assertStringContainsString("authenticityToken = 1000123", $output);
  }

  public function testDefaultRouteNoDefinedSessionInitialisesSession() {
    $this->session['spoor_session_authenticity_token'] = null;
    $events = array();
    $this->api_client->method('getProbablyMaliciousMailboxEvents')->willReturn($events);

    $action = null;

    $output = $this->controller->route($action, $this->params, []);
    $this->assertGreaterThanOrEqual(100000000000, $this->session['spoor_session_authenticity_token']);
  }

  public function testDefaultRouteSessionDefinedDoesNotInitialiseSession() {
    $events = array();
    $this->api_client->method('getProbablyMaliciousMailboxEvents')->willReturn($events);

    $action = null;

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(1000123, $this->session['spoor_session_authenticity_token']);
  }

  public function testListMailboxEvents() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $this->api_client->method('getMailboxEvents')
               ->willReturn($events);

    $action = 'list_mailbox_events';

    $output = $this->controller->route($action, $this->params, []);

    $this->assertStringContainsString('Recent Mailbox Events', $output);
    $this->assertStringContainsString('unwitting@victim.zzz', $output);
    $this->assertStringContainsString(date('c', 1557205608), $output);
  }

  public function testListMailboxEventsNoDefinedSessionInitialisesSession() {
    $this->session['spoor_session_authenticity_token'] = null;
    $events = array();
    $this->api_client->method('getMailboxEvents')->willReturn($events);

    $action = 'list_mailbox_events';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertGreaterThanOrEqual(100000000000, $this->session['spoor_session_authenticity_token']);
  }

  public function testListMailboxEventsSessionDefinedDoesNotInitialiseSession() {
    $events = array();
    $this->api_client->method('getMailboxEvents')->willReturn($events);

    $action = 'list_mailbox_events';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(1000123, $this->session['spoor_session_authenticity_token']);
  }

  public function testFetchProbablyMaliciousMailboxEvents() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $metadata = [
      'offset' => 10, 'records' => 20, 'more_records' => true
    ];
    $this->api_client->method('getProbablyMaliciousMailboxEvents')
               ->willReturn(['mailbox_events' => $events, 'metadata' => $metadata]);

    $action = 'fetch_probably_malicious_events';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_events' => $events, 'metadata' => $metadata]), $output);
  }

  public function testFetchConfirmedMaliciousMailboxEvents() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $metadata = [
      'offset' => 10, 'records' => 20, 'more_records' => true
    ];
    $this->api_client->method('getConfirmedMaliciousMailboxEvents')
               ->willReturn(['mailbox_events' => $events, 'metadata' => $metadata]);

    $action = 'fetch_confirmed_malicious_events';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_events' => $events, 'metadata' => $metadata]), $output);
  }

  public function testFetchEventsForMailbox() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $this->api_client->method('getEventsAssociatedWithMailboxAddress')
               ->with('123ABC')
               ->willReturn($events);

    $action = 'fetch_events_for_mailbox';
    $this->params['mailbox_event_id'] = '123ABC';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_events' => $events]), $output);
  }

  public function testFetchEventsForIpActor() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $this->api_client->method('getEventsAssociatedWithIpActor')
               ->with('123ABC')
               ->willReturn($events);

    $action = 'fetch_events_for_ip_actor';
    $this->params['mailbox_event_id'] = '123ABC';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_events' => $events]), $output);
  }

  public function testFetchEventsForForwardRecipient() {
    $events = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );
    $this->api_client->method('getEventsAssociatedWithForwardRecipient')
               ->with('123ABC')
               ->willReturn($events);

    $action = 'fetch_events_for_forward_recipient';
    $this->params['mailbox_event_id'] = '123ABC';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_events' => $events]), $output);
  }

  public function testUpdateMailboxEvent() {
    $event = array(
      array(
        'id' => '123ABC',
        'host' => 'host1.test.com',
        'mailbox_address' => 'unwitting@victim.zzz',
        'ip_actor' => array(
          'id' => '789GHI',
          'ip_address' => '10.0.0.1',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
    );

    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];

    $body = [
      'mailbox_event' => [
        'assessment' => 'probably_benign'
      ],
      'authenticity_token' => 1000123,
    ];
  
    $this->api_client->method('updateMailboxEvent')
               ->with('123ABC', $body['mailbox_event'])
               ->willReturn($event);

    $action = 'update_mailbox_event';
    $output = $this->controller->route($action, $this->params, $body);
    $this->assertEquals(json_encode(['mailbox_event' => $event]), $output);
  }

  public function testUpdateMailboxEventNoEventData() {
    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];

    $body = [
      'authenticity_token' => 1000123,
    ];
  
    $this->api_client->expects($this->never())
               ->method('updateMailboxEvent');

    $action = 'update_mailbox_event';
    $output = $this->controller->route($action, $this->params, $body);
    $this->assertEquals('No Mailbox Event data provided', $output);
  }

  public function testUpdateMailboxEventNoAuthenticityTokenInSession() {
    $this->session['spoor_session_authenticity_token'] = null;

    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];

    $body = [
      'mailbox_event' => [
        'assessment' => 'probably_benign'
      ],
      'authenticity_token' => 1000123,
    ];
  
    $this->api_client->expects($this->never())
               ->method('updateMailboxEvent');

    $action = 'update_mailbox_event';
    $output = $this->controller->route($action, $this->params, $body);
    $this->assertEquals('Incorrect authenticity token', $output);
  }

  public function testUpdateMailboxEventIncorrectAuthenticityToken() {
    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];

    $body = [
      'mailbox_event' => [
        'assessment' => 'probably_benign'
      ],
      'authenticity_token' => $this->session['spoor_session_authenticity_token'] + 1,
    ];
  
    $this->api_client->expects($this->never())
               ->method('updateMailboxEvent');

    $action = 'update_mailbox_event';
    $output = $this->controller->route($action, $this->params, $body);
    $this->assertEquals('Incorrect authenticity token', $output);
  }

  public function testUpdateMailboxEventNoAuthenticityTokenProvided() {
    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];

    $body = [
      'mailbox_event' => [
        'assessment' => 'probably_benign'
      ],
    ];
  
    $this->api_client->expects($this->never())
               ->method('updateMailboxEvent');

    $action = 'update_mailbox_event';
    $output = $this->controller->route($action, $this->params, $body);
    $this->assertEquals('Incorrect authenticity token', $output);
  }

  public function testFetchMailboxEvent() {
    $this->params = [
      'mailbox_event_id' => '123ABC',
    ];
    $event = array(
      'id' => '123ABC',
      'host' => 'host1.test.com',
      'mailbox_address' => 'unwitting@victim.zzz',
      'ip_actor' => array(
        'id' => '789GHI',
        'ip_address' => '10.0.0.1',
        'city' => 'Cape Town',
        'country_code' => 'ZA',
        'owner' => array(
          'isp' => 'Awesome SP (Pty) Ltd',
          'organisation' => 'awesome'
        )
      ),
      'event_time' => 1557205608,
      'type' => 'login'
    );
    $this->api_client->method('getMailboxEvent')
               ->with('123ABC')
               ->willReturn($event);

    $action = 'fetch_mailbox_event';

    $output = $this->controller->route($action, $this->params, []);
    $this->assertEquals(json_encode(['mailbox_event' => $event]), $output);
  }
}
