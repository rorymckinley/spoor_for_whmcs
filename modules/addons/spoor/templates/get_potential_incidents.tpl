<style>
table {
  width: 100%;
}
</style>

<h1>Recent Potential Incidents</h1>

<table>
  <tr>
    <th>Mailbox</th>
    <th>Event Type</th>
    <th>Event Time</th>
    <th>Forward Recipient</th>
    <th>IP</th>
    <th>Host</th>
  </tr>
{foreach $events as $event}
  <tr>
    <td>
      {$event['mailbox_address']}
    </td>
    <td>
      {ucwords(preg_replace('/_/', ' ', $event['type']))}
    </td>
    <td>
      {date('c', $event['event_time'])}
    </td>
    <td>
{if array_key_exists('forward_recipient', $event)}
      {$event['forward_recipient']}
{else}
      N/A
{/if}
    </td>
    <td>
      {$event['ip_actor']['ip_address']}
    </td>
    <td>
      {$event['host']}
    </td>
  </tr>
{/foreach}
</table>
