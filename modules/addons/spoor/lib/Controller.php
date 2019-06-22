<?php
namespace WHMCS\Module\Addon\Spoor;

class Controller {
  private $api_client;
  private $view;

  function __construct($config, $api_client, $view) {
    $this->api_client = $api_client;
    $this->view = $view;
  }

  public function route($action, $params) {
    switch($action) {
    case 'list_mailbox_events':
      $events = $this->api_client->getMailboxEvents();
      $html = $this->view->htmlForMailboxEvents($events);
      break;
    default:
      $events = $this->api_client->getProbablyMaliciousMailboxEvents();
      $html = $this->view->htmlForDashboard($events);
      break;
    }
    
    return $html;
  }
}
