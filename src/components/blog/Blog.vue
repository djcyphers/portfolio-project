<template>
  <div class="blog-wrapper">
    <div class="blog-view container" v-if="isBlogViewOpen">
      <div class="row">
        <template>
          <!-- Blog Posts -->
          <div class="
              col-md-6 col-lg-3
              blog-home
              bg-transparent
              card
              me-3
            "
            v-for="(blogPost, index) in blogPosts"
              :key="index"
              @click="viewBlogPost(blogPost)"
          >
            <img 
              v-if="blogPost"
              class="card-img img-thumbnail bg-black"
              :src="blogImgUrl(blogPost)"
              :alt="blogPostTitle(blogPost)"
            />
            <p v-else>Create your first blog post! Yay!</p>
            <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
            <template v-if="blogPost"> <!-- Deal with first time init. You're welcome -->
              <div class="card-img-overlay d-flex flex-column justify-content-end card-img-textarea">
                <div class="gallery-title card-title bg-black mb-0 opacity-75">
                  {{ blogPostTitle(blogPost) }}
                </div>
                <div class="gallery-description card-text bg-black opacity-75">
                  {{ blogPostCategory(blogPost) }}
                </div>
              </div>
              <!-- Check if logged in to prevent editing todo: add user roles -->
              <template v-if="isLoggedIn">
                <div class="btn-group" role="group" aria-label="Admin Buttons">
                  <button
                    class="btn btn-primary edit-button"
                    @click="editBlogPost(blogPost)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-primary delete-button"
                    @click="deleteBlogPost(blogPost, index)"
                  >
                    Delete
                  </button>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- Create new blog post multiplart form -->
    <!-- wysygig editor here? -->
    <template v-if="isNewBlogPostFormOpen">
      HELLO THIS IS A NEW POST FORM LOL
    
    </template>
    <!-- Blog Post View -->
    <template v-if="isBlogPostViewOpen && !isBlogUpdating">
      <!-- Close Button -->
      <BlogPostCloseButton @click.prevent="openBlogView"/>
      <div class="blog-post-view container">
        <div class="row">
          <BlogPost v-if="blogPost"/> <!-- Get the blog post from component? -->
          <template v-if="isLoggedIn">
            <div class="btn-group" role="group" aria-label="Admin Buttons">
              <button
                class="btn btn-primary edit-button"
                @click="editBlogPost(blogPost.title)"
              >
                Edit
              </button>
              <button
                class="btn btn-primary delete-button"
                @click="deleteBlogPost(blogPost)"
              >
                Delete
              </button>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

// Using new script setup
<script>
import { ref, onMounted, computed, inject } from "vue";
import BlogPostCloseButton from "./BlogPostCloseButton";
import BlogPost from "./BlogPost";
import swal from "sweetalert";
import axios from "axios";

export default {
  name: "Blog",
  components: {
    BlogPostCloseButton,
    BlogPost,
  },
  setup() {
    // Setup reactive store
    const store = inject("store");
    // Blog views
    const viewBlogPosts = computed(() => store.methods.viewBlogPosts);
    const isBlogViewOpen = computed(() => store.state.isBlogViewOpen);
    const isBlogPostViewOpen = computed(() => store.state.isBlogPostViewOpen);
    const isNewBlogPostFormOpen = computed(() => store.state.isNewBlogPostFormOpen);
    // Local ref
    const isBlogUpdating = ref(false);
    const editBlogPostView = ref(false);
    const editBlogPostForm = ref(false);
    // Logged in?
    const isLoggedIn = computed(() => store.state.logged );
    // Blog post arrays
    const blogPosts = ref([]);
    const blogPost = ref();
    const files = ref({ files: [] });
    // Create a new blog post
    const newBlogPost = ref({ blogTitle: "", blogContent: "", blogCategory: "" });

    // Create blog post
    async function createBlogPost() {
      let fData = new FormData();
        fData.append("blogTite", newBlogPost.value.blogTitle);
        fData.append("blogCategory", newBlogPost.value.blogCategory);
        fData.append("blogContent", newBlogPost.value.blogContent);
        for (let file of files) {
            fData.append('files', file, file.name) // note, no square-brackets
        }
        await axios
            .post("blog/create", fData, {
            })
            .then((response) => {
              if (response.data.error) {
                swal("Error", response.data.message, "error");
              } else {
                swal("Success", response.data.message, "success");
                returnToViewBlogPosts();
                getAllBlogPosts();
              }
            })
            .catch((error) => {
              console.log("Create post error! => " + error);
              swal("Error", error.response.data, "error");
            })
    }
    // Edit blog post
    function editBlogPost(blogPost) {
     // Close blog post view

     // Open blog edit form
    }

    // Delete blog post
    function deleteBlogPost(blogPost) {
      // Send axios delete

      // Remove blog post from array
    }

    return {
      store,
      viewBlogPosts,
      newBlogPost,
      isBlogViewOpen,
      isBlogUpdating,
      isBlogPostViewOpen,
      isNewBlogPostFormOpen,
      isLoggedIn,
      blogPosts,
      blogPost,
      files,
      editBlogPost,
      deleteBlogPost,
      editBlogPostView,
      editBlogPostForm,
    }
  }
};

</script>

<style lang="scss" scoped></style>