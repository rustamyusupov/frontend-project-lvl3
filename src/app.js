import onChange from 'on-change';
import { size } from 'lodash/fp';
import axios from 'axios';

import watchers from './watchers';
import validate from './validator';
import parse from './parser';
import { getContent, getDifference } from './utils';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  const state = {
    form: {
      process: {
        state: 'active',
        error: '',
      },
      validation: {
        state: '',
        errors: [],
      },
    },
    content: {
      feeds: [],
      posts: [],
    },
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

    const formData = new FormData(e.target);
    const url = formData.get('url');

    watchedState.form.process = { state: 'sending', error: '' };

    axios.get(`${proxy}${url}`)
      .then((response) => {
        const parsedData = parse(response.data);
        const content = getContent(url, parsedData);
        const newData = getDifference(state.content, content);

        watchedState.content = { ...newData };
        watchedState.form.process = { state: 'finished', error: '' };
      })
      .catch((error) => {
        watchedState.form.process = {
          state: 'failed',
          error,
        };
      });
  };

  form.elements.url.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};

export default app;
