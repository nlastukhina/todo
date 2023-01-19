import { RefObject } from 'react';

export interface ITodo {
  id: string;
  text: string;
  user: string;
  completed?: boolean;
  created?: {
    nanoseconds: number;
    seconds: number;
  };
}

export type TaskInputName = 'text' | 'user';

export type TaskInputValues = {
  [key in TaskInputName]: string;
};

export type TaskInputErrors = {
  [key in TaskInputName]: string;
};

export type TaskInputRefs = {
  [key in TaskInputName]: RefObject<any>;
};
