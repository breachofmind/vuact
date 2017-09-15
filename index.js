import { createComponent } from './src/component';

export function vuact(store) {
  const component = createComponent(store);
  return {
    store,
    component
  };
}
