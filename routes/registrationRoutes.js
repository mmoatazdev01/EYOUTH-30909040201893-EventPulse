const express = require('express');
const { body, param } = require('express-validator');
const {
  registerForEvent,
  getMyRegistrations,
  deleteRegistration
} = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    requireAuth,
    body('eventId').isMongoId().withMessage('Valid event ID is required')
  ],
  validate,
  registerForEvent
);

router.get('/my', requireAuth, getMyRegistrations);

router.delete(
  '/:id',
  [requireAuth, param('id').isMongoId().withMessage('Invalid registration id')],
  validate,
  deleteRegistration
);

module.exports = router;
