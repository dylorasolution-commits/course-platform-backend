const express = require('express');
const router = express.Router();

const {
  generateCertificate,
  getCertificates,
  getCertificate,
  verifyCertificate,
  revokeCertificate,
  deleteCertificate,
  getMyCertificates,
} = require('../controllers/certificateController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/verify/:certificateNumber', verifyCertificate);

// Private routes
router.post('/generate/:courseId', protect, generateCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/:id', protect, getCertificate);

// Admin routes
router.get('/', protect, authorize('admin'), getCertificates);
router.put('/:id/revoke', protect, authorize('admin'), revokeCertificate);
router.delete('/:id', protect, authorize('admin'), deleteCertificate);

module.exports = router;
