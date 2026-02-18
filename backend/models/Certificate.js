const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F', 'Pass'],
    default: 'Pass',
  },
  downloadUrl: String,
  metadata: {
    courseTitle: String,
    instructorName: String,
    studentName: String,
    duration: Number, // in hours
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate certificate number before saving
CertificateSchema.pre('save', async function (next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateNumber = `CERT-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', CertificateSchema);
