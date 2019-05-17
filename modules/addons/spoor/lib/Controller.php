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
    $events = $this->api_client->getMailboxEvents();
    return $this->view->htmlForMailboxEvents($events);
  }
}
