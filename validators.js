const utilities = require('@source4society/scepter-utility-lib')
const required = (value) => utilities.isNotEmpty(value)
const email = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value)
const integer = (value) => /^-?(0|[1-9]\d*)$/.test(value)
const decimal = (value) => !isNaN(parseFloat(value)) && isFinite(value)
const nonegative = (value) => parseFloat(value) >= 0
const website = (value) => /^(http|https):\/\/[^ "]+$/.test(value)
const pdf = (value) => /\.pdf$/.test(value)
const matchField = (value, value2) => value === value2
const phone = (value) => /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
const ifOneOf = (value, options) => options.indexOf(value) > -1
const custom = (value, regex) => regex.test(value)

const validateFieldFunction = (errors, validations, value, property, injectPerformValidation) => {
  const performValidation = utilities.valueOrDefault(injectPerformValidation, performValidationFunction)
  if (utilities.isEmpty(validations)) {
    return errors
  }

  let updatedErrors = Object.assign({}, errors)
  validations.forEach((validatorItem) => {
    updatedErrors = performValidation(errors, validatorItem, value, property)
  })

  return updatedErrors
}

const performValidationFunction = (errors, validatorItem, value, property) => {
  if ((validatorItem.ifNotEmpty === true && utilities.isEmpty(value)) || (utilities.isEmpty(validatorItem.validator))) {
    return errors
  }
  if (validatorItem.validator(value, ...utilities.valueOrDefault(validatorItem.parameters, []))) {
    return errors
  }

  const updatedErrors = Object.assign({}, errors)

  updatedErrors[property] = utilities.ifTrueElseDefault(
    utilities.isNotEmpty(updatedErrors[property]),
    `${updatedErrors[property]} ${validatorItem.invalidMessage}`,
    validatorItem.invalidMessage
  )

  return updatedErrors
}

const validate = (values, validations, injectValidateField) => {
  const validateField = utilities.valueOrDefault(injectValidateField, validateFieldFunction)
  let errors = {}
  Object.keys(validations).forEach((property) => {
    errors = validateField(errors, validations[property], values[property])
  })
  return errors
}

module.exports.required = required
module.exports.email = email
module.exports.integer = integer
module.exports.decimal = decimal
module.exports.nonegative = nonegative
module.exports.website = website
module.exports.pdf = pdf
module.exports.matchField = matchField
module.exports.phone = phone
module.exports.ifOneOf = ifOneOf
module.exports.custom = custom
module.exports.validate = validate
module.exports.validateFieldFunction = validateFieldFunction
module.exports.performValidationFunction = performValidationFunction
