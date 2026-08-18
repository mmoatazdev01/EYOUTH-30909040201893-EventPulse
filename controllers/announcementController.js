const Message = require('../models/Message');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const message = await Message.create({
    event: eventId,
    sender: req.user.id,
    text
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name email')
    .populate('event');

  req.app.get('io').to(eventId).emit('announcement', populatedMessage);

  res.status(201).json({
    status: 'success',
    data: populatedMessage
  });
});

exports.getAnnouncementsByEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const messages = await Message.find({ event: req.params.eventId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email');

  res.status(200).json({
    status: 'success',
    count: messages.length,
    data: messages
  });
});
