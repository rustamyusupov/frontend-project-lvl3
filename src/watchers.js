import { form, validation, content } from './renders';

const watchers = (path, value) => {
  switch (path) {
    case 'form.process':
      form(value);
      break;

    case 'form.validation':
      validation(value);
      break;

    case 'content':
      content(value);
      break;

    default:
      break;
  }
};

export default watchers;
