const limits = {
  firstName: { minLength: 3, maxLength: 50, pattern: /^[a-zA-Z ]+$/ },
  lastName: { minLength: 3, maxLength: 50, pattern: /^[a-zA-Z ]+$/ },
  email: { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, maxLength: 255 },
  password: { minLength: 6, maxLength: 255 },
  company: { optional: true, maxLength: 50 },
  roles: {
    name: { minLength: 3, maxLength: 50, pattern: /^[a-zA-Z ]+$/ },
    description: { optional: true, maxLength: 255, pattern: /^[a-zA-Z0-9,'.\- ]+$/ },
  }
};

function validate({ field, value, namespace }) {
  const limit = !namespace ? limits[field] : limits[namespace][field];
  
  if (!limit) return { isValid: true };
  
  if (limit.optional && !value) return { isValid: true };
  
  if (!value)
    return { isValid: false, errorMess: `${field} is required` };
  
  if (limit.minLength && value.length < limit.minLength)
    return { isValid: false, errorMess: `min length is ${limit.minLength}` };
  
    if (limit.maxLength && value.length > limit.maxLength)
    return { isValid: false, errorMess: `max length is ${limit.maxLength}` };
  
    if (limit.pattern && !limit.pattern.test(value))
    return { isValid: false, errorMess: `${field} not valid` };

    return { isValid: true };
};

export default validate;