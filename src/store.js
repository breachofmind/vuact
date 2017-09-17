import { createStore as createReduxStore } from 'redux'

export function createStore(opts) {
  let {
    debug = true,
    state = {},
    mutations = {},
    actions = {},
    getters = {},
  } = opts;

  const DEFAULT_STATE = state;

  /**
   * The main reducer for this store.
   * @param oldState {Object}
   * @param action {Object}
   * @returns {Object}
   */
  function reducer(oldState = DEFAULT_STATE, action) {
    if (debug) {
      console.log(`dispatch: ${action.type}`, action);
    }
    state = oldState;
    if (mutations[action.type]) {
      state = mutations[action.type].call(this, oldState, action);
    }
    return state;
  }

  /**
   * Map a state property or getter to a react prop.
   * Used as replacement for mapStateToProps()
   * @param array {Array}
   * @returns {function(*=): *}
   */
  function mapState(array) {
    return (store, props) => (
      array.reduce((memo, prop) => {
        // Does this exist as state prop or getter?
        if (store[prop]) {
          memo[prop] = store[prop];
        } else if (getters[prop]) {
          memo[prop] = getters[prop](store, props);
        }
        return memo;
      }, {})
    );
  }

  /**
   * Map getters to react props.
   * Used as replacement for mapStateToProps()
   * @param array {Array}
   * @returns {function(*=): *}
   */
  function mapGetters(array) {
    return (store, props) => (
      array.reduce((memo, prop) => {
        memo[prop] = getters[prop] ? getters[prop](store, props) : null;
        return memo;
      }, {})
    );
  }

  /**
   * Map dispatch methods/actions to react props.
   * Used a replacement to mapDispatchToProps()
   * @param methods {Array}
   * @returns {function(*=): *}
   */
  function mapActions(methods) {
    return (dispatch, props) => (
      methods.reduce((memo, prop) => {
        if (actions[prop]) {
          memo[prop] = (payload => (actions[prop]({ dispatch, state, props }, payload)));
        }
        return memo;
      }, {})
    );
  }

  const store = createReduxStore(reducer);

  store.mapState  = mapState;
  store.mapGetters = mapGetters;
  store.mapActions = mapActions;

  return store;
}