import DataLoader from 'dataloader'
/**
 * Creates a dataloader for a supplied model.
 * 
 * @param {String} model e.g. 'App/Models/User'
 * @param {String} ref_id e.g. 'order_id'
 * @returns {DataLoaderHelper}
 */

export class DataLoaderHelper {
  queryData: Function
  constructor (queryData: Function) {
    this.queryData = queryData
  }

  create(model: string) {
    let batchLoadFn = async (keys: any[]) => {
      let keys_values = keys.map((x) => x[1])
      let data = await this.queryData(model, keys[0][0], keys_values)

      return this.sortData(data.rows, keys[0][0], keys_values, keys[0][2])
    }

    return new DataLoader(batchLoadFn)
  }


  sortData(data: any[], ref_id: string, keys: any[], has: any) {
    console.log(data)
    if (has === 'many') {
      return keys.map(id => data.filter(r => r[ref_id] === id))
    } else {
      return keys.map(id => data.find(r => r[ref_id] === id))
    }
  }
}
