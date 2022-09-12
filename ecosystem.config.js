module.exports = {
  apps : [{
    name: "datadrop",
    script: "build/index.js",
    output: "./logs/out.log",
    error: "./logs/err.log",
    log: "./logs/combined.outerr.log",
    log_date_format: "DD-MM-YYYY HH:mm:ss",
  }]
};
