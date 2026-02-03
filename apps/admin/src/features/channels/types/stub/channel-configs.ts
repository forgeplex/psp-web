/** NON-FROZEN */
export type ChannelConfigFieldType = 'string' | 'number' | 'boolean' | 'select' | 'secret' | 'json';

/** NON-FROZEN */
export interface ChannelConfigFieldStub {
  key: string;
  label: string;
  type: ChannelConfigFieldType;
  required: boolean;
  masked: boolean;
  write_only: boolean;
  patch_strategy: 'replace' | 'merge' | 'partial';
  description?: string;
}

/** NON-FROZEN */
export interface ChannelConfigMatrixStub {
  channel_id: string;
  channel_name: string;
  confirm_required: boolean;
  audit_required: boolean;
  updated_at: string;
  fields: ChannelConfigFieldStub[];
}
