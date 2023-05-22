/** @type {import('next').NextConfig} */
const nextLogger = require('next-logger');
const nextConfig = {
    /* config options here */
    compiler:{
      removeConsole: true,
    }
  };
   
module.exports = nextConfig;