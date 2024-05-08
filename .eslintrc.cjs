module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'node_modules',
    '**/*.json',
    '**/*.js',
    '**/*.css',
    '**/*.html',
    '**/*.htm',
    '**/*.xml',
    '**/*.txt',
    '**/*.md',
    '**/*.markdown',
    '**/*.yml',
    '**/*.yaml',
    '**/*.csv',
    '**/*.tsv',
    '**/*.ini',
    '**/*.conf',
    '**/*.config',
    '**/*.properties',
    '**/*.toml',
    '**/*.lock',
    '**/*.log',
    '**/*.sql',
    '**/*.db',
    '**/*.sqlite',
    '**/*.sqlite3',
    '**/*.sqlite2',
    '**/*.sqlite-journal',
    '**/*.sqlite3-journal',
    '**/*.sqlite2-journal',
    '**/*.sqlite-shm',
    '**/*.sqlite3-shm',
    '**/*.sqlite2-shm',
    '**/*.sqlite-wal',
    '**/*.sqlite3-wal',
    '**/*.sqlite2-wal',
    '**/*.sqlite-wal-journal',
    '**/*.sqlite3-wal-journal',
    '**/*.sqlite2-wal-journal',
    '**/*.sqlite-wal-shm',
    '**/*.sqlite3-wal-shm',
    '**/*.sqlite2-wal-shm',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
