import { TaskInputErrors, TaskInputName } from '../../types';

export const getErrors = (data: [TaskInputName, FormDataEntryValue][]) => {
  const errors: TaskInputErrors = {
    text: '',
    user: '',
  };

  for (const [name, value] of data) {
    if (typeof value === 'string') {
      if (value.length === 0) {
        errors[name] = 'Отсутствие задачи отсутствие смысла';
        continue;
      }
    }

    switch (name) {
      case 'text': {
        if (typeof value !== 'string') {
          break;
        }
        if (value.length < 5) {
          errors[name] = 'Краткость сестра таланта (не меньше 5 символов)';
        }
        if (value.length > 40) {
          errors[name] = 'Краткость сестра таланта (не больше 40 символов)';
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  return errors;
};
