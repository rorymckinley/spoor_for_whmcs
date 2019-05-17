<?php
use PHPUnit\Framework\TestCase;

use WHMCS\Module\Addon\Spoor\Controller;
use WHMCS\Module\Addon\Spoor\SpoorApiClient;
use WHMCS\Module\Addon\Spoor\View;

class ControllerTest extends TestCase {
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
    $api_client = $this->createMock(SpoorApiClient::class);
    $api_client->method('getMailboxEvents')
               ->willReturn($events);

    $view = new View(new Smarty());

    $whmcs_config = array();
    $params = array();
    $action = null;

    $controller = new Controller($whmcs_config, $api_client, $view);
    $output = $controller->route($action, $params);

    $this->assertStringContainsString('Recent Mailbox Events', $output);
    $this->assertStringContainsString('unwitting@victim.zzz', $output);
    $this->assertStringContainsString(date('c', 1557205608), $output);
  }
}
