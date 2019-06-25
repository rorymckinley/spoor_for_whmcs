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

  public function route($action, $params) {
    switch($action) {
    case 'list_mailbox_events':
      $this->initialiseSession();
      $events = $this->api_client->getMailboxEvents();
      $output = $this->view->htmlForMailboxEvents($events);
      break;
    case 'fetch_probably_malicious_events':
      $events = $this->api_client->getProbablyMaliciousMailboxEvents();
      $output = json_encode(['mailboxEvents' => $events]);
      break;
    default:
      $this->initialiseSession();
      $events = $this->api_client->getProbablyMaliciousMailboxEvents();
      $output = $this->view->htmlForDashboard($events, $this->config);
      break;
    }
    
    return $output;
  }

  private function initialiseSession() {
    if ($this->session_manager->getAuthenticityToken() === null) {
      $this->session_manager->setAuthenticityToken();
    }
  }
}
