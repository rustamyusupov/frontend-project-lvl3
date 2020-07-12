import { string, object } from 'yup';

const validate = (url, urls) => {
  const schema = object().shape({
    url: string().required().url().notOneOf(urls),
  });

  try {
    schema.validateSync({ url });

    return [];
  } catch (err) {
    return err.errors;
  }
};

export default validate;
