export enum ContractStatusEnum {
  PENDING_RESOURCES = 'PENDING_RESOURCES',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}

export type ContractResource = {
  resourceId: number;
  quantity: number;
};
