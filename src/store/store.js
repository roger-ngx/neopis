import { createStore } from 'redux'
import { neopisReducer } from './neopisStore';

const store = createStore(neopisReducer, 
              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;