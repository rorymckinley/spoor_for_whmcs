import {shallowMount} from '@vue/test-utils';
import AssociatedEventListing from '../vue_src/AssociatedEventListing';
import AssociatedEvent from '../vue_src/AssociatedEvent';

describe('Listing associated events', () => {
  it('sets the pane title as per the title property', () => {
    const wrapper = shallowMount(AssociatedEventListing, {
      propsData: {
        title: 'Associated Event Stuff',
      },
    });

    const header = wrapper.find('h4.panel-title a');
    expect(header.text()).toBe('Associated Event Stuff');
  });
  it('uses the id component in the relevant attributes', () => {
    const wrapper = shallowMount(AssociatedEventListing, {
      propsData: {
        idComponent: 'id_comp',
      },
    });

    expect(wrapper.findAll('div.panel-heading#id_comp_header')).toHaveLength(1);
    expect(
      wrapper.findAll('h4.panel-title a[href="#id_comp_content"][aria-controls="id_comp_content"]')
    ).toHaveLength(1);
    expect(
      wrapper.findAll('div[role="tabpanel"][id="id_comp_content"][aria-labelledby="id_comp_header"]')
    ).toHaveLength(1);
  });
  it('creates an AssociatedEvent instance for each event provided', () => {
    const wrapper = shallowMount(AssociatedEventListing, {
      propsData: {
        events: [
          {id: '1A'},
          {id: '1B'},
          {id: '1C'},
        ],
      },
    });

    const eventInstances = wrapper.findAll(AssociatedEvent);
    expect(eventInstances).toHaveLength(3);

    const firstEvent = eventInstances.at(0);
    expect(firstEvent.props()).toStrictEqual({
      eventData: {id: '1A'},
    });
    const lastEvent = eventInstances.at(2);
    expect(lastEvent.props()).toStrictEqual({
      eventData: {id: '1C'},
    });
  });
});
