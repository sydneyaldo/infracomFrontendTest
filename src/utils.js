import _ from 'lodash';
import moment from 'moment';

const formatBarData = (data) => {
  const arr = [];

  const day = moment();
  for(let i = 0; i < 7; i++) {
    const date = day.format("DD-MM-YYYY");

    arr.push({
      name: date,
      count: 0,
    })

    day.subtract(1, 'day');
  }

  arr.reverse();

  data.forEach((elem) => {
    const date = moment(elem.created_at).format("DD-MM-YYYY");
    const index = arr.findIndex((elem2) => elem2.name === date);

    if(index !== -1) {
      arr[index].count++;
    }
  })

  return arr;
}

const formatPieData = (data) => {
  const arr = [];

  data.forEach((it) => {
    const index = arr.findIndex((it2) => it2.name === (_.capitalize(it.feedback || "no feedback")));
    if(index !== -1) {
      arr[index].value++;
    } else {
      arr.push({
        name: _.capitalize(it.feedback || "no feedback"),
        value: 1,
      });
    }
  });

  return arr;
}

export {
  formatBarData,
  formatPieData,
};