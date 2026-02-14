const Certificate = require('../models/Certificate');

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().populate('user', 'name').populate('course', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('user', 'name').populate('course', 'title');
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate };
