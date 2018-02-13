# SCEPTER-validation-lib
[![scepter-logo](http://res.cloudinary.com/source-4-society/image/upload/v1514622047/scepter_hzpcqt.png)](https://github.com/source4societyorg/SCEPTER-core)

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