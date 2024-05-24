/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  basePath: process.env.BASEPATH,

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Only run the copy plugin on the client build
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              // Copy the binary Oracle DB driver to the output directory
              from: path.join(process.cwd(), 'node_modules/oracledb/build/Release'),
              to: path.join(process.cwd(), '.next/server/build/Release') // Ensure correct output path
            }
          ]
        })
      )
    }

    // Other custom webpack configurations can go here

    return config
  }
}
