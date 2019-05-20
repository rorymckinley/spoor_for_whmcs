<?php
namespace WHMCS\Module\Addon\Spoor;

class View {
  private $template_engine;

  function __construct($template_engine) {
    $this->template_engine = $template_engine;
  }

  public function htmlForMailboxEvents($events) {
    $this->template_engine->assign('events', $events);
    return $this->template_engine->fetch(__DIR__.'/../templates/get_mailbox_events.tpl');
  }

  public function htmlForPotentialIncidents($events) {
    $this->template_engine->assign('events', $events);
    return $this->template_engine->fetch(__DIR__.'/../templates/get_potential_incidents.tpl');
  }

  public function htmlForSidebar($module_link) {
    $this->template_engine->assign('module_link', $module_link);
    return $this->template_engine->fetch(__DIR__.'/../templates/sidebar.tpl');
  }
}
