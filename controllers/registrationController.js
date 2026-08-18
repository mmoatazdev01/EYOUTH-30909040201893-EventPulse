const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const existingRegistration = await Registration.findOne({ event: eventId, attendee: req.user.id });
  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 409));
  }

  const registrationCount = await Registration.countDocuments({ event: eventId });
  if (registrationCount >= event.capacity) {
    return next(new AppError('Event capacity reached', 400));
  }

  const registration = await Registration.create({
    event: eventId,
    attendee: req.user.id
  });

  const populatedRegistration = await Registration.findById(registration._id)
    .populate('event')
    .populate('attendee', 'name email');

  res.status(201).json({
    status: 'success',
    data: populatedRegistration
  });
});

exports.getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ attendee: req.user.id })
    .populate({
      path: 'event',
      populate: { path: 'category' }
    })
    .populate('attendee', 'name email');

  res.status(200).json({
    status: 'success',
    count: registrations.length,
    data: registrations
  });
});

exports.deleteRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.attendee.toString() !== req.user.id) {
    return next(new AppError('You are not allowed to delete this registration', 403));
  }

  await registration.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Registration deleted successfully'
  });
});
