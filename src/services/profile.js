import { graphqlRequest } from './graphql.js';

const PROFILE_DASHBOARD_QUERY = `
  query ProfileDashboard($userId: Int!) {
    transaction(
      where: { userId: { _eq: $userId }, type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      id
      amount
      createdAt
      objectId
      path
      object {
        id
        name
        type
      }
    }
    progress(
      where: { userId: { _eq: $userId } }
      order_by: { createdAt: desc }
      limit: 50
    ) {
      id
      grade
      createdAt
      objectId
      object {
        id
        name
        type
      }
    }
    result(where: { userId: { _eq: $userId } }) {
      id
      grade
      type
      createdAt
      objectId
    }
  }
`;

const FEATURED_OBJECT_QUERY = `
  query FeaturedObject($objectId: Int!) {
    object(where: { id: { _eq: $objectId } }) {
      id
      name
      type
      attrs
    }
  }
`;

const CURRENT_USER_QUERY = `
  query CurrentUser {
    user {
      id
      login
      attrs
    }
  }
`;

export const fetchCurrentUser = async (token) => {
  const data = await graphqlRequest(CURRENT_USER_QUERY, {}, token);
  return data?.user?.[0] ?? null;
};

export const fetchProfileDataset = async ({ userId, token }) => {
  const data = await graphqlRequest(PROFILE_DASHBOARD_QUERY, { userId }, token);
  const xpTransactions = data?.transaction ?? [];
  const progress = data?.progress ?? [];
  const results = data?.result ?? [];

  let featuredProject = null;
  const highestXp = xpTransactions.reduce(
    (acc, tx) => (tx.amount > (acc?.amount ?? 0) ? tx : acc),
    null,
  );

  if (highestXp?.objectId) {
    const featured = await graphqlRequest(
      FEATURED_OBJECT_QUERY,
      { objectId: highestXp.objectId },
      token,
    );
    featuredProject = featured?.object?.[0] ?? null;
  }

  return { xpTransactions, progress, results, featuredProject };
};
