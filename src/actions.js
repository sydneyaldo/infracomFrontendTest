import axios from 'axios'
import { useDispatch } from 'react-redux'

const transactionsReceived = data => ({
    type: 'TRANSACTIONS_RECEIVED',
    payload: data
})

export const loadingTransactions = () => ({
  type: 'TRANSACTIONS_LOADING',
})

const loadingData = (id) => ({
  type: 'DATA_LOADING',
  payload: id,
})

export const editTransaction = index => ({
  type: 'EDIT_TRANSACTION',
  payload: index
})

export const getTransactions = () => {
  return async dispatch => {
      try {
          const response = await axios.get('https://x8ki-letl-twmt.n7.xano.io/api:JdpK7mP3/transactions');
          dispatch(transactionsReceived(response.data))
      }
      catch(e){
        console.log(e);
      }
    }
}

export const updateTransaction = (data) => {
  return async dispatch => {
      try {
          dispatch(loadingData(data.id));
          await axios.post(`https://x8ki-letl-twmt.n7.xano.io/api:JdpK7mP3/transactions/${data.id}`, data);
          await dispatch(getTransactions());
          dispatch(editTransaction(null));
      }
      catch(e){
          console.log(e)
      }
  }
}

export const addTransaction = (data) => {
  return async dispatch => {
      try {
        dispatch(loadingData(null));
        await axios.post(`https://x8ki-letl-twmt.n7.xano.io/api:JdpK7mP3/transactions`, data);
        await dispatch(getTransactions());
        await dispatch(editTransaction(null));
      }
      catch(e){
          console.log(e)
      }
  }
}

export const deleteTransaction = (id) => {
  return async dispatch => {
    try {
      dispatch(loadingData(id));
      await axios.delete(`https://x8ki-letl-twmt.n7.xano.io/api:JdpK7mP3/transactions/${id}`);
      dispatch(getTransactions());
    }
    catch(e){
        console.log(e)
    }
}
}