import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Поле "name" повинно бути текстом.',
    'string.empty': 'Поле "name" не може бути порожнім.',
    'string.min': 'Поле "name" повинно містити щонайменше 3 символи.',
    'string.max': 'Поле "name" повинно містити не більше 30 символів.',
    'any.required': 'Поле "name" є обов’язковим.',
  }),
  phoneNumber: Joi.string().length(12).required().messages({
    'string.base': 'Поле "phoneNumber" повинно бути текстом.',
    'string.length': 'Поле "phoneNumber" повинно містити рівно 12 символів.',
    'any.required': 'Поле "phoneNumber" є обов’язковим.',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Поле "email" повинно містити дійсну електронну адресу.',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal').required().messages({
    'any.only':
      'Поле "contactType" повинно містити значення "home" або "personal".',
    'any.required': 'Поле "contactType" є обов’язковим.',
  }),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),
  updatedAt: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Поле "name" повинно бути текстом.',
    'string.empty': 'Поле "name" не може бути порожнім.',
    'string.min': 'Поле "name" повинно містити щонайменше 3 символи.',
    'string.max': 'Поле "name" повинно містити не більше 30 символів.',
  }),
  phoneNumber: Joi.string().length(12).messages({
    'string.base': 'Поле "phoneNumber" повинно бути текстом.',
    'string.length': 'Поле "phoneNumber" повинно містити рівно 12 символів.',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Поле "email" повинно містити дійсну електронну адресу.',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal').messages({
    'any.only':
      'Поле "contactType" повинно містити значення "home" або "personal".',
  }),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),
  updatedAt: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),
});
