import { describe, it } from 'mocha';
import moment from 'moment';
import sinon, { assert } from 'sinon';
import { formatBarData, formatPieData } from '../src/utils';

import { expect } from 'chai';
 
describe('test', () =>  {
  var clock;
  var now = new Date('2010-10-10');

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should return bar data', () => {
    const res = formatBarData([
      {
        created_at: moment('2010-10-09'),
      },
      {
        created_at: moment('2010-10-10'),
      }
    ]);

    expect(res).deep.to.equal([
      {
        name: '04-10-2010',
        count: 0,
      },
      {
        name: '05-10-2010',
        count: 0,
      },
      {
        name: '06-10-2010',
        count: 0,
      },
      {
        name: '07-10-2010',
        count: 0,
      },
      {
        name: '08-10-2010',
        count: 0,
      },
      {
        name: '09-10-2010',
        count: 1,
      },
      {
        name: '10-10-2010',
        count: 1,
      },
    ]);
  })
  
  it('Should return pie data', () => {
    const res = formatPieData([
      {
        feedback: "positive"
      },
      {
        feedback: "negative"
      },
      {
        feedback: ""
      },
    ]);
  
    expect(res).deep.to.equal([
      {
        name: 'Positive',
        value: 1,
      },
      {
        name: 'Negative',
        value: 1,
      },
      {
        name: 'No feedback',
        value: 1,
      },
    ]);
  });
});