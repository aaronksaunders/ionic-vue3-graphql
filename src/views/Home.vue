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
      <div v-if="allPosts">
        <ion-item v-for="item in allPosts" :key="item.id">
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
  IonButton
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import useMyMutation from "../use-mutation";

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
    IonButton
  },
  setup() {
    const title = ref<string>("");

    // composable for querying all posts data
    const { result, error, loading, refetch } = useQuery(ALL_POST_QUERY);

    // this cleans up the process of getting actual values without
    // requiring use to always do `result.allPost`
    const allPosts = useResult(result, null, data => data.allPosts);

    // custom composable for mutating the data / and updating local cache
    const m = useMyMutation(refetch);

    /**
     *
     */
    const addPost = () => {
      const id = new Date().getTime() + "";
      const userId = 456;
      m.createPost({ title: title.value, id, userId });
      title.value = "";
    };

    return {
      loading: loading || m.loading,
      addPost,
      error: error || m.error,
      title,
      allPosts
    };
  }
});
</script>

<style scoped>
</style>