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
    $response = $api_client->getProbablyMaliciousMailboxEvents();
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $response['mailbox_events']);
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
      $response['mailbox_events'][0]
    );

    $this->assertEquals(
      array(
        'offset' => 10,
        'records' => 20,
        'more_records' => true
      ),
      $response['metadata']
    );
  }
  public function testGetConfirmedMaliciousMailboxEvents() {
    $api_url = 'https://spoor.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getConfirmedMaliciousMailboxEvents');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $response = $api_client->getConfirmedMaliciousMailboxEvents();
    VCR::eject();
    VCR::turnOff();
    $this->assertCount(3, $response['mailbox_events']);
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
      $response['mailbox_events'][0]
    );

    $this->assertEquals(
      array(
        'offset' => 10,
        'records' => 20,
        'more_records' => true
      ),
      $response['metadata']
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

  public function testUpdateMailboxEvent() {
    $api_url = 'https://spoorstaging.capefox.co';
    $api_identifier = '123ABC';
    $api_secret = 'secretf00';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getUpdateMailboxEvent');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $event = $api_client->updateMailboxEvent('789GHI', ['assessment' => 'confirmed_benign']);
    VCR::eject();
    VCR::turnOff();
    $this->assertEquals('789GHI', $event['id']);
  }

  public function testGetMailboxEvent() {
    $api_url = 'https://spoorstaging.capefox.co';
    $api_identifier = '3f4e22be-ab3f-47f7-976e-fee775dac5ba';
    $api_secret = 'oochahNgee3To3oDeurahghow2goh6kinoov4oochuu9loosa8';
    VCR::turnOn();
    VCR::insertCassette('spoorapiclient_getMailboxEvent');
    $api_client = new SpoorApiClient($api_url, $api_identifier, $api_secret);
    $event = $api_client->getMailboxEvent('fd320d92-e4bb-4868-b457-7b01c90cd972');
    VCR::eject();
    VCR::turnOff();
    $this->assertEquals('fd320d92-e4bb-4868-b457-7b01c90cd972', $event['id']);
  }
}
