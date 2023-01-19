import React, { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import { TaskInputErrors, TaskInputName, TaskInputRefs, TaskInputValues } from '../../types';
import { getAuth } from 'firebase/auth';
import { getErrors } from '@components/AddTodo/helpers';
import { completeTodo, deleteTodo, updateTodo } from '../../api';
import { IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import classNames from 'classnames/bind';
import './Todo.css';

interface Props {
  id: string;
  text: string;
  completed?: boolean;
  created?: {
    nanoseconds: number;
    seconds: number;
  };
  onUpdate: VoidFunction;
}

export const Todo: FC<Props> = ({ id, text, completed, created, onUpdate }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(completed);
  const auth = getAuth();
  const user = auth.currentUser?.email;
  const seconds = created?.seconds as number;
  const todoDate = new Date(seconds * 1000).toDateString();

  const inputRefs: TaskInputRefs = {
    text: useRef<HTMLTextAreaElement>(),
    user: useRef<HTMLInputElement>(),
  };
  const [inputErrors, setInputErrors] = useState<TaskInputErrors>({
    text: '',
    user: '',
  });
  const [inputValues, setInputValues] = useState<TaskInputValues>({
    text: text,
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
  const saveChanges = () => {
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
    updateTodo(id, inputValues)
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        setSnackbarMessage(`${error.message}`);
      });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const deleteAction = async () => {
    deleteTodo(id)
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        setSnackbarMessage(`❌ ${error.message}`);
      });
  };

  const complete = async () => {
    setStatus(!status);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status !== completed) {
        completeTodo(id, status as boolean)
          .then(() => {
            onUpdate();
          })
          .catch((error) => {
            setSnackbarMessage(`❌ ${error.message}`);
          });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <form noValidate onSubmit={onSubmit}>
      {snackbarMessage && <div className="message-error">{snackbarMessage} Message of error here</div>}

      <div className="todo">
        <span className={classNames('checkbox-custom', status ? 'completed' : '')} onClick={complete} />
        {!completed && (
          <>
            <input
              type="text"
              name="text"
              className="todo__input"
              ref={inputRefs.text}
              value={inputValues.text}
              onChange={onChangeInput}
              onBlur={saveChanges}
              autoComplete="off"
            />
            <input type="hidden" name="user" ref={inputRefs.user} value={inputValues.user} />
          </>
        )}

        {completed && <span className="todo__text">{text}</span>}
        <span className="todo__date">{todoDate}</span>

        <IconButton size="small" color="inherit" onClick={deleteAction}>
          <DeleteOutlineIcon />
        </IconButton>
      </div>
      <span className="message-error">{inputErrors.text}</span>
    </form>
  );
};
