/* eslint-disable no-undef */

import '@babel/polyfill';
import isURL from 'validator/lib/isURL';

export default () => {
  const form = document.querySelector('.js-form');
  const input = document.querySelector('.js-input');

  const validate = (value, validator = v => v) => {
    if (!validator(value)) {
      input.classList.add('is-invalid');

      return;
    }

    input.classList.remove('is-invalid');
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const url = formData.get('url');

    validate(url, isURL);
  };

  const handleInput = event => validate(event.target.value);
  const handleBlur = event => validate(event.target.value, isURL);

  form.addEventListener('submit', handleSubmit);
  input.addEventListener('input', handleInput);
  input.addEventListener('blur', handleBlur);
};
