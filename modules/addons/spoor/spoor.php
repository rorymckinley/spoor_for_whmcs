<?php

use WHMCS\Database\Capsule;

use WHMCS\Module\Addon\Spoor\Controller;
use WHMCS\Module\Addon\Spoor\SessionManager;
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
    'version' => '0.0.6',
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
      'spoor_secret_key' => [
        'Spoor Secret Key' => 'spoor_secret_key',
        'Type' => 'text',
        'Size' => '64',
        'Default' => hash('sha256', random_int(1, 100000000)),
        'Description' => 'Used to generate anti-CSRF authenticity tokens'
      ],
      'spoor_localisation' => [
        'Spoor Localisation' => 'spoor_localisation',
        'Type' => 'dropdown',
        'Options' => ['default' => 'default', 'en-us' => 'en-us', 'en-gb' => 'en-gb', 'en-za' => 'en-za'],
        'Description' => 'Primarily Used for Date Localisation',
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
  $session_manager = new SessionManager($_SESSION);

  $smarty = new Smarty();
  $smarty->compile_dir = $GLOBALS['templates_compiledir'];

  $view = new View($smarty);

  $controller = new Controller([
    'config' => $vars,
    'api_client' => $api_client,
    'view' => $view,
    'session_manager' => $session_manager
  ]);

  echo $controller->route($_GET['action'], $_REQUEST, spoor_extract_json_body(getallheaders()));
  if ($_REQUEST['ajax'] === 'true') {
    die(); // Force WHMCS to return json
  }
}

function spoor_sidebar($vars) {
  return "";
}

function spoor_extract_json_body($request_headers) {
  if(strpos($request_headers['Content-Type'], 'application/json') !== false) {
    $body = file_get_contents('php://input');
    return json_decode($body, true);
  } else {
    return [];
  }
}
