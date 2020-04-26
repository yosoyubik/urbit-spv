import _ from 'lodash';


export class AddressReducer {
    reduce(json, state) {
        let data = _.get(json, 'address', false);
        if (data) {
            state.address = data;
        }
    }
}
