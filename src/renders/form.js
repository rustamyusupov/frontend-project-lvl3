import i18next from 'i18next';

const form = (value) => {
  const { url, submit } = document.querySelector('.rss-form').elements;
  const feedback = document.querySelector('.feedback');
  const { state, error } = value;

  switch (state) {
    case 'active':
      url.disabled = false;
      submit.disabled = false;
      break;

    case 'sending':
      url.disabled = true;
      submit.disabled = true;
      break;

    case 'finished':
      url.value = '';
      url.disabled = false;
      submit.disabled = false;
      break;

    case 'failed':
      url.disabled = false;
      submit.disabled = true;

      feedback.classList.add('text-danger');
      feedback.innerHTML = i18next.t(error);

      break;

    default:
      throw new Error(`Unknown form state: '${state}'!`);
  }
};

export default form;
