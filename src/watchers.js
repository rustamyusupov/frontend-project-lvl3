import onChange from 'on-change';

import renderValidation from './renders/validation';

export const form = (state) => onChange(state.form, () => {
  // renderForm(state);
});

export const validation = (state) => onChange(state.form.errors, () => {
  renderValidation(state);
});
