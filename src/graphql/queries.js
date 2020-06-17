import { USER_INFO } from "./fragments";

// write a query
export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;
