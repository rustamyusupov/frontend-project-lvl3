import '@babel/polyfill';
import Example from './Example';

export default () => {
  // eslint-disable-next-line no-undef
  const element = document.getElementById('point');
  const obj = new Example(element);

  obj.init();
};
