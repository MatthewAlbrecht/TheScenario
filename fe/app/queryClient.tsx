import { QueryClient } from '@tanstack/react-query';
import { Data, DataWithoutId } from './types';

const queryClient = new QueryClient();
export default queryClient;

export async function getAllData() {
  const res = await fetch('http://localhost:3000/data');
  return res.json();
}

export async function postData(data: DataWithoutId) {
  const res = await fetch('http://localhost:3000/data', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function putData(data: Data) {
  const res = await fetch(`http://localhost:3000/data/${data._id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function deleteData(id: string) {
  const res = await fetch(`http://localhost:3000/data/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
