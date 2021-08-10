module.exports = {
  env: { jest: true, },
  extends: "airbnb-base",
  rules: {
    "prefer-destructuring": ["error", {
      object: true,
      array: false
    }],
    "no-console": 0,
    "comma-dangle": 0,
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-return-assign": 0,
    quotes: ["error", "double"],
    camelcase: 0,
    "object-curly-newline": ["error", {
      multiline: true,
      minProperties: 4
    }],
    "object-property-newline": ["error", { allowAllPropertiesOnSameLine: false }]
  }
};
