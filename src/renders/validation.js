import i18next from 'i18next';

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
  const { type } = getOr({}, 'error')(value);

  url.classList.toggle('is-invalid', isInvalid);
  submit.disabled = isInvalid;
  feedback.classList.toggle('text-danger', isInvalid);
  feedback.innerHTML = i18next.t(type);
};

export default validation;
