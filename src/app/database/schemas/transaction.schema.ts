import { RxJsonSchema } from 'rxdb';

const schema: RxJsonSchema = {
  title: 'Transaction Schema',
  description: 'no description',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    smsId: { type: 'string' },
    amount: { type: 'number' },
    dateUnix: { type: 'number' },
    rawAccount: { type: 'string' },
    accountId: { type: 'string' },
    rawPayee: { type: 'string' },
    payeeId: { type: 'string' },
    status: { type: 'number' },
  },
  required: [
    'id',
    'smsId',
    'amount',
    'dateUnix',
    'rawAccount',
    'rawPayee',
    'status',
  ],
  indexes: [],
};
export default schema;
