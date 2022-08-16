import { faker } from '@faker-js/faker';
import _ from 'lodash';

const generateData1 = (size) => new Array(size).fill(0).map(() => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  age: faker.datatype.number({ min: 1, max: 100 }),
  married: Math.random() < 0.5,
  birthDate: faker.date.past(100, '2020-01-01T00:00:00.000Z'),
}));
const data1 = generateData1(23);

const generateData2 = (size) => new Array(size).fill(0).map(() => ({
  idKey: faker.datatype.uuid(),
  dogName: faker.name.findName(),
  age: faker.datatype.number({ min: 1, max: 20 }),
  height: Math.random() * (10 - 1) + 1,
  birthDate: faker.date.past(20, '2020-01-01T00:00:00.000Z'),
  owner: data1[faker.datatype.number({ min: 0, max: data1.length - 1 })],
}));
const data2 = generateData2(22);

const baseTypeOfColumn = {
  name: 'string',
  age: 'number',
  married: 'boolean',
  birthDate: 'date',
  dogName: 'string',
  height: 'number',
  'owner.name': 'string',
};

function process(data, options) {
  const { filters, sorting, paging } = options;
  let filteredData;
  // ReactTable
  if (Array.isArray(filters)) {
    if (filters !== undefined && filters.length !== 0) {
      const allFilter = filters;
      filteredData = data.filter((el) => allFilter.every(({ value, id }) => {
        const currentValue = _.get(el, id);
        const typeOfColumn = baseTypeOfColumn[id];
        if (typeOfColumn === 'boolean') {
          const booleanLabels = { true: true, false: false };
          return value === 'null' ? true : currentValue === booleanLabels[value];
        }
        if (typeOfColumn === 'number') {
          const isFromValid = value.from === undefined
            || value.from <= currentValue;
          const isToValid = value.to === undefined
            || currentValue <= value.to;
          return isFromValid && isToValid;
        }
        if (typeOfColumn === 'string') {
          return currentValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeOfColumn === 'date') {
          const isFromValid = value.from === undefined
            || new Date(value.from) <= currentValue;
          const isToValid = value.to === undefined
            || currentValue <= new Date(value.to);

          return isFromValid && isToValid;
        }
        throw new Error('Not supported data type');
      }));
    } else {
      filteredData = data;
    }
    // MyCustomTable
  } else if (filters !== undefined && Object.keys(filters).length !== 0) {
    const allFilter = Object.entries(filters);
    filteredData = data.filter((el) => allFilter.every(([key, { valueFilter }]) => {
      const currentValue = el[key];
      const typeOfColumn = baseTypeOfColumn[key];
      if (typeOfColumn === 'boolean') {
        return valueFilter === null ? true : currentValue === valueFilter;
      }
      if (typeOfColumn === 'number') {
        const isFromValid = valueFilter.from === undefined
          || parseInt(valueFilter.from, 10) <= currentValue;
        const isToValid = valueFilter.to === undefined
          || currentValue <= parseInt(valueFilter.to, 10);

        return isFromValid && isToValid;
      }
      if (typeOfColumn === 'string') {
        return currentValue.toLowerCase().includes(valueFilter.toLowerCase());
      }
      if (typeOfColumn === 'date') {
        const isFromValid = valueFilter.from === undefined
          || new Date(valueFilter.from) <= currentValue;
        const isToValid = valueFilter.to === undefined
          || currentValue <= new Date(valueFilter.to);

        return isFromValid && isToValid;
      }
      throw new Error('Not supported data type2');
    }));
  } else {
    filteredData = data;
  }
  let sortedData;
  if (sorting !== undefined && sorting.length !== 0) {
    sortedData = _.orderBy(
      filteredData,
      sorting.map((x) => x.id),
      sorting.map((x) => (x.desc ? 'desc' : 'asc')),
    );
  } else {
    sortedData = filteredData;
  }
  let resultData;
  if (paging !== undefined) {
    resultData = sortedData.filter((item, index) => {
      const fromIndex = paging.page * paging.size;
      const toIndex = (paging.page + 1) * paging.size;
      return index >= fromIndex && index < toIndex;
    });
  } else {
    resultData = sortedData;
  }
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
// MyTable
function deleteFromDataByIds(data, ids, nameOfId) {
  mutationFilter(data, (el) => !ids.has(el[nameOfId]));
}
// ReactTable
function deleteFromDataByIdsTableV2(data, ids, nameOfId) {
  mutationFilter(data, (el) => !ids.includes(el[nameOfId]));
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

function addFromDataAnimal(data2, data) {
  const formattedData = JSON.parse(JSON.stringify(data));
  const peopleByOwner = data1.find((people) => people.id === formattedData.ownerId);
  const newData = {
    idKey: faker.datatype.uuid(),
    dogName: formattedData.dogName,
    age: calculateAge(new Date(formattedData.date)),
    height: formattedData.height,
    birthDate: new Date(formattedData.date),
    owner: peopleByOwner,
  };
  data2.push(newData);
}

function changeDataPerson(allData, changedData) {
  const formattedChangedData = JSON.parse(JSON.stringify(changedData));
  const itemIndex = allData.findIndex((animal) => animal.id === formattedChangedData.id);
  // eslint-disable-next-line no-param-reassign
  allData[itemIndex] = {
    id: formattedChangedData.id,
    name: formattedChangedData.name,
    age: calculateAge(new Date(formattedChangedData.date)),
    married: formattedChangedData.married,
    birthDate: new Date(formattedChangedData.date),
  };
}

function changeDataAnimal(allData, changedData) {
  const formattedChangedData = JSON.parse(JSON.stringify(changedData));
  const peopleByOwner = data1.find((people) => people.id === formattedChangedData.ownerId);
  const newData = {
    idKey: formattedChangedData.idKey,
    dogName: formattedChangedData.dogName,
    age: calculateAge(new Date(formattedChangedData.date)),
    height: formattedChangedData.height,
    birthDate: new Date(formattedChangedData.date),
    owner: peopleByOwner,
  };
  const findIndexElement = allData
    .findIndex((animal) => animal.idKey === formattedChangedData.idKey);
  // eslint-disable-next-line no-param-reassign
  allData[findIndexElement] = newData;
}

export async function getData1(options) {
  return new Promise((res) => {
    setTimeout(() => {
      const result = process(data1, options || {});
      res(result);
    }, 1000);
  });
}

export async function getData2(options) {
  return new Promise((res) => {
    setTimeout(() => {
      const result = process(data2, options);
      res(result);
    }, 1000);
  });
}

export async function deleteFromData1ByIds(ids) {
  deleteFromDataByIds(data1, ids, 'id');
}

export async function deleteFromData1ByIdsTableV2(ids) {
  return new Promise((res) => {
    setTimeout(() => {
      deleteFromDataByIdsTableV2(data1, ids, 'id');
      res(undefined);
    }, 1000);
  });
}

export async function deleteFromData2ByIds(ids) {
  deleteFromDataByIds(data2, ids, 'idKey');
}

export async function deleteFromData2ByIdsTableV2(ids) {
  return new Promise((res) => {
    setTimeout(() => {
      deleteFromDataByIdsTableV2(data2, ids, 'idKey');
      res(undefined);
    }, 1000);
  });
}

export async function addFromData1(data) {
  const findDuplicateName = data1.findIndex((person) => person.name === data.name);
  if (findDuplicateName >= 0) {
    return {
      errors: {
        name: 'This name already exists',
      },
    };
  }
  return new Promise((res) => {
    setTimeout(() => {
      addFromDataPerson(data1, data);
      res(undefined);
    }, 1000);
  });
}

export async function addFromData2(data) {
  const findDuplicateName = data2.findIndex((animal) => animal.dogName === data.dogName);
  if (findDuplicateName >= 0) {
    return {
      errors: {
        dogName: 'This name already exists',
      },
    };
  }
  return new Promise((res) => {
    setTimeout(() => {
      addFromDataAnimal(data2, data);
      res(undefined);
    }, 1000);
  });
}

export async function changeFromData1(data) {
  return new Promise((res) => {
    setTimeout(() => {
      changeDataPerson(data1, data);
      res(undefined);
    }, 1000);
  });
}

export async function changeFromData2(data) {
  return new Promise((res) => {
    setTimeout(() => {
      changeDataAnimal(data2, data);
      res(undefined);
    }, 1000);
  });
}

export async function loadListOfPeople() {
  const { resultData } = await getData1();
  return resultData.map((people) => _.pick(people, ['id', 'name']));
}
