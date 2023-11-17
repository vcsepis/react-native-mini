export const SettingData = [
  {
    id: 1,
    type: 'PAYMENT_METHOD',
    name: 'Payment Method',
  },
  {
    id: 2,
    type: 'ITEM_SALES',
    name: 'Item Sales',
  },
  {
    id: 3,
    type: 'CATEGORY_SALES',
    name: 'Category Sales',
  },

  {
    id: 4,
    type: 'MODIFIER_SALES',
    name: 'Modifier Sales',
  },
  {
    id: 5,
    type: 'DISCOUNTS',
    name: 'Discounts',
  },
  {
    id: 6,
    type: 'TAXES',
    name: 'Taxes',
  },
];

export enum SETTING {
  PAYMENT_METHOD,
  ITEM_SALES,
  CATEGORY_SALES,
  MODIFIER_SALES,
  DISCOUNTS,
  TAXES,
}

export const PaymentMethodData = [
  {
    id: 1,
    name: 'Squareup',
  },
  {
    id: 2,
    name: 'Epayment',
  },
];

export enum PAYMENT_METHOD_TYPE {
  SQUAREUP,
  EPAYMENT,
}
