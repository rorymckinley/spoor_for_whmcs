import {createLocalVue, shallowMount} from '@vue/test-utils';
import PaneNavigation from '../vue_src/PaneNavigation.vue';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('PaneNavigation', () => {
  let store;
  let testState;

  beforeEach(() => {
    testState = {
      panes: [
        {id: 'foo', title: 'Foo', seed_action: ['fooAction']},
        {id: 'bar', title: 'Bar', seed_action: ['barAction']},
      ],
      selectedPaneId: 'bar',
    };
    store = new Vuex.Store(
      Object.assign(
        {},
        storeConfig,
        {
          state: Object.assign({}, storeConfig.state, testState),
        }
      )
    );
  });

  it('creates a link for each pane', () => {
    const wrapper = shallowMount(PaneNavigation, {
      store,
      localVue,
    });

    const links = wrapper.findAll('ul li[role="presentation"]');
    expect(links).toHaveLength(testState.panes.length);
    expect(links.at(0).text()).toStrictEqual(testState.panes[0].title);
    expect(links.at(1).text()).toStrictEqual(testState.panes[1].title);
  });

  it('makes the link for the selected pane active', () => {
    const wrapper = shallowMount(PaneNavigation, {
      store,
      localVue,
    });

    const links = wrapper.findAll('ul li[role="presentation"]');
    expect(links.at(0).classes()).toStrictEqual([]);
    expect(links.at(1).classes()).toStrictEqual(['active']);
  });

  it('updates the selctedPaneId if a nav link is clicked', (done) => {
    const wrapper = shallowMount(PaneNavigation, {
      store,
      localVue,
    });

    const links = wrapper.findAll('ul li[role="presentation"]');
    links.at(0).trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(links.at(0).classes()).toStrictEqual(['active']);
      expect(store.getters.selectedPaneId).toEqual(testState.panes[0].id);
      done();
    });
  });
});
