import React, { FC, useEffect, useState } from 'react';
import './HomePage.css';
import { ITodo } from '../../types';
import { getUsersTodos } from '../../api';
import { getAuth } from 'firebase/auth';
import { Todo } from '@components/Todo/Todo';
import { AddTodo } from '@components/AddTodo/AddTodo';
import { Title } from '@components/Title/Title';

export const HomePage: FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);

  const [showIntro, setShowIntro] = useState(true);
  const [showTodoList, setShowTodoList] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [loggedList, setLoggedList] = useState(false);
  const [showLoggedList, setShowLoggedList] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser?.email;

  useEffect(() => {
    (async () => {
      const todos = await getUsersTodos(user as string, false);
      setTodos(todos);

      const completedTodos = await getUsersTodos(user as string, true);
      setCompletedTodos(completedTodos);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      setShowTodoList(true);
      setShowIntro(false);
      setShowMotivation(false);
    } else {
      setShowTodoList(false);
    }

    if (todos.length === 0 && completedTodos.length === 0) {
      setShowIntro(true);
      setShowMotivation(false);
    }

    if (todos.length === 0 && completedTodos.length > 0) {
      setShowIntro(false);
      setShowMotivation(true);
    }

    if (completedTodos.length > 0) {
      setLoggedList(true);
    } else {
      setLoggedList(false);
    }
  }, [todos, completedTodos]);

  const onUpdate = () => {
    (async () => {
      const todos = await getUsersTodos(user as string, false);
      setTodos(todos);

      const completedTodos = await getUsersTodos(user as string, true);
      setCompletedTodos(completedTodos);
    })();
  };

  const loggedListToggle = () => {
    setShowLoggedList(!showLoggedList);
  };

  return (
    <div className="home-page">
      {!loading && (
        <>
          {showIntro && (
            <section className="container">
              <Title Component="h2">Список задач пуст!</Title>
            </section>
          )}

          {showMotivation && (
            <section className="container">
              <Title Component="h2">Все задачи выполнены!</Title>
            </section>
          )}

          <section className="container">
            <AddTodo onUpdate={onUpdate} />
          </section>

          {showTodoList && (
            <section className="container">
              {todos.map((item) => {
                return (
                  <Todo
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    completed={item.completed}
                    created={item.created}
                    onUpdate={onUpdate}
                  />
                );
              })}
            </section>
          )}

          {loggedList && (
            <section className="container container__logbook">
              <a onClick={loggedListToggle} className="logbook-link">
                {showLoggedList ? 'Скрыть' : 'Показать'} завершенные задачи ({completedTodos.length})
              </a>

              {showLoggedList && (
                <>
                  {completedTodos.map((item) => {
                    return (
                      <Todo
                        key={`completed-${item.id}`}
                        id={item.id}
                        text={item.text}
                        completed={item.completed}
                        created={item.created}
                        onUpdate={onUpdate}
                      />
                    );
                  })}
                </>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};
