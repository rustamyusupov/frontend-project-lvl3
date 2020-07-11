import { string, object } from 'yup';

const validator = (url, urls) => {
  const schema = object().shape({
    url: string().required().url().notOneOf(urls),
  });

  return schema.validate({ url });
};

export default validator;
