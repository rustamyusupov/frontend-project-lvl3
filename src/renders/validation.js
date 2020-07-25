import { isEqual } from 'lodash/fp';
import i18next from 'i18next';

const validation = ({ state, error }) => {
  const { url, submit } = document.querySelector('.rss-form').elements;
  const feedback = document.querySelector('.feedback');
  const isInvalid = isEqual('invalid')(state);

  url.classList.toggle('is-invalid', isInvalid);
  submit.disabled = isInvalid;
  feedback.classList.toggle('text-danger', isInvalid);
  feedback.innerHTML = i18next.t(error);
};

export default validation;
