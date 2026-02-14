const express = require('express');
const { getAllAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment } = require('../controllers/assessment.controller');

const router = express.Router();

router.get('/', getAllAssessments);
router.get('/:id', getAssessmentById);
router.post('/', createAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

module.exports = router;
