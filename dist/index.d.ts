import DataLoader from 'dataloader';
/**
 * Creates a dataloader for a supplied model.
 *
 * @param {String} model e.g. 'App/Models/User'
 * @param {String} ref_id e.g. 'order_id'
 * @returns {DataLoaderHelper}
 */
export declare class DataLoaderHelper {
    queryData: Function;
    constructor(queryData: Function);
    create(model: string): DataLoader<any, any>;
    sortData(data: any[], ref_id: string, keys: any[], has: any): any[];
}
