import { differenceBy } from 'lodash/fp';

export const getContent = (url, data) => {
  const feed = {
    id: url,
    url,
    title: data.title,
    description: data.description,
  };

  const posts = data.posts.map(({ title, link }) => ({
    id: link,
    feedId: url,
    title,
    link,
  }));

  return { feed, posts };
};

export const getDifference = (previous, next) => {
  const newFeeds = differenceBy('id', [next.feed], previous.feeds);
  const newPosts = differenceBy('id', next.posts, previous.posts);

  return {
    feeds: [...previous.feeds, ...newFeeds],
    posts: [...previous.posts, ...newPosts],
  };
};