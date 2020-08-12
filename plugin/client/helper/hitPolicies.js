export default {
  'Unique': {
    hitPolicy: 'UNIQUE'
  },
  'First': {
    hitPolicy: 'FIRST'
  },
  'Priority': {
    hitPolicy: 'PRIORITY'
  },
  'Any': {
    hitPolicy: 'ANY'
  },
  'Collect': {
    hitPolicy: 'COLLECT'
  },
  'Collect (Sum)': {
    hitPolicy: 'COLLECT',
    aggregation: 'SUM'
  },
  'Collect (Min)': {
    hitPolicy: 'COLLECT',
    aggregation: 'MIN'
  },
  'Collect (Max)': {
    hitPolicy: 'COLLECT',
    aggregation: 'MAX'
  },
  'Collect (Count)': {
    hitPolicy: 'COLLECT',
    aggregation: 'COUNT'
  },
  'Rule order': {
    hitPolicy: 'RULE ORDER'
  },
  'Output order': {
    hitPolicy: 'OUTPUT_ORDER'
  }
};
