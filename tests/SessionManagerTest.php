<?php

use PHPUnit\Framework\TestCase;

use WHMCS\Module\Addon\Spoor\SessionManager;

class SessionManagerTest extends TestCase {
  public function testGetAuthenticityTokenReturnsNullIfNotDefined() {
    $fake_session = array();
    $manager = new SessionManager($fake_session);
    $this->assertNull($manager->getAuthenticityToken());
  }

  public function testGetAuthenticityTokenReturnsAuthenticityToken() {
    $fake_session = array('spoor_session_authenticity_token' => '123ABC');
    $manager = new SessionManager($fake_session);
    $this->assertEquals('123ABC', $manager->getAuthenticityToken());
  }

  public function testSetAuthenticityTokenSetsRandomNumber() {
    $fake_session = array();
    $manager = new SessionManager($fake_session);

    $token_1 = $manager->setAuthenticityToken();
    $this->assertGreaterThanOrEqual(100000000000, $token_1);
    $this->assertLessThanOrEqual(200000000000, $token_1);

    $token_2 = $manager->setAuthenticityToken();
    $this->assertNotEquals($token_1, $token_2);
  }

  public function testSetAuthenticityTokenExportsNewTokenToSession() {
    $fake_session = array('spoor_session_authenticity_token' => '123ABC');
    $manager = new SessionManager($fake_session);

    $new_token = $manager->setAuthenticityToken();
    $this->assertNotEquals('123ABC', $fake_session['spoor_session_authenticity_token']);
    $this->assertEquals($new_token, $fake_session['spoor_session_authenticity_token']);
  }
}
