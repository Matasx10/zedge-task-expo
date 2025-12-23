export type OptionsValueType = "CAT" | "HUMAN";

export const SWITCH_OPTIONS: { title: string; value: OptionsValueType }[] = [
  { title: "Pets", value: "CAT" },
  { title: "Humans", value: "HUMAN" },
];

export const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 0,
};
