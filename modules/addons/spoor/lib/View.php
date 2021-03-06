<?php
namespace WHMCS\Module\Addon\Spoor;

class View {
  private $template_engine;

  function __construct($template_engine) {
    $this->template_engine = $template_engine;
  }

  public function htmlForDashboard($events, $config, $authenticityToken) {
    $this->template_engine->assign('events', $events);
    $this->template_engine->assign('modulelink', $config['modulelink']);
    $this->template_engine->assign('authenticityToken', $authenticityToken);
    $this->template_engine->assign('spoorLocalisation', $config['spoor_localisation']);
    return $this->template_engine->fetch(__DIR__.'/../templates/dashboard.tpl');
  }

  public function htmlForMailboxEvents($events) {
    $this->template_engine->assign('events', $events);
    return $this->template_engine->fetch(__DIR__.'/../templates/get_mailbox_events.tpl');
  }

  public function htmlForSidebar($module_link) {
    $this->template_engine->assign('module_link', $module_link);
    return $this->template_engine->fetch(__DIR__.'/../templates/sidebar.tpl');
  }
}
