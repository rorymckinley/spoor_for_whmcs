<?php

use PHPUnit\Framework\TestCase;

use WHMCS\Module\Addon\Spoor\View;

class ViewTest extends TestCase {
  public function testHtmlForMailboxEvents() {
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
      array(
        'id' => '456DEF',
        'host' => 'host2.test.com',
        'mailbox_address' => 'hapless@anothervictim.zzz',
        'ip_actor' => array(
          'id' => '012JKL',
          'ip_address' => '10.0.0.2',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Not So Awesome ISP (Pty) Ltd',
            'organisation' => 'not-so-awesome'
          )
        ),
        'event_time' => 1557205620,
        'type' => 'forward_added',
        'forward_recipient' => 'badguy99@gmail.com'
      ),
    );
    $view = new View(new Smarty());
    $output = file_get_contents(__DIR__.'/fixtures/templates/get_mailbox_events.html');
    $this->assertEquals($output, $view->htmlForMailboxEvents($events));
  }

  public function testHtmlForDashboard() {
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
      array(
        'id' => '456DEF',
        'host' => 'host2.test.com',
        'mailbox_address' => 'hapless@anothervictim.zzz',
        'ip_actor' => array(
          'id' => '012JKL',
          'ip_address' => '10.0.0.2',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Not So Awesome ISP (Pty) Ltd',
            'organisation' => 'not-so-awesome'
          )
        ),
        'event_time' => 1557205620,
        'type' => 'forward_added',
        'forward_recipient' => 'badguy99@gmail.com'
      ),
    );
    $config = ['modulelink' => '/addonmodules.php?module=spoor', 'spoor_localisation' => 'en-za'];
    $view = new View(new Smarty());
    $output = file_get_contents(__DIR__.'/fixtures/templates/dashboard.html');
    $this->assertEquals($output, $view->htmlForDashboard($events, $config, 123010));
  }
}
