const { prisma } = require('../utils/prisma');

// Get table status
exports.getTableStatus = async (req, res) => {
  try {
    const tables = await prisma.table.findMany();
    res.status(200).json({
      success: true,
      data: tables
    });
  } catch (error) {
    console.error('Error fetching table statuses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table statuses'
    });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  const { tableId } = req.params;
  const { status } = req.body; // Example: 'OCCUPIED'

  try {
    const updatedTable = await prisma.table.update({
      where: { id: parseInt(tableId) },
      data: { status }
    });

    res.status(200).json({
      success: true,
      message: 'Table status updated successfully',
      data: updatedTable
    });
  } catch (error) {
    console.error('Error updating table status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update table status'
    });
  }
};
