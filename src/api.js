import _ from 'lodash';

class CustomError extends Error {
  constructor(payload) {
    super(JSON.stringify(payload));
    this.name = 'CustomErrorServer';
    this.payload = payload;
  }
}

const apiCall = async (url, { data }) => {
  const fullUrl = new URL(url, 'http://localhost:3000');
  const response = await fetch(fullUrl.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (response.status >= 500) {
    throw new Error(await response.text());
  }
  const result = await response.json();
  if (response.status >= 200 && response.status < 300) {
    return result;
  }
  if (response.status === 400) {
    throw new CustomError(result);
  }
  throw new Error('Unsupported status');
};

export async function getPeople(options) {
  return apiCall('/people', { data: options });
}

export async function getAnimal(options) {
  return apiCall('/animal', { data: options });
}

export async function addNewPeople(newPeople) {
  return apiCall('/people/add', { data: newPeople });
}

export async function addNewAnimal(newAnimal) {
  return apiCall('/animal/add', { data: newAnimal });
}

export async function updatePeople(people) {
  return apiCall('/people/change', { data: people });
}

export async function updateAnimal(animal) {
  return apiCall('/animal/update', { data: animal });
}

export async function deletePeople(ids) {
  return apiCall('/people/remove', { data: ids });
}

export async function deleteAnimal(ids) {
  return apiCall('/animal/delete', { data: ids });
}

export async function loadListOfPeople() {
  const { resultData } = await getPeople();
  return resultData.map((people) => _.pick(people, ['id', 'name']));
}
