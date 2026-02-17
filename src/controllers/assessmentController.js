const Assessment = require('../models/Assessment');

const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('course', 'title').populate('user', 'name');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course', 'title').populate('user', 'name');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAssessment = async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment };