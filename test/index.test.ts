import { DataLoaderHelper } from '../src/index';

test('init', async () => {
  const Loader = new DataLoaderHelper(async function (model: string, ref_id: string, keys: any[]) {
    console.log(`*** loading all '${model}' with ids [${keys}] from database and ${ref_id}`)

    return [{ id: 1, company_id: 123, company_data: ["company_data_123"] },
    { id: 2, company_id: 124, company_data: ["company_data_124"] }]
  })
  let users = Loader.create('users')
  let hasMany = await users.load({ key: 'company_id', value: 123, many: true })
  expect(hasMany).toEqual([{ id: 1, company_id: 123, company_data: ['company_data_123'] }]);

  let hasOne = await users.load({ key: 'company_id', value: 123 })
  expect(hasOne).toEqual({ id: 1, company_id: 123, company_data: ['company_data_123'] });

  let belongsTo = await users.load({ key: 'id', value: 2 })
  expect(belongsTo).toEqual({ id: 2, company_id: 124, company_data: ['company_data_124'] });

});

