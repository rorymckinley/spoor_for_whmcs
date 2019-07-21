import {createLocalVue, shallowMount} from '@vue/test-utils';
import AssociatedEventsContainer from '../vue_src/AssociatedEventsContainer';
import AssociatedEventListing from '../vue_src/AssociatedEventListing';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AssociatedEventsListing', () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
        {
          state: {
            events: [
              {id: '1A', latest_assessment: 'probably_malicious'},
              {id: '1B', latest_assessment: 'probably_benign'},
              {id: '1C', latest_assessment: 'probably_benign'},
              {id: '1D', latest_assessment: 'probably_malicious'},
              {id: '1E', latest_assessment: 'probably_malicious'},
              {id: '1F', latest_assessment: 'confirmed_malicious'},
              {id: '1G', latest_assessment: 'confirmed_malicious'},
              {id: '1H', latest_assessment: 'confirmed_malicious'},
            ],
            associatedEventIds: {
              '1C': {
                byMailboxAddress: ['1A', '1B'],
                byIpAddress: ['1D', '1E'],
                byForwardRecipient: ['1F', '1G'],
              },
              '1D': {
                byMailboxAddress: ['1G', '1H'],
                byIpAddress: ['1A', '1B'],
                byForwardRecipient: ['1C', '1G'],
              },
            },
            selectedEventId: '1C',
          },
        },
      )
    );
  });

  it('instantiates 3 associated event listings', () => {
    const wrapper = shallowMount(
      AssociatedEventsContainer, {
        store,
        localVue,
      }
    );

    expect(wrapper.findAll(AssociatedEventListing)).toHaveLength(3);
  });

  describe('listing of events associated by email address', () => {
    let associatedByMailbox;
    let wrapper;
    beforeEach(() => {
      wrapper = shallowMount(
        AssociatedEventsContainer, {
          store,
          localVue,
        }
      );
      associatedByMailbox = wrapper.findAll(AssociatedEventListing).at(0);
    });
    it('passes through a id component used to name internal elements', () =>{
      expect(associatedByMailbox.props().idComponent).toBe('associated_by_mailbox');
    });

    it('passes through a tite for display', () => {
      expect(associatedByMailbox.props().title).toBe('Events Associated by Mailbox Address');
    });

    it('passes through the events that are associated by mailbox address', () => {
      expect(associatedByMailbox.props().events).toStrictEqual([
        {id: '1A', latest_assessment: 'probably_malicious'},
        {id: '1B', latest_assessment: 'probably_benign'},
      ]);
    });
  });

  describe('listing of events associated by IP address', () => {
    let associatedByIP;
    let wrapper;
    beforeEach(() => {
      wrapper = shallowMount(
        AssociatedEventsContainer, {
          store,
          localVue,
        }
      );
      associatedByIP = wrapper.findAll(AssociatedEventListing).at(1);
    });
    it('passes through a id component used to name internal elements', () =>{
      expect(associatedByIP.props().idComponent).toBe('associated_by_ip');
    });

    it('passes through a tite for display', () => {
      expect(associatedByIP.props().title).toBe('Events Associated by IP Address');
    });

    it('passes through the events that are associated by ip address', () => {
      expect(associatedByIP.props().events).toStrictEqual([
        {id: '1D', latest_assessment: 'probably_malicious'},
        {id: '1E', latest_assessment: 'probably_malicious'},
      ]);
    });
  });

  describe('listing of events associated by forward recipient', () => {
    let associatedByForwardRecipient;
    let wrapper;
    beforeEach(() => {
      wrapper = shallowMount(
        AssociatedEventsContainer, {
          store,
          localVue,
        }
      );
      associatedByForwardRecipient = wrapper.findAll(AssociatedEventListing).at(2);
    });
    it('passes through a id component used to name internal elements', () =>{
      expect(associatedByForwardRecipient.props().idComponent).toBe('associated_by_forward_recipient');
    });

    it('passes through a tite for display', () => {
      expect(associatedByForwardRecipient.props().title).toBe('Events Associated by Forward Recipient');
    });

    it('passes through the events that are associated by forward recipient', () => {
      expect(associatedByForwardRecipient.props().events).toStrictEqual([
        {id: '1F', latest_assessment: 'confirmed_malicious'},
        {id: '1G', latest_assessment: 'confirmed_malicious'},
      ]);
    });
  });
});
