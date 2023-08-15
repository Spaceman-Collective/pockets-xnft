export interface NFT {
  name: string;
  symbol: string;
  royalty: number;
  image_uri: string;
  cached_image_uri: string;
  animation_url: string;
  cached_animation_url: string;
  metadata_uri: string;
  description: string;
  mint: string;
  owner: string;
  update_authority: string;
  creators: {
    address: string;
    share: number;
    verified: boolean;
  }[];
  collection: {
    address: string;
    verified: boolean;
  };
  attributes: any;
  attributes_array: {
    trait_type: string;
    value: string;
  }[];
  files: {
    uri: string;
    type: string;
  }[];
  external_url: string;
  primary_sale_happened: boolean;
  is_mutable: boolean;
  token_standard: string;
  is_laoded_metadata: boolean;
  is_compressed?: boolean;
}

// Madlads, Kyogen, Famous Foxes, OKB POGs
export const SUPPORTED_COLLECTION_ADDRESSES: {
  [address: string]: string;
} = {
  J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w: "Madlads",
  BUjZjAS2vbbb65g7Z1Ca9ZRVYoJscURG5L3AkVvHP9ac: "Famous Fox Federation",
  EFd3WV11WGPzw6FVGimGMnmkRFvqpvLTaABPJpZpRmun: "OKB POG Collectors Edition"
};
