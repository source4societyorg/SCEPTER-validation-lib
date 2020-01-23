# SCEPTER-validation-lib
[![scepter-logo](http://res.cloudinary.com/source-4-society/image/upload/v1519221119/scepter_hzpcqt.png)](https://github.com/source4societyorg/SCEPTER-core)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

[![Build Status](https://travis-ci.org/source4societyorg/SCEPTER-validation-lib.svg?branch=master)](https://travis-ci.org/source4societyorg/SCEPTER-validation-lib.svg?branch=master)

[![codecov](https://codecov.io/gh/source4societyorg/SCEPTER-validation-lib/branch/master/graph/badge.svg)](https://codecov.io/gh/source4societyorg/SCEPTER-validation-lib)

[![Serverless](http://public.serverless.com/badges/v1.svg)](http://serverless.com)


A library of useful validation functions

## Usage

Add this library to your project via `npm` or `yarn` with the command:

    npm install -S @source4society/scepter-validation-lib
or
    yarn add @source4society/scepter-validation-lib

Then in your code, you can reference the individual validation functions. For example, to export the required validator:

    const required = require('@source4society/scepter-validation-lib').required

When conducting validation, you can use the `validate` function

    const validate = require('@source4society/scepter-validation-lib').validate
    const errors = validate(values, validations)

The values object should just be a json of fields and their values to validate. For example, a login form might look like: 
    
    {
      username: 'myusername',
      password: 'mypassword'
    }

The validations object should be a list of field names with arrays of different validators to apply. Here are some examples against a login form:

    {
      username: [{
        validator: required,
        invalidMessage: 'Username is required.'
      }, {
        validator: email,
        invalidMessage: 'Username must be a valid email.'
      }],
      password: [{
        validator: required,
        invalidMessage: 'Password is required.',
      }],
      confirmPassword: [{
        validator: matchField('password'),
        invalidMessage: 'Password and confirm password must match',
      }]
      optional: [{
        validatior: integer,
        invalidMessage: 'optional must be an integer.',
        ifNotEmpty: true // will only perform this validation if the value is not empty
      }]
    }

When using with redux-forms, define the validations object beforehand and then pass it in to the composed form as follows:

    export default reduxForm({
      form: 'login',
      validate: (values) => validate(values, validations)
    })(LoginForm);

## Validations

### required
  
  Validation fails if the field is empty, after all whitespace is trimmed.

### email

  Validation fails if the field does not have an @ sign.

### integer

  Validation fails if the input is not an integer

### decimal

  Validation fails if the input is not a valid decimal

### nonegative

  Validation fails if the input is negative

### website

  Validation fails if the string is not a valid http or https url.

### pdf

  Validation fails if the input does not end in ".pdf"

### matchField

  Must be primed with the key of the field to match first. For example:
  confirmPassword: matchField('password')
  Validation fails if the input does not match the input of the field targeted by the key.

### phone

  Validation fails if it does not match a valid phone number (international or US)

### ifOneOf

  Must be primed with an array of options. For example:
  choices: ifOneOf(['A','B','C'])
  Validation fails if the input does not exist in the array of options

### custom

  Must be primed with a regular expression. For example:
  hasSpaces: custom(/' '/g)
  Validation fails if the regex does not find any match on the input.
  