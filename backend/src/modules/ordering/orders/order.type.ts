export interface OptionValueSnapshot {
  optionValueId: string;
  value: string;
  priceAdjustment: number;
}

export interface OptionSnapshot {
  optionId: string;
  optionName: string;
  required: boolean;
  selectedValues: OptionValueSnapshot[];
}
