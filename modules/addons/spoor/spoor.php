<?php

use WHMCS\Database\Capsule;

use WHMCS\Module\Addon\Spoor\Controller;
use WHMCS\Module\Addon\Spoor\SpoorApiClient;
use WHMCS\Module\Addon\Spoor\View;

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

function spoor_config() {
  return [
    'name' => 'Spoor',
    'description' => 'A module that integrates with the Spoor API',
    'author' => 'Rory McKinley',
    'language' => 'english',
    'version' => '0.0.1',
    'fields' => [
      'spoor_api_identifier' => [
        'Spoor API Identifier' => 'spoor_api_identifier',
        'Type' => 'text',
        'Size' => '100',
        'Default' => '',
        'Description' => 'Spoor API Client Identifier'
      ],
      'spoor_api_secret' => [
        'Spoor API Secret' => 'spoor_api_secret',
        'Type' => 'password',
        'Size' => '200',
        'Default' => '',
        'Description' => 'Spoor API Secret'
      ],
      'spoor_api_url' => [
        'Spoor URL' => 'spoor_api_url',
        'Type' => 'text',
        'Size' => '100',
        'Default' => 'https://spoor.capefox.co/',
        'Description' => 'Spoor URL'
      ],
    ]
  ];
}

function spoor_activate() {
  return null;
}

function spoor_deactivate() {
}

function spoor_upgrade($vars) {
}

function spoor_output($vars) {
  $api_client = new SpoorApiClient($vars['spoor_api_url'], $vars['spoor_api_identifier'], $vars['spoor_api_secret']);

  $smarty = new Smarty();
  $smarty->compile_dir = $GLOBALS['templates_compiledir'];

  $view = new View($smarty);

  $controller = new Controller($vars, $api_client, $view);
  echo $controller->route($_GET['action'], $_REQUEST);
}

function spoor_sidebar($vars) {
  echo "";
}
