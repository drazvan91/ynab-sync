import { RxJsonSchema } from 'rxdb';

const schema: RxJsonSchema = {
  title: 'Payee Schema',
  description: 'no description',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: { type: 'string' },
    mappedNames: { type: 'array', items: { type: 'string' } },
  },
  required: ['id', 'name', 'mappedNames'],
  indexes: [],
};
export default schema;
