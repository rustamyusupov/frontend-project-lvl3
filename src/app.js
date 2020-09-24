import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';

import { getContent, getDifference } from './utils';
import watchers from './watchers';
import validate from './validator';
import parse from './parser';
import en from './locales/en';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const getNewContent = (data, url, content) => {
  const parsedData = parse(data);
  const newContent = getContent(url, parsedData);
  const newData = getDifference(content, newContent);

  return newData;
};

const app = async () => {
  await i18next.init({
    lng: 'en',
    resources: {
      en,
    },
  });

  const state = {
    form: {
      process: {
        state: 'active',
        error: '',
      },
      validation: {
        state: '',
        error: '',
      },
    },
    content: {
      feeds: [],
      posts: [],
    },
  };

  const form = document.querySelector('.rss-form');
  const watchedState = onChange(state, (path, value) => watchers(path, value));

  const updateFeed = (url) => {
    axios
      .get(`${proxy}${url}`)
      .then((response) => {
        const newContent = getNewContent(response.data, url, state.content);

        watchedState.content = { ...newContent };
      })
      .finally(() => setTimeout(updateFeed, 5000, url));
  };

  const handleInput = (e) => {
    const url = e.currentTarget.value;
    const urls = state.content.feeds.map((feed) => feed.url);
    const error = validate(url, urls);

    watchedState.form.validation = {
      state: error ? 'invalid' : 'valid',
      error,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    watchedState.form.process = { state: 'sending', error: '' };

    axios
      .get(`${proxy}${url}`)
      .then((response) => {
        const newContent = getNewContent(response.data, url, state.content);

        watchedState.content = { ...newContent };
        watchedState.form.process = { state: 'finished', error: '' };

        setTimeout(() => updateFeed(url), 5000);
      })
      .catch(() => {
        watchedState.form.process = {
          state: 'failed',
          error: 'request',
        };
      });
  };

  form.elements.url.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};

export default app;
