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
    $this->session = array('spoor_session_authenticity_token' => '123ABC');
    $this->session_manager = new SessionManager($this->session);
    $this->whmcs_config = [
      'modulelink' => 'admin/addonmodules.php?module=spoor'
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

    $output = $this->controller->route($action, $this->params);

    $this->assertStringContainsString('Probably Malicious Events', $output);
  }

  public function testDefaultRouteNoDefinedSessionInitialisesSession() {
    $this->session['spoor_session_authenticity_token'] = null;
    $events = array();
    $this->api_client->method('getProbablyMaliciousMailboxEvents')->willReturn($events);

    $action = null;

    $output = $this->controller->route($action, $this->params);
    $this->assertGreaterThanOrEqual(100000000000, $this->session['spoor_session_authenticity_token']);
  }

  public function testDefaultRouteSessionDefinedDoesNotInitialiseSession() {
    $events = array();
    $this->api_client->method('getProbablyMaliciousMailboxEvents')->willReturn($events);

    $action = null;

    $output = $this->controller->route($action, $this->params);
    $this->assertEquals('123ABC', $this->session['spoor_session_authenticity_token']);
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

    $output = $this->controller->route($action, $this->params);

    $this->assertStringContainsString('Recent Mailbox Events', $output);
    $this->assertStringContainsString('unwitting@victim.zzz', $output);
    $this->assertStringContainsString(date('c', 1557205608), $output);
  }

  public function testListMailboxEventsNoDefinedSessionInitialisesSession() {
    $this->session['spoor_session_authenticity_token'] = null;
    $events = array();
    $this->api_client->method('getMailboxEvents')->willReturn($events);

    $action = 'list_mailbox_events';

    $output = $this->controller->route($action, $this->params);
    $this->assertGreaterThanOrEqual(100000000000, $this->session['spoor_session_authenticity_token']);
  }

  public function testListMailboxEventsSessionDefinedDoesNotInitialiseSession() {
    $events = array();
    $this->api_client->method('getMailboxEvents')->willReturn($events);

    $action = 'list_mailbox_events';

    $output = $this->controller->route($action, $this->params);
    $this->assertEquals('123ABC', $this->session['spoor_session_authenticity_token']);
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
    $this->api_client->method('getProbablyMaliciousMailboxEvents')
               ->willReturn($events);

    $action = 'fetch_probably_malicious_events';

    $output = $this->controller->route($action, $this->params);
    $this->assertEquals(json_encode(['mailboxEvents' => $events]), $output);
  }
}
