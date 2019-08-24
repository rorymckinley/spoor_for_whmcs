<?php
namespace WHMCS\Module\Addon\Spoor;

class Controller {
  private $api_client;
  private $session_manager;
  private $view;

  function __construct($args) {
    $this->config = $args['config'];
    $this->api_client = $args['api_client'];
    $this->view = $args['view'];
    $this->session_manager = $args['session_manager'];
  }

  public function route($action, $params, $body) {
    switch($action) {
    case 'list_mailbox_events':
      $this->initialiseSession();
      $events = $this->api_client->getMailboxEvents();
      $output = $this->view->htmlForMailboxEvents($events);
      break;
    case 'fetch_probably_malicious_events':
      $events = $this->api_client->getProbablyMaliciousMailboxEvents();
      $output = json_encode(['mailbox_events' => $events]);
      break;
    case 'fetch_confirmed_malicious_events':
      $events = $this->api_client->getConfirmedMaliciousMailboxEvents();
      $output = json_encode(['mailbox_events' => $events]);
      break;
    case 'fetch_events_for_mailbox':
      $events = $this->api_client->getEventsAssociatedWithMailboxAddress($params['mailbox_event_id']);
      $output = json_encode(['mailbox_events' => $events]);
      break;
    case 'fetch_events_for_ip_actor':
      $events = $this->api_client->getEventsAssociatedWithIpActor($params['mailbox_event_id']);
      $output = json_encode(['mailbox_events' => $events]);
      break;
    case 'fetch_events_for_forward_recipient':
      $events = $this->api_client->getEventsAssociatedWithForwardRecipient($params['mailbox_event_id']);
      $output = json_encode(['mailbox_events' => $events]);
      break;
    case 'update_mailbox_event':
      $authenticityToken = array_key_exists('authenticity_token', $body) ? $body['authenticity_token'] : null;
      $eventData = array_key_exists('mailbox_event', $body) ? $body['mailbox_event'] : null;
      if ($this->validateAuthenticityToken($authenticityToken) && $eventData) {
        $event = $this->api_client->updateMailboxEvent($params['mailbox_event_id'], $body['mailbox_event']);
        $output = json_encode(['mailbox_event' => $event]);
      } elseif (!$eventData) {
        $output = 'No Mailbox Event data provided';
      } else {
        $output = 'Incorrect authenticity token';
      }
      break;
    case 'fetch_mailbox_event':
      $event = $this->api_client->getMailboxEvent($params['mailbox_event_id']);
      $output = json_encode(['mailbox_event' => $event]);
      break;
    default:
      $this->initialiseSession();
      $events = $this->api_client->getProbablyMaliciousMailboxEvents();
      $output = $this->view->htmlForDashboard($events, $this->config, $this->session_manager->getAuthenticityToken());
      break;
    }
    
    return $output;
  }

  private function initialiseSession() {
    if ($this->session_manager->getAuthenticityToken() === null) {
      $this->session_manager->setAuthenticityToken();
    }
  }

  private function validateAuthenticityToken($providedAuthenticityToken) {
    return !is_null($this->session_manager->getAuthenticityToken()) &&
      $this->session_manager->getAuthenticityToken() === (int)$providedAuthenticityToken;
  }
}
