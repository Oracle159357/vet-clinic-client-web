import { faker } from '@faker-js/faker';
import _ from 'lodash';

const generateData1 = (size) => new Array(size).fill(0).map(() => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  age: faker.datatype.number({ min: 1, max: 100 }),
  married: Math.random() < 0.5,
  birthDate: faker.date.past(100, '2020-01-01T00:00:00.000Z'),
}));

const generateData2 = (size) => new Array(size).fill(0).map(() => ({
  idKey: faker.datatype.uuid(),
  dogName: faker.name.findName(),
  age: faker.datatype.number({ min: 1, max: 20 }),
  height: Math.random() * (10 - 1) + 1,
  birthDate: faker.date.past(20, '2020-01-01T00:00:00.000Z'),
}));

function process(data, options) {
  const { filters, sorting, paging } = options;
  let filteredData;
  console.log(options);
  if (filters !== undefined && Object.keys(filters).length !== 0) {
    const allFilter = Object.entries(filters);
    filteredData = data.filter((el) => allFilter.every(([key, { valueFilter, type }]) => {
      const currentValue = el[key];
      if (type === 'boolean') {
        return valueFilter === null ? true : currentValue === valueFilter;
      }
      if (type === 'number') {
        const isFromValid = valueFilter.from === undefined
          || parseInt(valueFilter.from, 10) <= currentValue;
        const isToValid = valueFilter.to === undefined
          || currentValue <= parseInt(valueFilter.to, 10);

        return isFromValid && isToValid;
      }
      if (type === 'string') {
        return currentValue.toLowerCase().includes(valueFilter.toLowerCase());
      }
      if (type === 'date') {
        const isFromValid = valueFilter.from === undefined
          || new Date(valueFilter.from) <= currentValue;
        const isToValid = valueFilter.to === undefined
          || currentValue <= new Date(valueFilter.to);

        return isFromValid && isToValid;
        // return currentValue.toLowerCase().includes(valueFilter.toLowerCase());
      }
      throw new Error('Not supported data type');
    }));
  } else {
    filteredData = data;
  }
  let sortedData;
  if (sorting !== undefined) {
    sortedData = _.orderBy(
      filteredData,
      sorting.map((x) => x.key),
      sorting.map((x) => x.direction),
    );
  } else {
    sortedData = filteredData;
  }
  const resultData = sortedData.filter((item, index) => {
    const fromIndex = paging.page * paging.size;
    const toIndex = (paging.page + 1) * paging.size;
    return index >= fromIndex && index < toIndex;
  });
  const result = { resultData, dataLength: sortedData.length };
  return JSON.parse(JSON.stringify(result));
}

function mutationFilter(arr, cb) {
  for (let l = arr.length - 1; l >= 0; l -= 1) {
    if (!cb(arr[l])) arr.splice(l, 1);
  }
}

function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function deleteFromDataByIds(data, ids, nameOfId) {
  mutationFilter(data, (el) => !ids.has(el[nameOfId]));
}

function addFromDataPerson(data1, data) {
  const formattedData = JSON.parse(JSON.stringify(data));
  const newData = {
    id: faker.datatype.uuid(),
    name: formattedData.name,
    age: calculateAge(new Date(formattedData.date)),
    married: formattedData.married,
    birthDate: new Date(formattedData.date),
  };
  data1.push(newData);
}

function addFromDataAnimal(data1, data) {
  const formattedData = JSON.parse(JSON.stringify(data));
  const newData = {
    idKey: faker.datatype.uuid(),
    dogName: formattedData.dogName,
    age: calculateAge(new Date(formattedData.date)),
    height: formattedData.height,
    birthDate: new Date(formattedData.date),
  };
  data1.push(newData);
}

function changeDataPerson(allData, changedData) {
  const formattedChangedData = JSON.parse(JSON.stringify(changedData));
  const newData = {
    id: formattedChangedData.id,
    name: formattedChangedData.name,
    age: calculateAge(new Date(formattedChangedData.date)),
    married: formattedChangedData.married,
    birthDate: new Date(formattedChangedData.date),
  };
  // eslint-disable-next-line no-param-reassign
  allData[allData.findIndex((animal) => animal.id === formattedChangedData.id)] = newData;
}

function changeDataAnimal(allData, changedData) {
  const formattedChangedData = JSON.parse(JSON.stringify(changedData));
  const newData = {
    idKey: formattedChangedData.idKey,
    dogName: formattedChangedData.dogName,
    age: calculateAge(new Date(formattedChangedData.date)),
    height: formattedChangedData.height,
    birthDate: new Date(formattedChangedData.date),
  };
  const findIndexElement = allData
    .findIndex((animal) => animal.idKey === formattedChangedData.idKey);
  // eslint-disable-next-line no-param-reassign
  allData[findIndexElement] = newData;
}

const data1 = generateData1(22);
const data2 = generateData2(22);

export async function getData1(options) {
  return process(data1, options);
}

export async function getData2(options) {
  return process(data2, options);
}

export async function deleteFromData1ByIds(ids) {
  deleteFromDataByIds(data1, ids, 'id');
}

export async function deleteFromData2ByIds(ids) {
  deleteFromDataByIds(data2, ids, 'idKey');
}

export async function addFromData1(data) {
  addFromDataPerson(data1, data);
}

export async function changeFromData1(data) {
  changeDataPerson(data1, data);
}

export async function changeFromData2(data) {
  changeDataAnimal(data2, data);
}

export async function addFromData2(data) {
  addFromDataAnimal(data2, data);
}
