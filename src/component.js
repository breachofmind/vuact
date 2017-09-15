import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

/**
 * Given the store, create a component function.
 * @param store {Object}
 * @returns {Function}
 */
export function createComponent(store) {

  const { mapState, mapActions } = store;
  /**
   * Create a new react component using vue syntax.
   * @returns {Component}
   */
  return function component(cmp) {

    if (typeof cmp === 'function') {
      return component({ name: cmp.name, render: cmp });
    }
    const {
      name,
      render,
      mapProps: _mapProps = [],
      mapActions: _mapActions = [],
      computed = {},
      methods = {},
      components = {},
      state = _.noop(),
      mounted = _.noop(),
    } = cmp;

    if (typeof render !== 'function') {
      throw new TypeError('render must be a function that returns JSX');
    } else if (typeof name !== 'string') {
      throw new TypeError('component must have a name');
    } else if (typeof state !== 'function') {
      throw new TypeError('state must be a function that returns an object');
    }

    class Component extends React.Component {

      static get displayName() {
        return name;
      }

      /**
       * Create a component instance.
       * @param props {Object}
       */
      constructor(props) {
        super(props);
        this.state = state.call(this);
        this.components = {};

        // Getters/Setters for properties.
        _.each(this.state, (value, propName) => {
          Object.defineProperty(this, propName, {
            enumerable: true,
            get: () => this.state[propName],
            set: (newValue) => this.setState({ [propName]: newValue })
          });
        });
        // Bound method calls.
        _.each(methods, (fn, methodName) => {
          this[methodName] = fn.bind(this);
        });
        // Bound getters.
        _.each(computed, (fn, propName) => {
          Object.defineProperty(this, propName, {
            enumerable: true,
            get: fn.bind(this),
          });
        });
        // Components.
        _.each(components, (fn, componentName) => {
          if (typeof fn === 'function') fn = { render: fn };
          _.assign(fn, {name: componentName, components: components, });
          this.components[componentName] = component(fn);
        });
      }

      /**
       * Fire the mounted callback.
       * @returns {*}
       */
      componentDidMount() {
        return mounted.apply(this, arguments);
      };

      /**
       * Handles a controlled component.
       * @param stateProperty {String}
       * @param handler {Function|string|undefined} optional
       * @returns {{value: *, onInput: (function(*))}}
       */
      model(stateProperty, handler) {
        if (typeof handler === 'string') handler = this[handler];
        return {
          value: this[stateProperty],
          onInput: (event) => {
            const value = event.target.value;
            this[stateProperty] = typeof handler === 'function'
              ? handler.call(this, stateProperty, value)
              : value;
          }
        }
      }
      /**
       * Render the HTML.
       * @returns {*}
       */
      render() {
        return render.call(this, this.props, this.state);
      }
    }
    // Check for the existence of store actions/props.
    // Return a wrapper component if any are set.
    if (store && (_mapProps.length || _mapActions.length)) {
      return connect(mapState(_mapProps), mapActions(_mapActions))(Component);
    }
    return Component;
  }
}