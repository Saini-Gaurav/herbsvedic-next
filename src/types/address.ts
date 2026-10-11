export type AddressLabel = "Home" | "Work" | "Other";

export interface SavedAddress {
  id: string;
  label: AddressLabel;
  shippingAddress1: string;
  shippingAddress2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressInput {
  label: AddressLabel;
  shippingAddress1: string;
  shippingAddress2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}