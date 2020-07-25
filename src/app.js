import onChange from 'on-change';
import { isEmpty } from 'lodash/fp';
import axios from 'axios';
import i18next from 'i18next';

import { getContent, getDifference } from './utils';
import watchers from './watchers';
import validate from './validator';
import parse from './parser';
import en from './locales/en';

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
        error: {},
      },
    },
    content: {
      feeds: [],
      posts: [],
    },
  };

  i18next.init({
    lng: 'en',
    resources: {
      en,
    },
  });

  const watchedState = onChange(state, (path, value) => watchers(path, value));
  const form = document.querySelector('.rss-form');

  const handleInput = (e) => {
    const url = e.currentTarget.value;
    const urls = state.content.feeds.map((feed) => feed.url);
    const error = validate(url, urls);

    watchedState.form.validation = {
      state: isEmpty(error) ? 'valid' : 'invalid',
      error,
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
