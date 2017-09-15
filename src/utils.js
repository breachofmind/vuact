import classnames from 'classnames';
/**
 * Bind the given methods with the component.
 * @param cmp {Component}
 * @param methods {Array<string>}
 */
export function bind(cmp, methods) {
  methods.forEach((method) => {
    cmp[method] = cmp[method].bind(cmp);
  });
}
/**
 * Prop mapper that adds display none style if condition not met.
 * @param condition {Boolean}
 * @returns {Object}
 */
export function $if(condition) {
  return !condition ? {} : { style: { display: 'none' } };
}

export function $class(args) {
  return { className: classnames(args) };
}