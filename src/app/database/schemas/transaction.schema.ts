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
        smsId: { type: 'string', },
        amount: { type: 'number' },
        dateUnix: { type: 'number' },
        rawAccount: { type: 'string' },
        accountId: { type: 'number' },
        rawPayee: {type: 'string'},
        payeeId: {type: 'number' },
        status: {type: 'number' }
    },
    required: ['id', 'smsId', 'amount', 'dateUnitx', 'rawAccount', 'rawPayee', 'status'],
    indexes: [],
};
export default schema;
