<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-toolbar>
        <ion-item>
          <ion-label position="floating">Enter Title</ion-label>
          <ion-input type="text" v-model="title"></ion-input>
          <ion-button slot="end" @click="addPost">ADD</ion-button>
        </ion-item>
      </ion-toolbar>
      <div v-if="result !== undefined">
        <ion-item v-for="item in result['allPosts']" :key="item.id">
          <ion-label>
            {{ item.id }} {{ item.title }} ({{ item.views }})
            <div>{{ item.User.name }}</div></ion-label
          >
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";

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
export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
  },
  setup() {
    const title = ref<string>("");

    // composable for querying all posts data
    const { result, error, loading, refetch } = useQuery(ALL_POST_QUERY);

    // composable for mutating the data / and update local cache
    const {
      loading: mLoading,
      error: mError,
      mutate: createPost,
    } = useMutation(ADD_POST_MUTATION, {
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
    });

    const addPost = function () {
      const id = new Date().getTime() + "";
      const userId = 456;
      createPost({ title: title.value, id, userId });
      title.value = "";
    };

    return {
      loading: loading || mLoading,
      addPost,
      result,
      error: error || mError,
      title,
    };
  },
});
</script>

<style scoped>
</style>