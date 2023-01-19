import React, { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { TaskInputErrors, TaskInputName, TaskInputRefs, TaskInputValues } from '../../types';
import { getAuth } from 'firebase/auth';
import { getErrors } from '@components/AddTodo/helpers';
import './AddTodo.css';
import { createTodo } from '../../api';
import { Button } from '@components/Button/Button';

interface Props {
  onUpdate: VoidFunction;
}

export const AddTodo: FC<Props> = ({ onUpdate }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const auth = getAuth();
  const user = auth.currentUser?.email;

  const inputRefs: TaskInputRefs = {
    text: useRef<HTMLTextAreaElement>(),
    user: useRef<HTMLInputElement>(),
  };
  const [inputErrors, setInputErrors] = useState<TaskInputErrors>({
    text: '',
    user: '',
  });
  const [inputValues, setInputValues] = useState<TaskInputValues>({
    text: '',
    user: user as string,
  });

  const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = event.currentTarget;
    const name = input.name;
    const value = input.value;

    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Собрать данные
    const data = new FormData();

    Object.entries(inputValues).forEach(([name, value]) => {
      data.append(name, value);
    });

    // 2. Проверить данные
    const errors = getErrors(Array.from(data.entries()) as [TaskInputName, FormDataEntryValue][]);

    const errorsEntries = Object.entries(errors);

    // 3.1 подсветить ошибки
    setInputErrors(errors);

    // 3.2 Сфокусироваться на первом ошибочном инпуте
    const errorInput = errorsEntries.find(([, value]) => value.length > 0);

    if (errorInput) {
      const name = errorInput[0] as TaskInputName;
      const inputRef = inputRefs[name];

      if (inputRef.current) {
        inputRef.current.focus();
      }

      return;
    }

    // 4. Если все ок, отправить данные
    createTodo(inputValues)
      .then(() => {
        // setSnackbarMessage('Задача создана');
        setInputValues({
          ...inputValues,
          text: '',
        });
        onUpdate();
      })
      .catch((error) => {
        setSnackbarMessage(`${error.message}`);
      });
  };
  return (
    <form noValidate onSubmit={onSubmit}>
      {snackbarMessage && <div className="message-error">{snackbarMessage}</div>}

      <div className="todo-add-container">
        <div className="form-add-todo">
          <input
            type="text"
            name="text"
            className="form-add-todo__input"
            ref={inputRefs.text}
            value={inputValues.text}
            onChange={onChangeInput}
            autoComplete="off"
            placeholder="Добавить новую задачу"
          />

          <input type="hidden" name="user" ref={inputRefs.user} value={inputValues.user} />
          <Button type="submit">+</Button>
        </div>
        <span className="message-error">{inputErrors.text}</span>
      </div>
    </form>
  );
};
