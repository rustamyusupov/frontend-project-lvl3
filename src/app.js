import { size } from 'lodash/fp';

import { validation } from './watchers';
import validate from './validator';

const app = () => {
  const state = {
    form: {
      validationState: 'valid',
      errors: [],
    },
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('.rss-form');
  const validationWatcher = validation(state);

  const handleInput = (e) => {
    const url = e.currentTarget.value;
    const errors = validate(url, []);

    state.form.errors = errors;
    state.form.validationState = size(errors) > 0 ? 'invalid' : 'valid';
    validationWatcher.errors = errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  form.elements.url.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};

export default app;
