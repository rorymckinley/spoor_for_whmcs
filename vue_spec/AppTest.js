import {createLocalVue, shallowMount} from '@vue/test-utils';
import App from '../vue_src/App.vue';
import Pane from '../vue_src/Pane.vue';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('And in the darkness bind them', () => {
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
            ],
            probablyMaliciousEventIds: ['1A', '1D', '1E'],
            selectedEventId: null,
          },
        },
      )
    );
  });

  it('creates a Pane instance', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const panes = wrapper.findAll(Pane);
    expect(panes).toHaveLength(1);
  });

  it('sets up the first pane for probably malicious events', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const panes = wrapper.findAll(Pane);
    const props = panes.at(0).props();
    expect(props).toStrictEqual({
      title: 'Probably Malicious Events',
      seedAction: ['fetchProbablyMaliciousEvents'],
    });
  });
});
