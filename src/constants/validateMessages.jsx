export const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
      string: "${label} is not a valid string!",
      date: "${label} is invalid valid date!",
      boolean: "${label} is not a valid boolean!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
      len: "${label} must equal ${len}",
      min: "${label} cannot be less than ${min}",
      max: "${label} must be 10 numbers",
    },
    string: {
      len: "${label} must be exactly ${len} characters",
      min: "${label} must be at least ${min} characters",
      max: "${label} cannot be longer than ${max} characters",
      range: "${label} must be between ${min} and ${max} characters",
    },
    array: {
      len: "${label} must be exactly ${len} in length",
      min: "${label} cannot be less than ${min} in length",
      max: "${label} cannot be greater than ${max} in length",
      range: "${label} must be between ${min} and ${max} in length",
    },
  };