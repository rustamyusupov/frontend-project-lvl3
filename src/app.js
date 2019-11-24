/* eslint-disable no-undef */

import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';

import parse from './parser';

export default () => {
  const form = document.querySelector('.js-form');
  const input = document.querySelector('.js-input');
  const button = document.querySelector('.js-button');

  const state = {
    url: null,
    feeds: [],
  };

  watch(state, 'url', () => {
    if (isURL(state.url) || isFeedExist) {
      input.classList.remove('is-invalid');
      button.disabled = false;
    } else {
      input.classList.add('is-invalid');
      button.disabled = true;
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get(state.url)
      .then((response) => {
        const { data } = response;
        const { title, description, items } = parse(data);

        state.feeds.push({
          url: state.url, title, description, items,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInput = (event) => {
    state.url = event.target.value;
  };

  form.addEventListener('submit', handleSubmit);
  input.addEventListener('input', handleInput);
};
