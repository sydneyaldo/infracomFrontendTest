import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { combineReducers } from "redux";

const transactionsReducer = (state = [], action) => {
  switch(action.type) {
    case "TRANSACTIONS_RECEIVED":
      return action.payload;
    default: return state;
  }
}

const editTransactionReducer = (state = null, action) => {
  switch(action.type) {
    case "EDIT_TRANSACTION":
      return action.payload;
    default: return state;
  }
}

const loadingReducer = (state = {}, action) => {
  switch(action.type) {
    case "TRANSACTIONS_LOADING":
      return { app: true };
    case 'DATA_LOADING':
      return { 
        app: state.app,
        data: action.payload,
      };
    default: return {
      app: false,
      data: false,
    };
  }
}

const rootReducer = combineReducers({
  transactions: transactionsReducer,
  loading: loadingReducer,
  editTransaction: editTransactionReducer,
})

export default rootReducer;