import { getOr } from 'lodash/fp';

const validation = (errors) => {
  const error = getOr('', 0)(errors);
  const form = document.querySelector('.rss-form');
  const feedback = document.querySelector('.feedback');

  form.elements.url.classList.toggle('is-invalid', error);
  feedback.classList.toggle('text-danger', error);
  feedback.innerHTML = error;
};

export default validation;
