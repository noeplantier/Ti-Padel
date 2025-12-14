module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ti-padel.com' }],
        destination: 'https://ti-padel.com/:path*',
        permanent: true,
      },
    ];
  },
};
