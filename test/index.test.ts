import { DataLoaderHelper } from '../src/index';



test('init', async () => {
  const Loader = new DataLoaderHelper(async function (model: string, ref_id: string, keys: any[]) {
    console.log(`*** loading all '${model}' with ids [${keys}] from database`)

    return {
      rows: [{ company_id: 123, company_data: ["company_data_123"] },
      { company_id: 124, company_data: ["company_data_124"] }]
    }
  })
  let users = Loader.create('users')
  let result = await users.load(['company_id', 123, 'many'])
  expect(result).toEqual([ { company_id: 123, company_data: [ 'company_data_123' ] } ]);

});

