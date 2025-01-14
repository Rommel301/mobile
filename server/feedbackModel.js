const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

module.exports = FeedbackModel;

