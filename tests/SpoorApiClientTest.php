<?php
use VCR\VCR;
VCR::configure()
  ->setCassettePath(__DIR__.'/fixtures/vcr')
  ->setMode('once');
VCR::turnOn();
use PHPUnit\Framework\TestCase;

use WHMCS\Module\Addon\Spoor\SpoorApiClient;

class SpoorApiClientTest extends TestCase {
  public function testGetMailboxEvents() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getMailboxEvents');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $events = $api_client->getMailboxEvents();
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $events);
    $this->assertEquals(
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
            'organisation' => 'awesome-isp'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
      $events[0]
    );
  }

  public function testGetProbablyMaliciousMailboxEvents() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getProbablyMaliciousMailboxEvents');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $events = $api_client->getProbablyMaliciousMailboxEvents();
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $events);
    $this->assertEquals(
      array(
        'id' => '312ZXC',
        'host' => 'host4.test.com',
        'mailbox_address' => 'innocent@bystander.zzz',
        'ip_actor' => array(
          'id' => '009WER',
          'ip_address' => '10.0.0.4',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome-isp'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
      $events[0]
    );
  }

  public function testGetEventsAssociatedWithMailboxAddress() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getEventsAssociatedWithMailboxAddress');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $events = $api_client->getEventsAssociatedWithMailboxAddress('789GHI');
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $events);
    $this->assertEquals(
      array(
        'id' => '312ZXC',
        'host' => 'host4.test.com',
        'mailbox_address' => 'innocent@bystander.zzz',
        'ip_actor' => array(
          'id' => '009WER',
          'ip_address' => '10.0.0.4',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome-isp'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
      $events[0]
    );
  }

  public function testGetEventsAssociatedWithIpActor() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getEventsAssociatedWithIpActor');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $events = $api_client->getEventsAssociatedWithIpActor('789GHI');
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $events);
    $this->assertEquals(
      array(
        'id' => '312ZXC',
        'host' => 'host4.test.com',
        'mailbox_address' => 'innocent@bystander.zzz',
        'ip_actor' => array(
          'id' => '009WER',
          'ip_address' => '10.0.0.4',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome-isp'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
      $events[0]
    );
  }

  public function testGetEventsAssociatedWithForwardRecipient() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getEventsAssociatedWithForwardRecipient');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $events = $api_client->getEventsAssociatedWithForwardRecipient('789GHI');
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $events);
    $this->assertEquals(
      array(
        'id' => '312ZXC',
        'host' => 'host4.test.com',
        'mailbox_address' => 'innocent@bystander.zzz',
        'ip_actor' => array(
          'id' => '009WER',
          'ip_address' => '10.0.0.4',
          'city' => 'Cape Town',
          'country_code' => 'ZA',
          'owner' => array(
            'isp' => 'Awesome SP (Pty) Ltd',
            'organisation' => 'awesome-isp'
          )
        ),
        'event_time' => 1557205608,
        'type' => 'login'
      ),
      $events[0]
    );
  }
}
