const express = require('express');
const { getAllCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/certificate.controller');

const router = express.Router();

router.get('/', getAllCertificates);
router.get('/:id', getCertificateById);
router.post('/', createCertificate);
router.put('/:id', updateCertificate);
router.delete('/:id', deleteCertificate);

module.exports = router;
