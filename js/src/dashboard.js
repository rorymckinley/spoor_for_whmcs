const DataStore = require('./DataStore.js');
const DashboardController = require('./DashboardController.js');
const DashboardView = require('./DashboardView.js');

$(function() {
  const requestPath = whmcsBaseUrl + adminBaseRoutePath + '/' + moduleLink;
  const dataStore = new DataStore($, {requestBase: requestPath});
  const dashboardView = new DashboardView($, (data) => console.log(`Clickety-click ${data}`));
  const dashboardController = new DashboardController(dataStore, dashboardView);

  dashboardController.init();
});
