import { RxJsonSchema } from 'rxdb';

const schema: RxJsonSchema = {
  title: 'Budget Schema',
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
  },
  required: ['id', 'name'],
  indexes: [],
};
export default schema;
