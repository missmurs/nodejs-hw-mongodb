import { Contact } from '../db/models/contacts.js';
import { SORT_ORDER } from '../constants/index.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContactsById = async (contactId) => {
  const contacts = await Contact.findById(contactId);
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};
export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete({
    _id: contactId,
  });

  return contact;
};
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();
  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();
  contactsQuery.where('userId').equals(userId);
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};
