module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@database': './src/database',
        '@models': './app/src/models',
        '@controllers': './src/app/controllers',
        '@utils': './src/app/utils',
        '@config': './src/config',
        '@modules': './src/modules'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
