// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // Desactive les regles de mise en forme : c'est prettier qui s'en charge,
  // via lint:check. Pas de double execution.
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Une promesse non attendue est ce qui a rendu les erreurs invisibles
      // cote frontend : on ne veut pas du meme angle mort ici.
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
);
