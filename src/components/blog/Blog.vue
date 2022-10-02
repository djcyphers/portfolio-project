<template>
  <div class="blog-wrapper">
    <div
      v-if="isBlogViewOpen"
      class="blog-view container"
    >
      <div class="row">
          <!-- Blog Posts -->
          <div
            v-for="(blogPost, index) in blogPosts"
            :key="index"
            class="
              col-md-6 col-lg-3
              blog-home
              bg-transparent
              card
              me-3
            "
            @click="viewBlogPosts(blogPost)"
          >
            <img
              class="card-img img-thumbnail bg-black"
              :src="blogImgUrl(blogPost)"
              :alt="blogPostTitle(blogPost)"
            >
            <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
              <div class="card-img-overlay d-flex flex-column justify-content-end card-img-textarea">
                <div class="blog-title card-title bg-black mb-0 opacity-75">
                  {{ blogPostTitle(blogPost) }}
                </div>
                <div class="blog-category card-text bg-black opacity-75">
                  {{ blogPostCategory(blogPost) }}
                </div>
              </div>
              <!-- Check if logged in to prevent editing todo: add user roles -->
              <template v-if="isLoggedIn">
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Admin Buttons"
                >
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
          </div>
      </div>
    </div>
    <!-- Create new blog post multiplart form -->
    <template v-if="isBlogEditorOpen">
      <!-- Wysygig Editor -->
      <div class="blog-editor-wrapper container">
        <div class="row">
          <BlogEditor />
        </div>
      </div>
    </template>
    <!-- Blog Post View -->
    <template v-if="isBlogPostViewOpen && !isBlogUpdating">
      <!-- Close Button -->
      <BlogPostCloseButton @click.prevent="openBlogView" />
      <div class="blog-post-view container">
        <div class="row">
          <BlogPost v-if="blogPost" /> <!-- Get the blog post from component? -->
          <template v-if="isLoggedIn">
            <div
              class="btn-group"
              role="group"
              aria-label="Admin Buttons"
            >
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
import BlogEditor from './BlogEditor'
import BlogPostCloseButton from "./BlogPostCloseButton";
import BlogPost from "./BlogPost";
import swal from "sweetalert";
import axios from "axios";

export default {
  name: "Blog",
  components: {
    BlogPostCloseButton,
    BlogPost,
    BlogEditor,
  },
  setup() {
    // Setup reactive store
    const store = inject("store");
    // Blog views
    const viewBlogPosts = computed(() => store.methods.viewBlogPosts);
    const isBlogViewOpen = computed(() => store.state.isBlogViewOpen);
    const isBlogPostViewOpen = computed(() => store.state.isBlogPostViewOpen);
    const isBlogEditorOpen = computed(() => store.state.isBlogEditorOpen);
    // Local ref
    const isBlogUpdating = ref(false);
    const editBlogPostView = ref(false);
    const editBlogPostForm = ref(false);
    // Logged in?
    const isLoggedIn = computed(() => store.state.logged);
    // Blog Posts Store
    const blogPosts = ref([]);

    const files = ref({ files: [] });
    
    onMounted(async () => {
      viewBlogPosts.value();
      await getAllBlogPosts();
    });

    // Get all blog posts on mount (after loading a new image or refresh)
    async function getAllBlogPosts() {
      await axios
        .get("blog/posts/all")
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            // Put all posts into reactive array
            blogPosts.value = response.data;
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
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

    // Pull images and add them to webpack (require())
    function blogImgUrl(blogPost) {
      const name = blogPost.blogTitle;
      if (name === undefined) return;
      const formatName = name.replace(/ /g, "-").toLowerCase();
      let img = computed(() => {
          const str = blogPost.blogImagesUrls[0]; // get first image in blog post for thumbnail
          return str.split("\\").pop().split("/").pop();
      });
      if (img.value) {
            return require(`@/assets/blog/` + `${formatName}/${img.value}`);
            }
            else {
              return []; // Vue state trying to add img buggy webpack issue
            }
      }
      // Get blog post title
      function blogPostTitle(blogPost) {
        if (!blogPost) return;
        return blogPost.blogTitle;
      }
      // Get blog post content
      function blogPostCategory(blogPost) {
        if (!blogPost) return;
        return blogPost.blogCategory;
      }

    return {
      store,
      viewBlogPosts,
      isBlogViewOpen,
      isBlogUpdating,
      isBlogPostViewOpen,
      isBlogEditorOpen,
      isLoggedIn,
      blogPosts,
      files,
      editBlogPost,
      deleteBlogPost,
      editBlogPostView,
      editBlogPostForm,
      blogImgUrl,
      blogPostTitle,
      blogPostCategory,
    }
  }
};

</script>

<style lang="scss" scoped>
  .blog-editor-wrapper {
    background: rgba($color: #000000, $alpha: 0.8);
    border: 1px solid rgb(199, 208, 253);
  }
</style>