/* eslint-disable no-undef */

import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import $ from 'jquery';

import parse from './parser';

export default () => {
  const corsProxy = 'https://cors-anywhere.herokuapp.com/';
  const form = document.querySelector('.js-form');
  const input = document.querySelector('.js-input');
  const button = document.querySelector('.js-button');
  const feeds = document.querySelector('.js-feeds');
  const posts = document.querySelector('.js-posts');
  const modal = document.querySelector('.js-modal');

  const state = {
    url: null,
    feeds: [],
    form: '',
    modal: '',
    description: '',
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
    const links = items.map((item) => `<li class="list-group-item d-flex justify-content-between align-items-center"><a href="${item.link}">${item.title}</a><button type="button" class="btn btn-info ml-5" data-toggle="modal" data-target="#descriptionModal" data-description="${item.description}">Description</button></li>`).join('');

    feed.classList.add('list-group-item');
    feed.innerHTML = `<h3>${title}</h3><span>${description}</span>`;
    feeds.append(feed);
    posts.innerHTML += links;
  });

  watch(state, 'modal', () => {
    if (!state.modal) {
      return;
    }

    const content = modal.querySelector('.modal-text');

    content.textContent = state.description;
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

  $('#descriptionModal').on('show.bs.modal', (event) => {
    const descriptionButton = $(event.relatedTarget);
    const description = descriptionButton.data('description');

    state.modal = 'active';
    state.description = description;
  });

  $('#descriptionModal').on('hide.bs.modal', () => {
    state.modal = '';
    state.description = '';
  });
};
