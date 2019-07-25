import DataLoader from 'dataloader'

/**
 * Creates a dataloader for a supplied model.
 */
export class DataLoaderHelper {

  /**
   * get array of objects for cache.
   */
  queryData: Function
  constructor(queryData: Function) {
    this.queryData = queryData
  }

  /**
   * create model's dataloader.
   */
  create(tablename: string): DataLoader<any, object> {
    let batchLoadFn = async (keys: any[]) => {
      let keys_values = keys.map((x) => x.value)
      let data = await this.queryData(tablename, keys[0].key, keys_values)

      return this.getData(data, keys[0].key, keys_values, keys[0].many)
    }

    return new DataLoader(batchLoadFn)
  }

  /**
   * @private
   * collect all data.
   */
  getData(data: any[], ref_id: string, key_ids: number[], many: boolean): object[] {
    if (!many) {
      return key_ids.map(id => data.find(r => r[ref_id] === id))
    } else {
      return key_ids.map(id => data.filter(r => r[ref_id] === id))
    }
  }
}
