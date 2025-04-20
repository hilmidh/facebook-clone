import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'https://72bdnv4f-3000.asse.devtunnels.ms/',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("access_token")
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDBjNjFjYzUyMmVkZjk2Mzk4MjQ2YSIsImlhdCI6MTc0NTE3NTM5Nn0.VY0b8nhx-5az5BamqP7NKXtSzu07nQNiRhhDu8Sh-Y4"

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client
