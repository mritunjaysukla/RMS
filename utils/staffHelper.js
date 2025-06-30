// Time formatting helper
exports.timeSince = (date) => {
  const hours = Math.floor((Date.now() - date) / 3600000);
  return `${hours}h ago`;
};

// Metrics calculation helper
exports.calculateMetrics = (orders, startTime) => {
  const now = new Date();
  const metrics = {
    ordersServed: orders.length,
    totalEarnings: 0,
    totalDuration: 0
  };

  orders.forEach((order) => {
    metrics.totalEarnings += order.billingDetails?.total || 0;
    metrics.totalDuration += order.duration || 0;
  });

  return {
    serviceTime: ((now - startTime) / 3600000).toFixed(1) + ' hours',
    workingHours: ((now - startTime) / 3600000).toFixed(1) + ' hours',
    performanceStatus: {
      today: {
        ordersServed: metrics.ordersServed,
        averageTime:
          metrics.ordersServed > 0
            ? (metrics.totalDuration / metrics.ordersServed).toFixed(1) +
              'min/order'
            : 'N/A',
        total: `Rs. ${metrics.totalEarnings.toFixed(2)}`
      }
    }
  };
};
