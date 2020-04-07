const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://nexthop.duckdns.org/jackett/',
      changeOrigin: true,
      headers: {
        cookie: 'Jackett=CfDJ8OY9xBh3xAxCtJ5-PKVvu6ShWUnyxZyhzaH39ctU8SI92qqyTr3tyH9QCNFbO8g1TwZfHPhLkfP3I959gRIbzr3nHZJrpLCO3Yqs64yy1rJPJdS2C6AR_iXayPqQCxgDovjcY6oIqpLg0bwTMTdSCnzsSDr6UE1SzFTIWtzbT7U8GZ1jJ1EX1I9xNYFLp220jINrQ_-EREP2TvaL5WLM0dFDel3bPATQ55H0_6PlSkDLDfCXLeV8ClLZGhmsljEAFfwP4rfvzMjhvVyDVc3R_Pwmbzh-JfQPiuE8JRC5PkzIlmL72iafg1cACvE3F3e6xwSKlU_WDLBgYMB87K08hS0; REMEMBERME=V2FsbGFiYWdcVXNlckJ1bmRsZVxFbnRpdHlcVXNlcjpZV1J0YVc0PToxNjA5OTcyNTIyOjBkZDFkZWY1ZTYwNDA1Y2NmZTRlMTZjZjc4NDZmOWJlZjc4YmU3ZGM5NDliMWYzNTFmMDgyZTBmNDVmMjA2MmQ%3D; ttrss_sid=4m6c455u0nntf48rf24rhe4pa5; PHPSESSID=7acgn3sq1iho15khbvhhrimrks'
      }
    })
  );
};
