import {createLocalVue, shallowMount} from '@vue/test-utils';
import App from '../vue_src/App.vue';
import Pane from '../vue_src/Pane.vue';
import PaneNavigation from '../vue_src/PaneNavigation.vue';
import Vuex from 'vuex';
import storeConfig from '../vue_src/store-config.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('And in the darkness bind them', () => {
  let store;
  let testState;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    testState = {
      panes: [
        {
          id: 'foo',
          title: 'Foo',
          seedAction: ['fooAction', {some: 'options'}],
          viewKey: 'fooKey',
        },
        {
          id: 'bar',
          title: 'Bar',
          seedAction: ['barAction', {more: 'options'}],
          viewKey: 'barKey',
        },
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
    store.dispatch = mockDispatch;
  });

  it('creates a Pane instance for each of the configured panes', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const panes = wrapper.findAll(Pane);
    expect(panes).toHaveLength(2);
  });

  it('sets up the selected panes', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const panes = wrapper.findAll(Pane);
    expect(panes.at(0).props()).toStrictEqual({
      title: 'Foo',
      seedAction: ['fooAction', {some: 'options'}],
      viewKey: 'fooKey',
      id: 'foo',
    });
    expect(panes.at(1).props()).toStrictEqual({
      title: 'Bar',
      seedAction: ['barAction', {more: 'options'}],
      viewKey: 'barKey',
      id: 'bar',
    });
  });

  it('only makes the selected pane visible', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const panes = wrapper.findAll(Pane);
    expect(panes.at(0).isVisible()).toBeFalsy();
    expect(panes.at(1).isVisible()).toBeTruthy();
  });

  it('creates a PaneNavigation element', () => {
    const wrapper = shallowMount(App, {
      store,
      localVue,
    });

    const paneNavigations = wrapper.findAll(PaneNavigation);
    expect(paneNavigations).toHaveLength(1);
  });
});
