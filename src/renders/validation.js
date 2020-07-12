import {
  flow,
  get,
  isEqual,
  getOr,
} from 'lodash/fp';

const validation = (value) => {
  const { url, submit } = document.querySelector('.rss-form').elements;
  const feedback = document.querySelector('.feedback');
  const isInvalid = flow(get('state'), isEqual('invalid'))(value);
  const error = getOr('', ['errors', 0])(value);

  url.classList.toggle('is-invalid', isInvalid);
  submit.disabled = isInvalid;
  feedback.classList.toggle('text-danger', isInvalid);
  feedback.innerHTML = error;
};

export default validation;
