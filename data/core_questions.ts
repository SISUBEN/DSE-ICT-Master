import { MCQ, LongQuestion } from '../types';
import { modA } from './core_modules/module_a';
import { modB } from './core_modules/module_b';
import { modC } from './core_modules/module_c';
import { modD } from './core_modules/module_d';
import { modE } from './core_modules/module_e';

export const CORE_MC_QUESTIONS: MCQ[] = [
  ...modA,
  ...modB,
  ...modC,
  ...modD,
  ...modE
];

export const CORE_LONG_QUESTIONS: LongQuestion[] = [];
