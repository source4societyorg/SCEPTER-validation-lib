test('required validator returns false when value is empty', () => {
  const required = require('../validators').required
  expect(required(undefined)).toEqual(false)
  expect(required('')).toEqual(false)
  expect(required(null)).toEqual(false)
  expect(required({})).toEqual(false)
  expect(required([])).toEqual(false)
  expect(required('value given')).toEqual(true)
})

test('email validators returns false when value is not a valid email', () => {
  const email = require('../validators').email
  expect(email('notemail')).toEqual(false)
  expect(email('notemail@something')).toEqual(false)
  expect(email('this@validemail.com')).toEqual(true)
  expect(email('this@cyint.technology')).toEqual(true)
})

test('integer validators returns false when value is not a valid integer', () => {
  const integer = require('../validators').integer
  expect(integer(1.5)).toEqual(false)
  expect(integer('notinteger')).toEqual(false)
  expect(integer([])).toEqual(false)
  expect(integer({})).toEqual(false)
  expect(integer(1)).toEqual(true)
  expect(integer(0)).toEqual(true)
  expect(integer(-1)).toEqual(true)
  expect(integer(NaN)).toEqual(false)
})

test('decimal validators returns false when value is not a valid decimal', () => {
  const decimal = require('../validators').decimal
  expect(decimal('notinteger')).toEqual(false)
  expect(decimal([])).toEqual(false)
  expect(decimal({})).toEqual(false)
  expect(decimal(1)).toEqual(true)
  expect(decimal(0)).toEqual(true)
  expect(decimal(-1)).toEqual(true)
  expect(decimal(1.5)).toEqual(true)
  expect(decimal(-1.5)).toEqual(true)
  expect(decimal(NaN)).toEqual(false)
})

test('nonegative validators returns false when value is less than 0', () => {
  const nonegative = require('../validators').nonegative
  expect(nonegative('notinteger')).toEqual(false)
  expect(nonegative([])).toEqual(false)
  expect(nonegative({})).toEqual(false)
  expect(nonegative(-1)).toEqual(false)
  expect(nonegative(-0.5)).toEqual(false)
  expect(nonegative(0)).toEqual(true)
  expect(nonegative(1)).toEqual(true)
  expect(nonegative(1.5)).toEqual(true)
  expect(nonegative(NaN)).toEqual(false)
})

test('website validator returns false when value is not an http/https protocol url', () => {
  const website = require('../validators').website
  expect(website('notwebsite')).toEqual(false)
  expect(website([])).toEqual(false)
  expect(website({})).toEqual(false)
  expect(website(-1)).toEqual(false)
  expect(website(-0.5)).toEqual(false)
  expect(website(0)).toEqual(false)
  expect(website('http')).toEqual(false)
  expect(website('https')).toEqual(false)
  expect(website('http://somesite.com')).toEqual(true)
  expect(website('https://somesite.com')).toEqual(true)
})

test('pdf validator returns false when value is not an pdf extension', () => {
  const pdf = require('../validators').pdf
  expect(pdf('notpdf')).toEqual(false)
  expect(pdf([])).toEqual(false)
  expect(pdf({})).toEqual(false)
  expect(pdf(-1)).toEqual(false)
  expect(pdf(-0.5)).toEqual(false)
  expect(pdf(0)).toEqual(false)
  expect(pdf('pdf')).toEqual(false)
  expect(pdf('.pdf')).toEqual(true)
  expect(pdf('pdffile')).toEqual(false)
  expect(pdf('somefile.pdf')).toEqual(true)
})

test('matchField validator returns false when values do not match', () => {
  const values = { 'value1': 1, 'value2': 2 }
  const matchField = require('../validators').matchField
  const matchFieldValidator = matchField('value2')
  expect(matchFieldValidator(1, values)).toEqual(false)
  expect(matchFieldValidator('Test', values)).toEqual(false)
  expect(matchFieldValidator(2, values)).toEqual(true)
  expect(matchFieldValidator(1, values)).toEqual(false)
})

test('phone validator returns false when value is not a valid 10 digit phone', () => {
  const phone = require('../validators').phone
  expect(phone(12345)).toEqual(false)
  expect(phone('somestring')).toEqual(false)
  expect(phone('12345')).toEqual(false)
  expect(phone(1234567890)).toEqual(true)
  expect(phone('1234567890')).toEqual(true)
  expect(phone('123-456-7890')).toEqual(true)
  expect(phone('(123)-456-7890')).toEqual(true)
  expect(phone('12345678901')).toEqual(false)
})

test('ifOneOf validator returns false if value is not within the list of options', () => {
  const ifOneOf = require('../validators').ifOneOf
  let ifOneOfValidator = ifOneOf(['something', 1234, 'else'])
  expect(ifOneOfValidator('123')).toEqual(false)
  ifOneOfValidator = ifOneOf([])
  expect(ifOneOfValidator('123')).toEqual(false)
  ifOneOfValidator = ifOneOf(['something', '123', 'else'])
  expect(ifOneOfValidator('123', ['something', '123', 'else'])).toEqual(true)
})

test('Custom validator returns false if regex does not match', () => {
  const custom = require('../validators').custom
  const customValidator = custom(/^\d$/)
  expect(customValidator('123')).toEqual(false)
  expect(customValidator(123)).toEqual(false)
  expect(customValidator(1)).toEqual(true)
})

test('validate function will loop through validation object and call validateField on each', (done) => {
  const validate = require('../validators').validate
  const mockValidateField = () => done()
  const validationObject = {
    someField: [{
      validator: require('../validators').required
    }],
    someOtherField: [{
      validator: require('../validators').required
    }]
  }

  const values = {
    someField: 'value'
  }

  validate(values, validationObject, mockValidateField)
})

test('validateFieldFunction will return error object if validations object is empty', () => {
  const validateFieldFunction = require('../validators').validateFieldFunction
  const mockErrors = { error: 'mock' }
  expect(validateFieldFunction(mockErrors)).toEqual(mockErrors)
})

test('validateFieldFunction will iterate through each validator and call performValidation', (done) => {
  const validateFieldFunction = require('../validators').validateFieldFunction
  const mockErrors = { error: 'mock' }
  const mockValidations = [{ validator: 'test' }, { validator: 'test2' }]
  const mockPerformValidation = () => { done(); return mockErrors }

  expect(validateFieldFunction(mockErrors, mockValidations, {}, '', {}, mockPerformValidation)).toEqual(mockErrors)
})

test('performValidationFunction will skip validation if ifNotEmpty flag is set on validator and field is empty', () => {
  const performValidationFunction = require('../validators').performValidationFunction
  const mockErrors = {}
  const mockValidatorItem = { validator: require('../validators').required, ifNotEmpty: true, invalidMessage: 'Invalid field' }
  expect(performValidationFunction(mockErrors, mockValidatorItem, {}, 'testproperty')).toEqual(mockErrors)
})

test('performValidationFunction will return error object if validation passes', () => {
  const performValidationFunction = require('../validators').performValidationFunction
  const mockErrors = {}
  const mockValidatorItem = { validator: require('../validators').required, invalidMessage: 'Invalid field' }
  expect(performValidationFunction(mockErrors, mockValidatorItem, 'not empty', 'testproperty')).toEqual(mockErrors)
})

test('performValidationFunction will return error object with invalidMessages added if validation fails', () => {
  const performValidationFunction = require('../validators').performValidationFunction
  const mockErrors = {}
  const mockValidatorItem = { validator: require('../validators').required, invalidMessage: 'Invalid field' }
  expect(performValidationFunction(mockErrors, mockValidatorItem, '', 'testproperty')).toEqual({testproperty: 'Invalid field'})
})
