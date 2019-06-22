<div class="panel panel-default">
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
{foreach $events as $event}
    <tr>
      <td>
        {date('c', $event['event_time'])}
      </td>
      <td>
        {ucwords(preg_replace('/_/', ' ', $event['type']))}
      </td>
      <td>
        {$event['mailbox_address']}
      </td>
      <td>
        {$event['host']}
      </td>
    </tr>
{/foreach}
  </table>
</div>
