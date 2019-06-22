<?php
namespace WHMCS\Module\Addon\Spoor;

class SpoorApiClient {
  private $api_url;
  private $api_identifier;
  private $api_secret;

  function __construct($api_url, $api_identifier, $api_secret) {
    $this->api_url = $api_url;
    $this->api_identifier = $api_identifier;
    $this->api_secret = $api_secret;
  }

  public function getMailboxEvents() {
    $ch = curl_init($this->api_url.'/api/mailbox_events');

    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERPWD, $this->api_identifier.':'.$this->api_secret);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    $mailbox_events = json_decode(curl_exec($ch), true)['mailbox_events'];

    $info = curl_getinfo($ch);
    curl_close($ch);

    return $mailbox_events;
  }

  public function getProbablyMaliciousMailboxEvents() {
    $params = http_build_query(array('mailbox_events' => array('class' => 'probably_malicious')));
    $ch = curl_init($this->api_url.'/api/mailbox_events?'.$params);

    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERPWD, $this->api_identifier.':'.$this->api_secret);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    $mailbox_events = json_decode(curl_exec($ch), true)['mailbox_events'];

    $info = curl_getinfo($ch);
    curl_close($ch);

    return $mailbox_events;
  }
}
