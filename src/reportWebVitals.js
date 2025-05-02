// reportWebVitals.js
// Utility to measure and report web performance metrics (optional).

const reportWebVitals = (onPerfEntry) => {
  // If a callback is provided, import web-vitals and report metrics.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
