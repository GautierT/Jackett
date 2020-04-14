const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://nexthop.duckdns.org/jackett/',
      changeOrigin: true,
      headers: {
        cookie: 'Jackett=CfDJ8OY9xBh3xAxCtJ5-PKVvu6QfQO8NmtxBEug5CSNuF20NShuBUfn8vMn9rOLwTElBhJFswuRqa0D-iwygjFoeqa6Td_ZrKACb-iHfpFArWj8uoAb4nzjS1wp8fFKzq7eHPRekZttNAcBzPpGewd20tMSIXyMpeXgiDxE5WO7czUIozulJPxminUKCJ9fk3HQVxfyMHUX4NrLU1KPVCQyDh50zHBdneF5-RfCJJmJTIcLwwWm2xuonr_Yek-prnjnLMe1pblD5bn4RwwUq1LDlNdiF2JMN1PwtR5vSLwlVr_pyBzK6xuR2gti_-nxKs4nE5VZ3RlXjNBgpJ4dB8lKoSSo; REMEMBERME=V2FsbGFiYWdcVXNlckJ1bmRsZVxFbnRpdHlcVXNlcjpZV1J0YVc0PToxNjA5OTcyNTIyOjBkZDFkZWY1ZTYwNDA1Y2NmZTRlMTZjZjc4NDZmOWJlZjc4YmU3ZGM5NDliMWYzNTFmMDgyZTBmNDVmMjA2MmQ%3D; ttrss_sid=4m6c455u0nntf48rf24rhe4pa5; PHPSESSID=7acgn3sq1iho15khbvhhrimrks'
      }
    })
  );
};
