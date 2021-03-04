import React from "react";
import AssetSelector from "../components/AssetSelector";
import { CurrencyOptions } from "../constants/submarine";

export default {
  title: "Asset Select",
  component: AssetSelector,
  argTypes: {
    label: { defaultValue: "You send" },
    defaultValue: { defaultValue: undefined },
    value: { defaultValue: undefined },
    selectedAsset: { defaultValue: CurrencyOptions[0] },
    onAmountChange: { defaultValue: () => {} },
    onAssetChange: { defaultValue: () => {} },
    onKeyPress: { defaultValue: () => {} },
  },
};

const Template = (args) => <AssetSelector {...args} />;

export const YouSend = Template.bind({});
YouSend.args = {};

export const YouReceive = Template.bind({});
YouReceive.args = {
  label: "You receive",
  selectedAsset: CurrencyOptions[2],
};

/*
export const Secondary = Template.bind({});
Secondary.args = {
  label: "ETH",
};
*/
