const form = (value) => {
  const { submit } = document.querySelector('.rss-form').elements;

  switch (value) {
    case 'active':
      submit.disabled = true;
      break;

    case 'sending':
      submit.disabled = true;
      break;

    case 'finished':
      submit.disabled = false;
      break;

    case 'failed':
      submit.disabled = true;
      break;

    default:
      break;
  }
};

export default form;
