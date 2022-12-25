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
            @click.prevent="getBlogPost(blogPost, index)"
          >
            <img
              class="card-img bg-black img-fluid img-center img-thumbnail"
              :src="blogImgUrl(blogPost)"
              :alt="blogPostTitle(blogPost)"
            >
            <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
              <div class="card-img-overlay d-flex flex-column justify-content-end card-img-textarea">
                <div class="blog-title card-title bg-black mb-0 opacity-75">
                  {{ blogPostTitle(blogPost) }}
                </div>
                <div class="blog-category card-text bg-black opacity-75">
                  {{ "Category: " + blogPostCategory(blogPost) }}
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
                    @click.prevent="editBlogPost(blogPost, index)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-primary delete-button"
                    @click.prevent="deleteBlogPost(blogPost, index)"
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
    <template v-if="isBlogPostViewOpen">
      <!-- Close Button -->
      <BlogPostCloseButton @click.prevent="viewBlogPosts();toggleBlogPostView();clearSavedPostArray();" />
      <div class="blog-post-view container">
        <div class="row">
          <!-- DB content is string, convert to HTML object I hope-->
          <div class="col-lg-12 blog-post" v-if="savedPost" v-html="convertStringToHTML(savedPost[0].blogContent)"></div>
        </div>
      </div>
    </template>
  </div>
</template>

// Using new script setup
<script>
import { ref, onMounted, computed, inject, onUpdated, reactive, nextTick, onBeforeUpdate, onUnmounted } from "vue";
import BlogEditor from './BlogEditor'
import BlogPostCloseButton from "./BlogPostCloseButton";
import swal from "sweetalert";
import axios from "axios";

export default {
  name: "Blog",
  components: {
    BlogPostCloseButton,
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
    const toggleBlogEditor = computed(() => store.methods.toggleBlogEditor);
    const toggleBlogPostView = computed(() => store.methods.toggleBlogPostView);
    // Local ref
    const editBlogPostView = ref(false);
    const editBlogPostForm = ref(false);
    const isBlogDeleting = ref(false);
    // Logged in?
    const isLoggedIn = computed(() => store.state.logged);
    // Blog Posts Store
    const blogPosts = ref([]);
    const savedPost = reactive([]);
    // Image Count for blog posts img array
    const blogPostImageCount = ref(0);
    const files = ref({ files: [] });
    // Get blog post images ref
    const getBlogImage = reactive([]); 
    
    onMounted(async () => {
      viewBlogPosts.value();
      await getAllBlogPosts();
    });
    
    onUnmounted(async () => {
      isBlogDeleting.value = false;
    });
    
    onUpdated(() => {
      // Handle blog images on being updated or when selecting different blog posts
      const blogImages = document.querySelectorAll('.blog-image');
      if (blogImages === null) return;
      for (let i = 0; i < Object.keys(blogImages).length; i++) {
        blogImages[i].setAttribute('src', getBlogImage[i]);
      }
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
      store.state.isBlogPostViewOpen = false;
      store.state.isBlogViewOpen = false;
      // Open blog edit form
      toggleBlogEditor.value();
    }

    // Delete blog post
    async function deleteBlogPost(blogPost, index) {
      // Set this first not last lol especially before an axios call
      isBlogDeleting.value = true;
      // Send axios delete
      await axios
        .delete("blog/delete/" + blogPost._id)
        .then((response) => {
          if (response.data.error) {
              swal("Error", response.data.message, "error");
          }
          else {
              swal("Success", "Blog Post Deleted!", "success");
          }
        })
        .catch((error) => {
        swal("Error", "Delete Blog Error => " + error, "error");
        });
      console.log("DELETE BLOG POST: " + JSON.stringify(blogPost));
      /// Set blog to deleting to avoid triggering getBlogPost() method and states
      // Remove blog post from array
      blogPosts.value.splice(index, 1);
      // Meh, not sure how to handle this...  we could watch and then use nextTick method (maybe)
      setTimeout(() => isBlogDeleting.value = false, 5);
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

    function getBlogPost(blogPost, index) {
      if (isBlogDeleting.value === true) return;
      store.state.isBlogViewOpen = false;
      store.state.isBlogPostViewOpen = true; // keep forgetting you can access store directly
      savedPost.push(blogPost);
      console.log("SAVED POST: => " + JSON.stringify(savedPost));
      getBlogImageUrls(blogPost, index);
      nextTick(() => {
        isBlogDeleting.value = false;
      });
    }
    // Discombobulate blog post from db
    let convertStringToHTML = (str) => {
      const tmpArray = [];
      let n = JSON.parse(str);
      for (let i = 0; i < Object.keys(n).length; i++) {
        tmpArray.push(n[i]);
      }
      return tmpArray.join("");
    }
    // Nightmare code lol
    function getBlogImageUrls() {
      if (!savedPost.length > 0) return;
        for (blogPostImageCount.value = 0; blogPostImageCount.value < savedPost[0].blogImagesUrls.length; blogPostImageCount.value++) {
          const name = savedPost[0].blogTitle;
          if (name === undefined) return; // Vue state trying to add img buggy
          const formatName = name.replace(/ /g, "-").toLowerCase();
          console.log("Blog Image: " + savedPost[0].blogImagesUrls[blogPostImageCount.value]);
          let img = computed(() => {
            const str = savedPost[0].blogImagesUrls[blogPostImageCount.value];
            return str.split("\\").pop().split("/").pop();
          });
          if (img.value) {
            console.log("bImage: " + JSON.stringify(img));
            getBlogImage.push(require(`@/assets/blog/` + `${formatName}/${img.value}`))
          }
          else {
            return []; // Vue state trying to add img buggy webpack issue
          }
        }
        blogPostImageCount.value = 0;
    }
  // Clear savedPost array to prevent showing the same post when you click on a different blog post
  function clearSavedPostArray() {
    savedPost.splice(0);
    getBlogImage.splice(0);
  }

    return {
      store,
      getBlogPost,
      getBlogImageUrls,
      blogPostImageCount,
      viewBlogPosts,
      isBlogViewOpen,
      isBlogDeleting,
      isBlogPostViewOpen,
      isBlogEditorOpen,
      toggleBlogEditor,
      toggleBlogPostView,
      isLoggedIn,
      blogPosts,
      savedPost,
      files,
      editBlogPost,
      deleteBlogPost,
      editBlogPostView,
      editBlogPostForm,
      blogImgUrl,
      blogPostTitle,
      blogPostCategory,
      convertStringToHTML,
      clearSavedPostArray,
    }
  }
};

</script>

<style lang="scss" scoped>
  .blog-editor-wrapper {
    background: rgba($color: #000000, $alpha: 0.8);
    border: 1px solid rgb(199, 208, 253);
  }

  img {
    width: 100%;
    height: 15vw;
    object-fit: contain;
  }
</style>