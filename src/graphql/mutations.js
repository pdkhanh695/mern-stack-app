import { USER_INFO } from "./fragments";

//Mutation to update user profile => useMutation hook to execute mutation
export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;
