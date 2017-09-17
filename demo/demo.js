import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Vuact, createStore } from '../index';

const store = createStore({});
const vuact = Vuact(store);

const ListItem = vuact.component('ListItem', {
  render({ name, onDelete, index }) {
    return <li onClick={onDelete} data-index={index}>{name}</li>
  }
});

const App = vuact.component('App', {
  state: () => ({
    counter: 4,
    items: [
      { name: 'Item 1' },
      { name: 'Item 2' },
      { name: 'Item 3' },
    ]
  }),
  methods: {
    addOne() {
      this.$push('items', { name: `Item ${this.counter}` });
      this.counter += 1;
    },
    onDelete(event) {
      this.$splice('items', event.target.getAttribute('data-index'), 1);
    }
  },
  render() {
    return (
      <div>
        <ul>
          {ListItem.renderEach(this.items, { onDelete: this.onDelete })}
        </ul>
        <button onClick={this.addOne}>Add</button>
      </div>
    )
  }
});

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('Root'));