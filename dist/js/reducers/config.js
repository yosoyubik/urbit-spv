import _ from 'lodash';


export class ConfigReducer {
    reduce(json, state) {
        let data = _.get(json, 'address', false);
        if (data) {
            state.address = data;
        }
    }
}
