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
    case 'list_potential_incidents':
      $events = $this->api_client->getPotentialIncidents();
      $html = $this->view->htmlForPotentialIncidents($events);
      break;
    default:
      $events = $this->api_client->getMailboxEvents();
      $html = $this->view->htmlForMailboxEvents($events);
      break;
    }
    
    return $html;
  }
}
