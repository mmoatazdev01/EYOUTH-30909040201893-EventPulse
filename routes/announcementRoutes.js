const express = require('express');
const { body, param } = require('express-validator');
const {
  createAnnouncement,
  getAnnouncementsByEvent
} = require('../controllers/announcementController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    requireAuth,
    requireRole('admin'),
    body('eventId').isMongoId().withMessage('Valid event ID is required'),
    body('text').notEmpty().withMessage('Announcement text is required')
  ],
  validate,
  createAnnouncement
);

router.get(
  '/:eventId',
  [param('eventId').isMongoId().withMessage('Valid event ID is required')],
  validate,
  getAnnouncementsByEvent
);

module.exports = router;
