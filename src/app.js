import onChange from 'on-change';
import { size } from 'lodash/fp';
import axios from 'axios';

import watchers from './watchers';
import validate from './validator';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    form: {
      state: 'active',
      error: '',
      validation: {
        state: '',
        errors: [],
      },
    },
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => watchers(path, value));
  const form = document.querySelector('.rss-form');

  const handleInput = (e) => {
    const url = e.currentTarget.value;
    const errors = validate(url, []);

    watchedState.form.validation = {
      state: size(errors) > 0 ? 'invalid' : 'valid',
      errors,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    watchedState.form.state = 'sending';

    const formData = new FormData(e.target);
    const url = formData.get('url');

    axios.get(`${proxy}${url}`)
      .then((response) => {
        console.log(response);
        watchedState.form.state = 'finished';
      })
      .catch((err) => {
        console.log(err);
        watchedState.form.state = 'failed';
      });
  };

  form.elements.url.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};

export default app;
