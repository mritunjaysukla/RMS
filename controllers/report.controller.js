const prisma = require('../models/prismaClient');

// Submit weekly sales report
const submitReport = async (req, res) => {
  const { salesData } = req.body;
  try {
    const report = await prisma.report.create({ data: salesData });
    res.json({ success: true, data: report });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: error.message || 'Error submitting report'
      });
  }
};

module.exports = { submitReport };
