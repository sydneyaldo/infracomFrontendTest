import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  AiFillDelete,
  AiFillEdit,
} from 'react-icons/ai';
import {
  GrAdd
} from 'react-icons/gr';
import {
  formatBarData,
  formatPieData,
} from './utils';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import reducer from './reducers';
import { getTransactions, updateTransaction, editTransaction, deleteTransaction, addTransaction, loadingTransactions } from './actions';
import thunk from 'redux-thunk';
import Loader from 'react-loader-spinner';
import moment from 'moment';
import _ from 'lodash';

class BarChartContainer extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width="50%"
          height="50%"
          maxBarSize={30}
          data={this.props.data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Transactions"/>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

function BarChartAdapter() {
  const transactions = useSelector((state) => state.transactions);
  
  const data = formatBarData(transactions);

  return (
    <BarChartContainer data={data}/>
  )
}

function PieChartAdapter() {
  const transactions = useSelector((state) => state.transactions);

  const data = formatPieData(transactions);

  return (
    <PieChartContainer data={data}/>
  );
}

class PieChartContainer extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
        <PieChart width="100%" height="100%" onMouseEnter={this.onPieEnter}>
        <Pie
          data={this.props.data}
          cy="40%"
          cx="50%"
          innerRadius="10%"
          outerRadius="50%"
          fill="#8884d8"
          paddingAngle={0.5}
          dataKey="value"
          label={true}
        >
          {this.props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend align={"center"}/>
      </PieChart>
      </ResponsiveContainer>
    );
  }
}

function Table() {
  const transactions = useSelector((state) => state.transactions);
  const editId = useSelector((state) => state.editTransaction);
  const loadingId = useSelector((state) => state.loading.data);
  const dispatch = useDispatch();

  const tableRows = [];

  transactions.sort((a, b) => b.id - a.id);

  for (const item of transactions) {
    const date = moment(item.created_at).format('hh:mm | DD-MM-YYYY');

    const row = item.id === editId ?
        <tr className="tableRow">
            <td className="tableData"> {item.id} </td>
            <td className="tableData"> {date} </td>
            <td className="tableData"> Rp <input type="number" id="totalInput" name="totalInput" defaultValue={item.total} min="0"/> </td>
            <td className="tableData"> <input type="text" id="customerInput" name="customerInput" defaultValue={item.customer} /> </td>
            <td className="tableData"> 
              <input type="radio" id="feedback" name="feedback" value="positive" checked={item.feedback === 'positive'}/>
              <label for="positive">Positive</label>
              <input type="radio" id="feedback" name="feedback" value="negative" checked={item.feedback === 'negative'}/>
              <label for="negative">Negative</label>
              <input type="radio" id="feedback" name="feedback" value="" checked={item.feedback === ''}/>
              <label for="negative">None</label>
            </td>
            <td className="tableData">
              {
                loadingId === item.id ?
              <Loader
                type="TailSpin"
                color="#000000"
                height={20}
                width={20}
                timeout={10000}
              />
              :
              <div>
                <button className="saveButton" onClick={() => {
                  const total = document.getElementById('totalInput').value;
                  const customer = document.getElementById('customerInput').value;
                  let feedback;
                  try {
                    feedback = document.querySelector('input[name="feedback"]:checked').value || null;
                  } catch(e) {
                    feedback = null;
                  }

                  dispatch(updateTransaction({
                    id: item.id,
                    created_at: item.created_at,
                    total,
                    customer,
                    feedback,
                  }));
                }}> Save </button>
                <button className="cancelButton" onClick={() => {
                  dispatch(editTransaction(null));
                }}> Cancel </button>
              </div>
              }
            </td>
        </tr> 
      :
        <tr className="tableRow">
          <td className="tableData"> {item.id} </td>
          <td className="tableData"> {date} </td>
          <td className="tableData"> Rp{item.total} </td>
          <td className="tableData"> {item.customer} </td>
          <td className="tableData"> {_.capitalize(item.feedback || '-')} </td>
          <td className="tableData"> 
            {
              loadingId === item.id ?
              <Loader
                type="TailSpin"
                color="#000000"
                height={20}
                width={20}
                timeout={10000}
              />
            :
            <div>
              <button className="button" onClick={() => dispatch(editTransaction(item.id))}> <AiFillEdit size={20}/> </button>
              <button className="button" onClick={() => dispatch(deleteTransaction(item.id))}> <AiFillDelete size={20}/> </button>
            </div>
            }
          </td>
        </tr>;

    tableRows.push(
      row
    )
  }

  if(editId === -1) {
    tableRows.unshift(
      <tr className="tableRow">
        <td className="tableData"> </td>
        <td className="tableData"> </td>
        <td className="tableData"> Rp <input type="number" id="totalInput" name="totalInput" defaultValue={0} min="0"/> </td>
        <td className="tableData"> <input type="text" id="customerInput" name="customerInput" /> </td>
        <td className="tableData"> 
          <input type="radio" id="feedback" name="feedback" value="positive"/>
          <label for="positive">Positive</label>
          <input type="radio" id="feedback" name="feedback" value="negative"/>
          <label for="negative">Negative</label>
          <input type="radio" id="feedback" name="feedback" value=""/>
          <label for="negative">None</label>
        </td>
        <td className="tableData">
          {
            loadingId === null ?
              <Loader
                type="TailSpin"
                color="#000000"
                height={20}
                width={20}
                timeout={10000}
              />
            :
            <div> 
              <button className="saveButton" onClick={() => {
                const total = document.getElementById('totalInput').value;
                const customer = document.getElementById('customerInput').value;
                let feedback;
                try {
                  feedback = document.querySelector('input[name="feedback"]:checked').value || null;
                } catch(e) {
                  feedback = null;
                }

                dispatch(addTransaction({
                  total,
                  customer,
                  feedback,
                }));
              }}> Add </button>
              <button className="cancelButton" onClick={() => {
                dispatch(editTransaction(null));
              }}>
                Cancel
              </button>
            </div>


          }
        </td>
    </tr>  
    )
  }

  return (
    <div>
      <button className="addButton" onClick={() => dispatch(editTransaction(-1))}> 
        <div> <GrAdd size={14}/> Add row </div>
      </button>

      <table className="table" cellSpacing="0" cellPadding="0">
        <tr className="tableHead">
          <th className="tableData"> ID </th>
          <th className="tableData"> Date & Time </th>
          <th className="tableData"> Total </th>
          <th className="tableData"> Customer </th>
          <th className="tableData"> Feedback </th>
          <th className="tableData"> Actions </th>
        </tr>
        {tableRows}
      </table>
    </div>
  )
} 

function MainPage() {
  const loading = useSelector((state) => state.loading.app);
  
  return loading ? 
  (
    <div className="container"> 
      <div className="loadingContainer"> 
          <Loader
            type="ThreeDots"
            color="#000000"
            height={50}
            width={50}
            timeout={10000}
          />
      </div>
    </div>
  )
  :
  (
    <div className="container">
      <div className="header"/>
      <div className="chartContainer">
          <div className="barChartArea">
            <div className="barChart">
              <BarChartAdapter/>
            </div>
          </div>
          <div className="pieChartArea">
            <div className="pieChart">
              <PieChartAdapter/>
            </div>
          </div>
      </div>
      
      <div className="tableContainer">
        <Table/>
      </div>

      <div className="footerSpacing"/>
      <div className="footer"/>
    </div>
  )
}

// ========================================


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
));

store.dispatch(loadingTransactions());
store.dispatch(getTransactions());

ReactDOM.render(
  <Provider store={store}>
    <MainPage />
  </Provider>,
  document.getElementById('root')
);
