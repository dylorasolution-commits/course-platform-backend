const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Generate certificate for completed course
// @route   POST /api/certificates/generate/:courseId
// @access  Private
exports.generateCertificate = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructor');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const user = await User.findById(req.user.id);

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'You must be enrolled in the course to get a certificate',
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: req.user.id,
      course: course._id,
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated for this course',
        data: existingCertificate,
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      user: req.user.id,
      course: course._id,
      completionDate: new Date(),
      grade: req.body.grade || 'Pass',
      metadata: {
        courseTitle: course.title,
        instructorName: course.instructor.name,
        studentName: user.name,
        duration: course.duration,
      },
    });

    res.status(201).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private/Admin
exports.getCertificates = async (req, res) => {
  try {
    const { userId, courseId, page = 1, limit = 10 } = req.query;

    let query = {};

    if (userId) {
      query.user = userId;
    }

    if (courseId) {
      query.course = courseId;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const certificates = await Certificate.find(query)
      .populate('user', 'name email')
      .populate('course', 'title category')
      .skip(skip)
      .limit(limitNum)
      .sort('-createdAt');

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('course', 'title category duration instructor');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Check if user is authorized (certificate owner or admin)
    if (
      certificate.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate',
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber,
    })
      .populate('user', 'name')
      .populate('course', 'title duration');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        valid: false,
      });
    }

    if (!certificate.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Certificate has been revoked',
        valid: false,
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      data: {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.user.name,
        courseTitle: certificate.metadata.courseTitle,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Revoke certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
exports.revokeCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    certificate.isValid = false;
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Certificate revoked successfully',
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    await certificate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my certificates
// @route   GET /api/certificates/my
// @access  Private
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title category duration')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
