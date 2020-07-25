import { string, object } from 'yup';
import { get } from 'lodash/fp';

const validate = (url, urls) => {
  const schema = object().shape({
    url: string().required().url().notOneOf(urls),
  });

  try {
    schema.validateSync({ url });

    return [];
  } catch ({ type, errors }) {
    return { type, error: get(0)(errors) };
  }
};

export default validate;
