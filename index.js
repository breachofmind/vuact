import { createComponent } from './src/component';
import { createStore } from './src/store';

export { createStore };

export function Vuact(store) {
  const component = createComponent(store);
  return {
    store,
    component
  };
}