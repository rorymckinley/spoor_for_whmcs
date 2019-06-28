module.exports = {
  validateTableRecords(options) {
    const {table, events, fields, jQuery} = options;

    const tableEntries = jQuery(table.find('tr'));

    expect(tableEntries.length).toBe(events.length);

    for (const [index, event] of events.entries()) {
      const entry = jQuery(tableEntries[index]);

      expect(entry.attr('event-id')).toBe(event.id);

      for (const field of fields) {
        const [propertyName, propertyAccessor] = field;

        let expectedValue = null;
        if (typeof(propertyAccessor) === 'function') {
          expectedValue = propertyAccessor(event);
        } else {
          expectedValue = event[propertyAccessor];
        }

        try {
          expect(
            entry.find(`td[event-property='${propertyName}']`)[0].innerHTML,
            `'${propertyName}' for event ${event.id}`
          ).toBe(expectedValue);
        } catch (e) {
          throw new Error(`${e.message}: '${propertyName}' for event ${event.id}`, e);
        }
      }
    }
  },

  validateTable(options) {
    const {table, events, fields, jQuery} = options;

    const expectedHeaders = fields.map((fieldData) => fieldData[1]);

    const tableHeaders = [];

    table.find('th').each((_, header) => tableHeaders.push(jQuery(header).text()));

    expect(tableHeaders).toStrictEqual(expectedHeaders);

    const tableEntries = jQuery(table.find('tbody tr'));

    expect(tableEntries.length).toBe(events.length);

    for (const [index, event] of events.entries()) {
      const entry = jQuery(tableEntries[index]);

      expect(entry.attr('event-id')).toBe(event.id);

      for (const field of fields) {
        const [propertyName, _ignore, propertyAccessor] = field;

        let expectedValue = null;
        if (typeof(propertyAccessor) === 'function') {
          expectedValue = propertyAccessor(event);
        } else {
          expectedValue = event[propertyAccessor];
        }

        try {
          expect(
            entry.find(`td[event-property='${propertyName}']`)[0].innerHTML,
            `'${propertyName}' for event ${event.id}`
          ).toBe(expectedValue);
        } catch (e) {
          throw new Error(`${e.message}: '${propertyName}' for event ${event.id}`, e);
        }
      }
    }
  },
};
