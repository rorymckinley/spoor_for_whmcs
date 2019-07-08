<script type='text/javascript'>
  var moduleLink = '{$modulelink}';
  var authenticityToken = {$authenticityToken};
</script>
<link rel="stylesheet" type="text/css" href='../modules/addons/spoor/templates/css/dashboard.css'>
<script src='../modules/addons/spoor/templates/js/dashboard.js' type='text/javascript'></script>
<div class="panel panel-default" id="event_listing_panel">
  <div class="panel-heading">Probably Malicious Events</div>

  <table class="table">
    <tr>
      <th>
        Time
      </th>
      <th>
        Type
      </th>
      <th>
        Mailbox Address
      </th>
      <th>
        Host
      </th>
    </tr>
  </table>
</div>
<div class="panel panel-default" id="event_detail_panel">
  <div class="panel-heading">Event Details</div>

  <table class="table">
    <tr>
      <th colspan=2>Event</td>
      <th colspan=2>IP Data</th>
    </tr>
    <tr>
      <td>Time</td><td event-detail-item='event_time'></td><td>Ip Address</td><td event-detail-item='ip_ip_address'></td>
    </tr>
    <tr>
      <td>Type</td><td event-detail-item='type'></td><td>City</td><td event-detail-item='ip_city'></td>
    </tr>
    <tr>
      <td>Mailbox Address</td><td event-detail-item='mailbox_address'></td><td>Country Code</td><td event-detail-item='ip_country_code'></td>
    </tr>
    <tr>
      <td>Host</td><td event-detail-item='host'></td><td colspan=2>Owner</td>
    </tr>
    <tr>
      <td>Forward Recipient</td><td event-detail-item='forward_recipient'></td><td>ISP</td><td event-detail-item='ip_isp'></td>
    </tr>
    <tr>
      <td>Assessment</td><td event-detail-item='assessment'></td><td>Organisation</td><td event-detail-item='ip_organisation'></td>
    </tr>
    <tr>
      <td event-action-item='update_event'></td><td></td><td></td><td></td>
    </tr>
  </table>
</div>

<div class="panel-group" id="associated_events" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id='associated_by_mailbox_header'>
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#associated_events" href="#associated_by_mailbox_content" aria-expanded="true" aria-controls="associated_by_mailbox_content">
          Events Associated by Mailbox Address
        </a>
      </h4>
    </div>
    <div id="associated_by_mailbox_content" class="panel-collapse collapse" role="tabpanel" aria-labelledby="associated_by_mailbox_header">
      <div class="panel-body">
        No Data
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id='associated_by_ip_header'>
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#associated_events" href="#associated_by_ip_content" aria-expanded="true" aria-controls="associated_by_ip_content">
          Events Associated by Ip Actor
        </a>
      </h4>
    </div>
    <div id="associated_by_ip_content" class="panel-collapse collapse" role="tabpanel" aria-labelledby="associated_by_ip_header">
      <div class="panel-body">
        No Data
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id='associated_by_forward_recipient_header'>
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#associated_events" href="#associated_by_forward_recipient_content" aria-expanded="true" aria-controls="associated_by_forward_recipient_content">
          Events Associated by Forward Recipient
        </a>
      </h4>
    </div>
    <div id="associated_by_forward_recipient_content" class="panel-collapse collapse" role="tabpanel" aria-labelledby="associated_by_forward_recipient_header">
      <div class="panel-body">
        No Data
      </div>
    </div>
  </div>
</div>
