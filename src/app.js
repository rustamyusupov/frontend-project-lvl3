/* eslint-disable no-undef */

import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';

import parse from './parser';

export default () => {
  const corsProxy = 'http://cors-anywhere.herokuapp.com/';
  const form = document.querySelector('.js-form');
  const input = document.querySelector('.js-input');
  const button = document.querySelector('.js-button');
  const feeds = document.querySelector('.js-feeds');
  const posts = document.querySelector('.js-posts');

  const state = {
    url: null,
    feeds: [],
    form: '',
  };

  watch(state, 'url', () => {
    const isEmpty = state.url === '';
    const isExist = state.feeds.find(({ url }) => url === state.url);

    if (isEmpty) {
      state.form = 'empty';
      return;
    }

    if (isURL(state.url) && !isExist) {
      state.form = 'valid';
      return;
    }

    state.form = 'invalid';
  });

  watch(state, 'form', () => {
    switch (state.form) {
      case 'invalid':
        input.classList.add('is-invalid');
        button.disabled = true;
        break;

      case 'valid':
        input.classList.remove('is-invalid');
        button.disabled = false;
        break;

      default:
        input.value = '';
        input.classList.remove('is-invalid');
        button.disabled = true;
    }
  });

  watch(state, 'feeds', () => {
    const { title, description, items } = state.feeds[state.feeds.length - 1];
    const feed = document.createElement('li');
    const links = items.map((item) => `<li class="list-group-item"><a href="${item.link}">${item.title}</a></li>`).join('');

    feed.classList.add('list-group-item');
    feed.innerHTML = `<h3>${title}</h3><span>${description}</span>`;
    feeds.append(feed);
    posts.innerHTML += links;
  });

  const handleInput = (event) => {
    state.url = event.target.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get(`${corsProxy}${state.url}`)
      .then((response) => {
        const { data } = response;
        const { title, description, items } = parse(data);

        state.feeds.push({
          url: state.url, title, description, items,
        });
        state.url = '';
      })
      .catch((error) => {
        state.form = 'invalid';
        console.log(error);
      });
  };

  input.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};
