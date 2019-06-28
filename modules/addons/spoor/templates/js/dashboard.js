(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DashboardController =
/*#__PURE__*/
function () {
  /**
   * @param {object} dataStore The datastore used to fetch and save data
   * @param {object} view The view used to interact with the DOM for the dashboard
   */
  function DashboardController(dataStore, view) {
    _classCallCheck(this, DashboardController);

    this.dataStore = dataStore;
    this.view = view;
    this.view.addObserver(this.__viewObserver.bind(this));
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

      this.dataStore.fetchProbablyMaliciousMailboxEvents(function (events) {
        _this.mailboxEvents.probablyMalicious = events;

        _this.view.init(events);
      });
    }
    /**
     * Parses event data from a view and takes the necessry action
     * @param {object} viewEventData An obect describing the nature of the event
     */

  }, {
    key: "__viewObserver",
    value: function __viewObserver(viewEventData) {
      var _this2 = this;

      var selectedEvent = this.mailboxEvents.probablyMalicious.filter(function (event) {
        return event.id == viewEventData.id;
      })[0];
      this.view.displayMailboxEventDetail(selectedEvent);
      this.dataStore.fetchEventsForMailbox(viewEventData.id, function (events) {
        return _this2.view.displayMailboxAssociatedEvents(events);
      });
      this.dataStore.fetchEventsForIpActor(viewEventData.id, function (events) {
        return _this2.view.displayIpActorAssociatedEvents(events);
      });
      this.dataStore.fetchEventsForForwardRecipient(viewEventData.id, function (events) {
        return _this2.view.displayForwardRecipientAssociatedEvents(events);
      });
    }
  }]);

  return DashboardController;
}();

module.exports = DashboardController;

},{}],2:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DashboardView =
/*#__PURE__*/
function () {
  /**
   * @param {object} domAccessor Object that allows access to the DOM e.g. jQuery instance
   */
  function DashboardView(domAccessor) {
    _classCallCheck(this, DashboardView);

    this.domAccessor = domAccessor;
  }
  /**
   * Initialise the dashboard
   * @param {array} events A collection of objects representing MailboxEvents
   */


  _createClass(DashboardView, [{
    key: "init",
    value: function init(events) {
      var _this = this;

      this.__tableRecordHelper({
        table: this.__eventListTable(),
        events: events,
        fields: [['event_time', 'event_time', this.__timeHelper], ['type', 'type', this.__typeHelper], ['mailbox_address', 'mailbox_address', undefined], ['host', 'host']],
        listeners: {
          click: function click(event) {
            return function () {
              _this.observer({
                action: 'show_detail',
                object_type: 'MailboxEvent',
                id: event.id
              });
            };
          }
        }
      });
    }
    /**
     * Add an observer
     * @param {function} observer A function that will notify interested parties of events.
     */

  }, {
    key: "addObserver",
    value: function addObserver(observer) {
      this.observer = observer;
    }
    /**
     * Displays the Mailbox Event detail pane
     * @param {object} eventData Data for the event to be displayed.
     */

  }, {
    key: "displayMailboxEventDetail",
    value: function displayMailboxEventDetail(eventData) {
      this.domAccessor('#event_detail_panel').show();
      this.domAccessor('#event_mailbox_associated_events_panel').show();
      this.domAccessor('#event_ip_actor_associated_events_panel').show();
      this.domAccessor('#event_forward_recipient_associated_events_panel').show();
      this.domAccessor('td[event-detail-item="event_time"]').text(this.__timeHelper(eventData.event_time));
      this.domAccessor('td[event-detail-item="type"]').text(this.__typeHelper(eventData.type));
      this.domAccessor('td[event-detail-item="mailbox_address"]').text(eventData.mailbox_address);
      this.domAccessor('td[event-detail-item="host"]').text(eventData.host);
      this.domAccessor('td[event-detail-item="ip_ip_address"]').text(eventData.ip_actor.ip_address);
      this.domAccessor('td[event-detail-item="ip_city"]').text(eventData.ip_actor.city);
      this.domAccessor('td[event-detail-item="ip_country_code"]').text(eventData.ip_actor.country_code);
      this.domAccessor('td[event-detail-item="ip_isp"]').text(eventData.ip_actor.owner.isp);
      this.domAccessor('td[event-detail-item="ip_organisation"]').text(eventData.ip_actor.owner.organisation);
    }
    /**
     * Displays events associated with the selected Mailbox Event's mailbox address
     * @param {array} events A collection of associated events
     */

  }, {
    key: "displayMailboxAssociatedEvents",
    value: function displayMailboxAssociatedEvents(events) {
      this.__mailboxAssociatedEventListPanel().addClass('in');

      this.__tableHelper({
        panel: this.__mailboxAssociatedEventListPanelBody(),
        events: events,
        fields: [['Event Time', 'event_time', 'event_time', this.__timeHelper], ['Type', 'type', 'type', this.__typeHelper], ['IP Address', 'ip_ip_address', function (event) {
          return event.ip_actor.ip_address;
        }, undefined], ['IP Country Code', 'ip_country_code', function (event) {
          return event.ip_actor.country_code;
        }, undefined]]
      });
    }
    /**
     * Displays events associated with the selected Mailbox Event's ip actor
     * @param {array} events A collection of associated events
     */

  }, {
    key: "displayIpActorAssociatedEvents",
    value: function displayIpActorAssociatedEvents(events) {
      this.__ipActorAssociatedEventListPanel().addClass('in');

      this.__tableHelper({
        panel: this.__ipActorAssociatedEventListPanelBody(),
        events: events,
        fields: [['Event Time', 'event_time', 'event_time', this.__timeHelper], ['Type', 'type', 'type', this.__typeHelper], ['Mailbox Address', 'mailbox_address', 'mailbox_address', undefined]]
      });
    }
    /**
     * Displays events associated with the selected Mailbox Event's forward recipient
     * @param {array} events A collection of associated events
     */

  }, {
    key: "displayForwardRecipientAssociatedEvents",
    value: function displayForwardRecipientAssociatedEvents(events) {
      this.__forwardRecipientAssociatedEventListPanel().addClass('in');

      this.__tableHelper({
        panel: this.__forwardRecipientAssociatedEventListPanelBody(),
        events: events,
        fields: [['Event Time', 'event_time', 'event_time', this.__timeHelper], ['Type', 'type', 'type', this.__typeHelper], ['Mailbox Address', 'mailbox_address', 'mailbox_address', undefined], ['IP Address', 'ip_ip_address', function (event) {
          return event.ip_actor.ip_address;
        }, undefined], ['IP Country Code', 'ip_country_code', function (event) {
          return event.ip_actor.country_code;
        }, undefined]]
      });
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
     * Returns an accessor for the panel containing events associated by Mailbox event
     * @return {object} Accessor for the table that lists the events
     **/

  }, {
    key: "__mailboxAssociatedEventListPanel",
    value: function __mailboxAssociatedEventListPanel() {
      return this.domAccessor('#associated_by_mailbox_content');
    }
    /**
     * Returns an accessor for the body of the accordion panel containing events associated by Mailbox event
     * @return {object} Accessor for the table that lists the events
     **/

  }, {
    key: "__mailboxAssociatedEventListPanelBody",
    value: function __mailboxAssociatedEventListPanelBody() {
      return this.__mailboxAssociatedEventListPanel().find('.panel-body');
    }
    /**
     * A shortcut to the accordion panel containing the events associated with the primary event's ip actor
     * @return {object} Accessor for the table that lists the events
     */

  }, {
    key: "__ipActorAssociatedEventListPanel",
    value: function __ipActorAssociatedEventListPanel() {
      return this.domAccessor('#associated_by_ip_content');
    }
    /**
     * A shortcut to the body of the accordion panel containing the events associated with the primary event's ip actor
     * @return {object} Accessor for the table that lists the events
     */

  }, {
    key: "__ipActorAssociatedEventListPanelBody",
    value: function __ipActorAssociatedEventListPanelBody() {
      return this.__ipActorAssociatedEventListPanel().find('.panel-body');
    }
    /**
     * A shortcut to the accordion panel for events related to the forward recipient
     * @return {object} Accessor for the panel
     */

  }, {
    key: "__forwardRecipientAssociatedEventListPanel",
    value: function __forwardRecipientAssociatedEventListPanel() {
      return this.domAccessor('#associated_by_forward_recipient_content');
    }
    /**
     * A shortcut to the body of the accordion panel containing the events associated with the primary event's ip actor
     * @return {object} Accessor for the table that lists the events
     */

  }, {
    key: "__forwardRecipientAssociatedEventListPanelBody",
    value: function __forwardRecipientAssociatedEventListPanelBody() {
      return this.__forwardRecipientAssociatedEventListPanel().find('.panel-body');
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
    /**
     * Converts a timestamp in seconds since the epoch to a string
     * @param {integer} time Timestamp in seconds since the epoch
     * @return {string} Default output from Date#toString()
     */

  }, {
    key: "__timeHelper",
    value: function __timeHelper(time) {
      return new Date(time * 1000).toString();
    }
    /**
     * Populate a table with a representation of events
     * @param {object} args Arguments object
     */

  }, {
    key: "__tableRecordHelper",
    value: function __tableRecordHelper(args) {
      var table = args.table,
          events = args.events,
          fields = args.fields,
          listeners = args.listeners;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var event = _step.value;
          var tr = this.domAccessor('<tr>', {
            'event-id': event.id
          });
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var fieldData = _step2.value;

              var _fieldData = _slicedToArray(fieldData, 3),
                  propertyDescription = _fieldData[0],
                  accessor = _fieldData[1],
                  display = _fieldData[2];

              var value = null;

              if (typeof accessor == 'function') {
                value = accessor(event);
              } else {
                value = event[accessor];
              }

              var text = null;

              if (typeof display == 'function') {
                text = display(value);
              } else {
                text = value;
              }

              tr.append(this.domAccessor('<td>', {
                'event-property': propertyDescription
              }).text(text));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (listeners && listeners.click) {
            tr.click(listeners.click(event));
          }

          table.append(tr);
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
     * Populate a table with a representation of events
     * @param {object} args Arguments object
     */

  }, {
    key: "__tableHelper",
    value: function __tableHelper(args) {
      var panel = args.panel,
          events = args.events,
          fields = args.fields,
          listeners = args.listeners;
      var table = this.domAccessor('<table>', {
        "class": 'table'
      });
      var tableHead = this.domAccessor('<thead>');
      var headerRow = this.domAccessor('<tr>');
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = fields.map(function (field) {
          return field[0];
        })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var header = _step3.value;
          headerRow.append(this.domAccessor('<th>').text(header));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      tableHead.append(headerRow);
      table.append(tableHead);
      var tableBody = this.domAccessor('<tbody>');
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = events[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var event = _step4.value;
          var tr = this.domAccessor('<tr>', {
            'event-id': event.id
          });
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = fields[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var fieldData = _step5.value;

              var _fieldData2 = _slicedToArray(fieldData, 4),
                  _ = _fieldData2[0],
                  propertyDescription = _fieldData2[1],
                  accessor = _fieldData2[2],
                  display = _fieldData2[3];

              var value = null;

              if (typeof accessor == 'function') {
                value = accessor(event);
              } else {
                value = event[accessor];
              }

              var text = null;

              if (typeof display == 'function') {
                text = display(value);
              } else {
                text = value;
              }

              tr.append(this.domAccessor('<td>', {
                'event-property': propertyDescription
              }).text(text));
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          if (listeners && listeners.click) {
            tr.click(listeners.click(event));
          }

          tableBody.append(tr);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      table.append(tableBody);
      panel.html(table);
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
      this.__getMailboxEvents(this.__buildUrl([['action', 'fetch_probably_malicious_events']]), fn);
    }
    /**
     * Fetches all events associated with the Mailbox Event's mailbox address
     * @param {string} mailboxEventId Id of Mailbox Event
     * @param {function} callback Callback function that will process receivede data
     */

  }, {
    key: "fetchEventsForMailbox",
    value: function fetchEventsForMailbox(mailboxEventId, callback) {
      this.__getMailboxEvents(this.__buildUrl([['action', 'fetch_events_for_mailbox'], ['mailbox_event_id', mailboxEventId]]), callback);
    }
    /**
     * Fetches events that share an Ip Actor with the primary Mailbox Event
     * @param {string} mailboxEventId Id of Mailbox Event
     * @param {function} callback Callback function that will process receivede data
     */

  }, {
    key: "fetchEventsForIpActor",
    value: function fetchEventsForIpActor(mailboxEventId, callback) {
      this.__getMailboxEvents(this.__buildUrl([['action', 'fetch_events_for_ip_actor'], ['mailbox_event_id', mailboxEventId]]), callback);
    }
    /**
     * Fetches events that share a Forward Recipient with the primary Mailbox Event
     * @param {string} mailboxEventId Id of Mailbox Event
     * @param {function} callback Callback function that will process receivede data
     */

  }, {
    key: "fetchEventsForForwardRecipient",
    value: function fetchEventsForForwardRecipient(mailboxEventId, callback) {
      this.__getMailboxEvents(this.__buildUrl([['action', 'fetch_events_for_forward_recipient'], ['mailbox_event_id', mailboxEventId]]), callback);
    }
    /**
     * Fetch mailbox events from WHMCS
     * @param {string} url Url for the WHMCS endpoint
     * @param {function} callback success callback function
     */

  }, {
    key: "__getMailboxEvents",
    value: function __getMailboxEvents(url, callback) {
      this.connection.get({
        url: url,
        dataType: 'json',
        success: function success(data) {
          callback(data.mailboxEvents);
        }
      });
    }
    /**
     * Takes an array of arrays representing request URL params and buils a complete url
     * @param {array} params Array of [key,value] arrays
     * @return {string} Complete url
     */

  }, {
    key: "__buildUrl",
    value: function __buildUrl(params) {
      var url = this.config.requestBase;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = params.concat([['ajax', 'true']])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pair = _step.value;
          url = "".concat(url, "&").concat(pair[0], "=").concat(pair[1]);
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

      return url;
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
