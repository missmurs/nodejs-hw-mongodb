import {
  getAllContacts,
  getContactsById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../../utils/env.js';
import fs from 'node:fs/promises';
import path from 'node:path';
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Successfully found  contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactsById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const result = await updateContact(contactId, userId, req.body, {
      upsert: true,
    });

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully upserted a Contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
export const createContactController = async (req, res, next) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contactData = {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  };

  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(
    { _id: contactId, userId: req.user._id },
    {
      ...req.body,
      photo: photoUrl,
    },
  );

  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} is not found`);
  }

  res.json({
    status: 200,
    message: `Contact is successfully patched!`,
    data: result.contact,
  });
};
