const form = (value) => {
  const { url, submit } = document.querySelector('.rss-form').elements;

  switch (value) {
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
      break;

    default:
      break;
  }
};

export default form;
