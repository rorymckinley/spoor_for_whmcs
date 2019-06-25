(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DashboardController =
/*#__PURE__*/
function () {
  /**
   * @param {object} datastore The datastore used to fetch and save data
   * @param {object} view The view used to interact with the DOM for the dashboard
   */
  function DashboardController(datastore, view) {
    _classCallCheck(this, DashboardController);

    this.datastore = datastore;
    this.view = view;
    this.mailboxEvents = {
      probablyMalicious: []
    };
  }
  /**
   * Sets initial state of Dashboard
   */


  _createClass(DashboardController, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.datastore.fetchProbablyMaliciousMailboxEvents(function (events) {
        _this.mailboxEvents.probablyMalicious = events;

        _this.view.init(events);
      });
    }
  }]);

  return DashboardController;
}();

module.exports = DashboardController;

},{}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DashboardView =
/*#__PURE__*/
function () {
  /**
   * @param {object} domAccessor Object that allows access to the DOM e.g. jQuery instance
   * @param {function} observer A function that will notify interested parties of events.
   */
  function DashboardView(domAccessor, observer) {
    _classCallCheck(this, DashboardView);

    this.domAccessor = domAccessor;
    this.observer = observer;
  }
  /**
   * Initialise the dashboard
   * @param {array} events A collection of objects representing MailboxEvents
   */


  _createClass(DashboardView, [{
    key: "init",
    value: function init(events) {
      var _this = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var event = _step.value;

          var tr = _this.domAccessor('<tr>', {
            'event-id': event.id
          });

          tr.append(_this.domAccessor('<td>', {
            'event-property': 'event_time'
          }).text(new Date(event.event_time * 1000).toString()));
          tr.append(_this.domAccessor('<td>', {
            'event-property': 'type'
          }).text(_this.__typeHelper(event.type)));
          tr.append(_this.domAccessor('<td>', {
            'event-property': 'mailbox_address'
          }).text(event.mailbox_address));
          tr.append(_this.domAccessor('<td>', {
            'event-property': 'host'
          }).text(event.host));
          tr.click(function () {
            _this.observer({
              action: 'show_detail',
              object_type: 'MailboxEvent',
              id: event.id
            });
          });

          _this.__eventListTable().append(tr);
        };

        for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * A shortcut to the table containing the event listing
     * @return {object} Accessor for the table that lists the events
     */

  }, {
    key: "__eventListTable",
    value: function __eventListTable() {
      return this.domAccessor('#event_listing_panel table');
    }
    /**
     * @param {string} type Snake-cased type
     * @return {string} Converted event type suitable for display
     */

  }, {
    key: "__typeHelper",
    value: function __typeHelper(type) {
      // TODO: When the time comes, this should be extracted to a helper module/class
      var output = null;

      switch (type) {
        case 'login':
          output = 'Login';
          break;

        case 'forward_added':
          output = 'Forward Added';
          break;

        case 'forward_removed':
          output = 'Forward Removed';
          break;
      }

      ;
      return output;
    }
  }]);

  return DashboardView;
}();

module.exports = DashboardView;

},{}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataStore =
/*#__PURE__*/
function () {
  /**
   * @param {object} connection An object that can be used to connect to the backend (e.g. jQuery)
   * @param {object} config An object that stores config parameters
   */
  function DataStore(connection, config) {
    _classCallCheck(this, DataStore);

    this.connection = connection;
    this.config = config;
  }
  /**
   * Fetch all MailboxEvents that are classified as 'probably malicious`
   * @param {function} fn Callback function that will process the response
   */


  _createClass(DataStore, [{
    key: "fetchProbablyMaliciousMailboxEvents",
    value: function fetchProbablyMaliciousMailboxEvents(fn) {
      this.connection.get({
        url: "".concat(this.config.requestBase, "&action=fetch_probably_malicious_events&ajax=true"),
        dataType: 'json',
        success: function success(data) {
          fn(data.mailboxEvents);
        }
      });
    }
  }]);

  return DataStore;
}();

module.exports = DataStore;

},{}],4:[function(require,module,exports){
"use strict";

var DataStore = require('./DataStore.js');

var DashboardController = require('./DashboardController.js');

var DashboardView = require('./DashboardView.js');

$(function () {
  var requestPath = whmcsBaseUrl + adminBaseRoutePath + '/' + moduleLink;
  var dataStore = new DataStore($, {
    requestBase: requestPath
  });
  var dashboardView = new DashboardView($, function (data) {
    return console.log("Clickety-click ".concat(data));
  });
  var dashboardController = new DashboardController(dataStore, dashboardView);
  dashboardController.init();
});

},{"./DashboardController.js":1,"./DashboardView.js":2,"./DataStore.js":3}]},{},[4]);
