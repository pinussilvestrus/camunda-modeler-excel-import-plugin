export const DATA_TYPES = {
  string: 'string',
  integer: 'integer',
  long: 'long',
  double: 'double',
  boolean: 'boolean',
  date: 'date'
};

export const validateDataType = (value, expectedType) => {
  switch (expectedType) {
    case DATA_TYPES.string:
      return true;
    case DATA_TYPES.integer:
      return Number.isInteger(Number(value));
    case DATA_TYPES.long:
    case DATA_TYPES.double:
      return !isNaN(Number(value));
    case DATA_TYPES.boolean:
      return typeof value === 'boolean' || ['true', 'false', '1', '0'].includes(String(value).toLowerCase());
    case DATA_TYPES.date:
      return !isNaN(Date.parse(value));
    default:
      return false;
  }
};

export const validateColumnData = (columnData, expectedType) => {
  const errors = [];
  columnData.forEach((value, index) => {
    if (!validateDataType(value, expectedType)) {
      errors.push({
        row: index + 1,
        value,
        expectedType
      });
    }
  });
  return errors;
};