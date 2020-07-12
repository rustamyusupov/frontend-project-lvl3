import { uniqueId, differenceBy } from 'lodash/fp';

export const getContent = (url, data) => {
  const feedId = uniqueId();

  const feed = {
    id: feedId,
    url,
    title: data.title,
    description: data.description,
  };

  const posts = data.posts.map(({ title, link }) => {
    const id = uniqueId();

    return {
      id,
      feedId,
      title,
      link,
    };
  });

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