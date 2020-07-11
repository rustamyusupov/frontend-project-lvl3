import {
  flow,
  get,
  isEqual,
  getOr,
} from 'lodash/fp';

const validation = (state) => {
  const isInvalid = flow(get('form.validationState'), isEqual('invalid'))(state);
  const error = getOr('', ['form', 'errors', 0])(state);
  const form = document.querySelector('.rss-form');
  const feedback = document.querySelector('.feedback');

  form.elements.url.classList.toggle('is-invalid', isInvalid);
  feedback.classList.toggle('text-danger', isInvalid);
  feedback.innerHTML = error;
};

export default validation;
