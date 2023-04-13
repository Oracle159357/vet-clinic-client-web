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
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(fullUrl.href, {
    method: 'POST',
    headers: {
      Authorization: accessToken !== null ? `Bearer ${accessToken}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status >= 500) {
    throw new Error(await response.text());
  }
  if (response.status === 401) {
    window.location = '/login';
  }
  const result = await response.json();
  if (response.status >= 200 && response.status < 300) {
    return result;
  }
  if (response.status === 400) {
    throw new CustomError(result);
  }
  if (response.status === 403) {
    alert('Access to this functionality is denied');
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

export async function getUser(options) {
  return apiCall('/user', { data: options });
}

export async function addNewPeople(newPeople) {
  return apiCall('/people/add', { data: newPeople });
}

export async function addNewAnimal(newAnimal) {
  return apiCall('/animal/add', { data: newAnimal });
}

export async function addNewUser(newUser) {
  return apiCall('/user/add', { data: newUser });
}

export async function updatePeople(people) {
  return apiCall('/people/change', { data: people });
}

export async function updateAnimal(animal) {
  return apiCall('/animal/update', { data: animal });
}

export async function updateUser(user) {
  return apiCall('/user/update', { data: user });
}

export async function deletePeople(ids) {
  return apiCall('/people/remove', { data: ids });
}

export async function deleteAnimal(ids) {
  return apiCall('/animal/delete', { data: ids });
}

export async function deactivateUser(ids) {
  return apiCall('/user/deactivate', { data: ids });
}

export async function loginUser(username, password) {
  return apiCall('/auth/login', { data: { username, password } });
}

export async function loadListOfPeople() {
  const { resultData } = await getPeople();
  return resultData.map((people) => _.pick(people, ['id', 'name']));
}
