const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid event id')], validate, getEventById);

router.post(
  '/',
  [
    requireAuth,
    requireRole('admin'),
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isMongoId().withMessage('Category must be a valid Mongo ID'),
    body('date').isISO8601().withMessage('Valid event date is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('venue').notEmpty().withMessage('Venue is required'),
    body('capacity').isFloat({ min: 1 }).withMessage('Capacity must be a positive number')
  ],
  validate,
  createEvent
);

router.patch(
  '/:id',
  [
    requireAuth,
    requireRole('admin'),
    param('id').isMongoId().withMessage('Invalid event id')
  ],
  validate,
  updateEvent
);

router.delete(
  '/:id',
  [
    requireAuth,
    requireRole('admin'),
    param('id').isMongoId().withMessage('Invalid event id')
  ],
  validate,
  deleteEvent
);

module.exports = router;
