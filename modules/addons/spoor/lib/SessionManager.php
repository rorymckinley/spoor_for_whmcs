<?php
namespace WHMCS\Module\Addon\Spoor;

class SessionManager {
  private $session;

  function __construct(&$session) {
    $this->session = &$session;
  }

  public function getAuthenticityToken() {
    $token = null;

    if (array_key_exists('spoor_session_authenticity_token', $this->session)) {
      $token = $this->session['spoor_session_authenticity_token'];
    }

    return $token;
  }

  public function setAuthenticityToken() {
    $new_token = random_int(100000000000, 200000000000);

    $this->session['spoor_session_authenticity_token'] = $new_token;

    return $new_token;
  }
}
