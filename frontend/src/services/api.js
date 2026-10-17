const BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')}/customers`
  : '/customers';

export async function getAllCustomers() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch customers (${response.status})`);
  }
  return response.json();
}

export async function getCustomerById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch customer #${id} (${response.status})`);
  }
  return response.json();
}

export async function createCustomer(customerData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create customer (${response.status})`);
  }
  return response.json();
}

export async function updateCustomer(id, customerData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update customer #${id} (${response.status})`);
  }
  return response.json();
}

export async function deleteCustomer(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to delete customer #${id} (${response.status})`);
  }
  return true;
}

