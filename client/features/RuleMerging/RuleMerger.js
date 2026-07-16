import { validateDataType, getTypeConversion } from '../ColumnMapping/ValidationUtils';

export class RuleMerger {
  constructor(existingDmnRules, columnMappings) {
    this.existingRules = existingDmnRules;
    this.columnMappings = columnMappings;
    this.mergedRules = [...existingDmnRules];
  }

  prepareExcelRule(excelRow) {
    const rule = {};
    
    Object.entries(this.columnMappings).forEach(([parameterId, mapping]) => {
      const { excelColumn, dataType } = mapping;
      const value = excelRow[excelColumn];
      
      if (validateDataType(value, dataType)) {
        rule[parameterId] = this.convertValue(value, dataType);
      } else {
        throw new Error(`Invalid data type for parameter ${parameterId}. Expected ${dataType}`);
      }
    });
    
    return rule;
  }

  convertValue(value, dataType) {
    switch (dataType) {
      case 'string':
        return String(value);
      case 'integer':
      case 'long':
        return parseInt(value, 10);
      case 'double':
        return parseFloat(value);
      case 'boolean':
        return ['true', '1'].includes(String(value).toLowerCase());
      case 'date':
        return new Date(value).toISOString();
      default:
        return value;
    }
  }

  isDuplicateRule(newRule) {
    return this.mergedRules.some(existingRule => {
      return Object.entries(newRule).every(([key, value]) => {
        return existingRule[key] === value;
      });
    });
  }

  mergeRule(excelRow) {
    try {
      const newRule = this.prepareExcelRule(excelRow);
      
      if (!this.isDuplicateRule(newRule)) {
        this.mergedRules.push(newRule);
        return { success: true, rule: newRule };
      }
      
      return { success: false, error: 'Duplicate rule' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getMergedRules() {
    return this.mergedRules;
  }

  getStats() {
    return {
      totalRules: this.mergedRules.length,
      originalRules: this.existingRules.length,
      addedRules: this.mergedRules.length - this.existingRules.length
    };
  }
}