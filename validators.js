const SCEPTERUtils = require('@source4society/scepter-utility-lib')
const utilities = new SCEPTERUtils()
const required = (value) => utilities.isNotEmpty(value)
const email = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value)
const integer = (value) => /^-?(0|[1-9]\d*)$/.test(value)
const decimal = (value) => !isNaN(parseFloat(value)) && isFinite(value)
const nonegative = (value) => parseFloat(value) >= 0
const website = (value) => /^(http|https):\/\/[^ "]+$/.test(value)
const pdf = (value) => /\.pdf$/.test(value)
const matchField = (value2) => (value, values) => value === values[value2]
const phone = (value) => /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
const ifOneOf = (options) => (value) => options.indexOf(value) > -1
const custom = (regex) => (value) => regex.test(value)

const validateFieldFunction = (errors, validations, value, property, values, injectPerformValidation) => {
  const performValidation = utilities.valueOrDefault(injectPerformValidation, performValidationFunction)
  if (utilities.isEmpty(validations)) {
    return errors
  }

  let updatedErrors = Object.assign({}, errors)
  validations.forEach((validatorItem) => {
    updatedErrors = performValidation(errors, validatorItem, value, property, values)
  })

  return updatedErrors
}

const performValidationFunction = (errors, validatorItem, value, property, values, usePages = false) => {
  if ((validatorItem.ifNotEmpty === true && utilities.isEmpty(value)) || (utilities.isEmpty(validatorItem.validator))) {
    return errors
  }
  if (validatorItem.validator(value, values, ...utilities.valueOrDefault(validatorItem.parameters, []))) {
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

const validate = (values, validations, page, injectValidateField) => {
  let pageNumber = utilities.valueOrDefault(page, 0)
  const validateField = utilities.valueOrDefault(injectValidateField, validateFieldFunction)
  let errors = {}
  Object.keys(validations).forEach((property) => {
    if (pageNumber === 0 || pageNumber === validations[property].page) {
      errors = validateField(errors, validations[property].validations, values[property], property, values)
    }
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
