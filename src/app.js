import { validation } from './watchers';
import validate from './validator';

const app = () => {
  const state = {
    form: {
      errors: [],
    },
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('.rss-form');
  const validationWatcher = validation(state);

  const handleInput = (e) => {
    const url = e.currentTarget.value;

    validationWatcher.errors = validate(url, []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  form.elements.url.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
};

export default app;
