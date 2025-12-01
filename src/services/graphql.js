import { GRAPHQL_URL } from '../constants.js';

export const graphqlRequest = async (query, variables = {}, token) => {
  if (!token) {
    throw new Error('Missing authentication token');
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('GraphQL request failed');
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || 'GraphQL error');
  }

  return payload.data;
};
