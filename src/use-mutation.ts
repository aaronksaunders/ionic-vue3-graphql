import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";

// GRAPHQL MUTATION
const ADD_POST_MUTATION = gql`
  mutation createPost($title: String!, $id: ID!, $userId: ID!) {
    createPost(title: $title, views: 0, user_id: $userId, id: $id) {
      id
      title
      views
      user_id
    }
  }
`;

const ALL_POST_QUERY = gql`
  query {
    allPosts {
      id
      title
      views
      User {
        id
        name
      }
    }
  }
`;
const useMyMutation = (refetch: any) => {
  const { loading, error, mutate: createPost } = useMutation(
    ADD_POST_MUTATION,
    {
      update: (
        cache: {
          readQuery: (arg0: { query: DocumentNode }) => any;
          writeQuery: (arg0: { query: DocumentNode; data: any }) => void;
        },
        { data: { createPost } }: any
      ) => {
        // get posts from cache
        const data = cache.readQuery({ query: ALL_POST_QUERY });
        // add the new post
        data.allPosts = [...data.allPosts, createPost];
        // write results to cache
        cache.writeQuery({ query: ALL_POST_QUERY, data });
        refetch();
        return data;
      },
    }
  );

  return {
    loading,
    error,
    createPost,
  };
};

export default  useMyMutation;