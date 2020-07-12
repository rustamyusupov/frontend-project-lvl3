import { form, validation } from './renders';

const watchers = (path, value) => {
  switch (path) {
    case 'form.state':
      form(value);
      break;

    case 'form.validation':
      validation(value);
      break;

    default:
      break;
  }
};

export default watchers;
