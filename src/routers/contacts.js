import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getAllContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

router.post(
  '/register',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
