import {
  map,
  flow,
  filter,
  join,
} from 'lodash/fp';

const getItem = ({ link, title }) => `<div><a href=${link}>${title}</a></div>`;

const content = ({ feeds, posts }) => {
  const feedsContainer = document.querySelector('.feeds');

  const data = feeds.map(({ id, title }) => {
    const header = `<h2>${title}</h2>`;
    const items = flow(filter({ feedId: id }), map(getItem), join(''))(posts);

    return `${header}${items}`;
  });

  feedsContainer.innerHTML = data;
};

export default content;
