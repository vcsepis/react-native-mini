module.exports = {
  root: true,
  extends: '@react-native',
  endOfLine: 'auto',
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  },
  "react/no-unstable-nested-components": [
    "off" | "warn" | "error",
    {
      "allowAsProps": true | false,
      "customValidators": [] 
    }
  ],
  "react/self-closing-comp": ["error", {
    "component": true,
    "html": true
  }]
};
