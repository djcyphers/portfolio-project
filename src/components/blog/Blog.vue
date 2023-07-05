<template>
  <div class="blog-wrapper">
    <div v-if="isBlogViewOpen" class="blog-view container-fluid">
      <!-- Blog Posts -->
      <div class="row justify-content-center">
        <div
          v-for="(blogPost, index) in blogPosts"
          :key="index"
          class="col-lg-3 col-md-4 col-sm-6 blog-home bg-transparent card me-3 mb-3"
          @click.prevent="
            getBlogPost(blogPost, index);
            closeBlogYearFilter();
          "
        >
          <img
            class="card-img bg-black img-thumbnail"
            :src="`http://localhost:4000/${blogPost.blogImagesUrls[0]}`"
            :alt="blogPostTitle(blogPost)"
          />
          <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
          <div
            class="card-img-overlay d-flex flex-column justify-content-end card-img-textarea"
          >
            <div class="blog-title bg-black mb-0 opacity-75">
              {{ blogPostTitle(blogPost) }}
            </div>
            <div class="blog-category card-text bg-black opacity-75">
              {{ "Category: " + blogPostCategory(blogPost) }}
            </div>
          </div>
          <!-- Check if logged in to prevent editing todo: add user roles -->
          <template v-if="isLoggedIn">
            <div class="btn-group" role="group" aria-label="Admin Buttons">
              <button
                class="btn btn-primary edit-button"
                @click.stop="
                  editBlogPost(blogPost, index);
                  store.state.isBlogEditingPost = true;
                "
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
          <BlogEditor :blogPostData="blogPostData" />
        </div>
      </div>
    </template>
    <!-- Blog Post View -->
    <template v-if="isBlogPostViewOpen">
      <!-- Close Button -->
      <CloseButton
        @click.prevent="
          viewBlogPosts();
          toggleBlogPostViewOff();
          clearSavedPostArray();
          toggleModalOff();
          openBlogYearFilter();
        "
      />
      <div class="blog-post-view container">
        <div class="row">
          <!-- DB content is string, convert to HTML object I hope-->
          <div
            class="col-lg-12 blog-post"
            v-if="savedPost"
            v-html="convertStringToHTML(savedPost[0].blogContent)"
          ></div>
        </div>
      </div>
    </template>
  </div>
  <!-- Blog Post Years Pagination -->
  <Transition name="fade">
    <div
      v-if="isBlogYearFilterOpen"
      id="blog-year-filter"
      class="blog-filter-panel d-flex flex-column flex-shrink-0 p-3 text-white animate__animated"
    >
      <h4>Blog Posts by Year</h4>
      <hr />
      <div
        class="blog-year-paginated col-lg-1"
        @click.prevent="getAllBlogPosts()"
      >
        <div class="blog-year-text">All</div>
      </div>
      <div
        v-for="(blogYear, index) in blogYears"
        :key="index"
        class="blog-year-paginated col-lg-1"
      >
        <div
          class="blog-year-text"
          @click.prevent="getPreviousYearBlogPosts(blogYear)"
        >
          {{ blogYear }}
        </div>
      </div>
    </div>
  </Transition>
  <!-- End Pagination -->
</template>

<script>
import {
  ref,
  onMounted,
  computed,
  inject,
  onUpdated,
  reactive,
  nextTick,
  onUnmounted,
} from "vue";
import BlogEditor from "./BlogEditor";
import CloseButton from "../CloseButton";
import swal from "sweetalert";
import axios from "axios";

export default {
  name: "Blog",
  components: {
    CloseButton,
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
    const toggleBlogPostViewOff = computed(
      () => store.methods.toggleBlogPostViewOff
    );

    // Filter By Year Funcs
    const isBlogYearFilterOpen = computed(
      () => store.state.isBlogYearFilterOpen
    );

    // Local ref
    const editBlogPostView = ref(false);
    const editBlogPostForm = ref(false);
    const isBlogDeleting = ref(false);
    const checkBlogPostViewOpen = ref(false);
    // Logged in?
    const isLoggedIn = computed(() => store.state.logged);
    // Blog Posts Temp storage
    const blogPosts = ref([]);
    const savedPost = reactive([]);
    const blogYears = ref([]);
    // Edit Blog Post data
    const blogPostData = ref([]);
    // Image Count for blog posts img array
    const blogPostImageCount = ref(0);
    const files = ref({ files: [] });
    // Get blog post images ref
    const getBlogImage = reactive([]);

    onMounted(async () => {
      viewBlogPosts.value();
      await getCurrentYearBlogPosts();
      await getBlogYears();
    });

    onUnmounted(async () => {
      isBlogDeleting.value = false;
    });

    onUpdated(() => {
      // Handle blog images on being updated or when selecting different blog posts
      const blogImages = document.querySelectorAll(".blog-image");
      if (blogImages === null) return;
      for (let i = 0; i < Object.keys(blogImages).length; i++) {
        blogImages[i].setAttribute("src", getBlogImage[i]);
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

    // Get all blog posts by current year
    async function getCurrentYearBlogPosts() {
      const currentYear = new Date().getFullYear();
      await axios
        .get(`blog/posts/years/${currentYear}`)
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

    async function getBlogYears() {
      await axios
        .get("blog/posts/years/all")
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            // Put all posts into reactive array
            blogYears.value = response.data;
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
    }

    async function getPreviousYearBlogPosts(previousYear) {
      await axios
        .get(`blog/posts/years/${previousYear}`)
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
      // Add data back into the editor lol no
      blogPostData.value = blogPost;
      console.log(
        "EDIT BLOG POST (BlogPostData): " + JSON.stringify(blogPostData.value)
      );
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
          } else {
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
      setTimeout(() => (isBlogDeleting.value = false), 5);
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
      store.state.isBlogOpen = true;
      savedPost.push(blogPost);
      //console.log("SAVED POST: => " + JSON.stringify(savedPost));
      getBlogImageUrls(blogPost, index);
      nextTick(() => {
        isBlogDeleting.value = false;
      });
    }

    function toggleModalOff() {
      store.state.isBlogOpen = false;
    }

    // Discombobulate blog post from db
    const convertStringToHTML = (str) => {
      const tmpArray = [];
      let n = JSON.parse(str);
      for (let i = 0; i < Object.keys(n).length; i++) {
        tmpArray.push(n[i]);
      }
      return tmpArray.join("");
    };

    // Nightmare code lol
    function getBlogImageUrls() {
      if (!savedPost.length > 0) return;
      for (
        blogPostImageCount.value = 0;
        blogPostImageCount.value < savedPost[0].blogImagesUrls.length;
        blogPostImageCount.value++
      ) {
        const name = savedPost[0].blogTitle;
        if (name === undefined) return; // Vue state trying to add img buggy
        const formatName = name.replace(/ /g, "-").toLowerCase();
        console.log(
          "Blog Image: " + savedPost[0].blogImagesUrls[blogPostImageCount.value]
        );
        let img = computed(() => {
          const str = savedPost[0].blogImagesUrls[blogPostImageCount.value];
          return str.split("\\").pop().split("/").pop();
        });
        if (img.value) {
          getBlogImage.push(
            `http://localhost:4000/uploads/blogs/${formatName}/${img.value}`
          );
        } else {
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

    function closeBlogYearFilter() {
      const blogFilter = document.getElementById("blog-year-filter");
      if (!blogFilter) {
        return;
      }
      blogFilter.classList.remove("animate__backInRight");
      blogFilter.classList.add("animate__backOutRight");
    }

    function openBlogYearFilter() {
      const blogFilter = document.getElementById("blog-year-filter");
      if (!blogFilter) {
        return;
      }
      blogFilter.classList.remove("animate__backOutRight");
      blogFilter.classList.add("animate__backInRight");
    }

    return {
      store,
      getBlogPost,
      getBlogImageUrls,
      getBlogYears,
      getCurrentYearBlogPosts,
      getPreviousYearBlogPosts,
      getAllBlogPosts,
      blogPostImageCount,
      blogPostData,
      viewBlogPosts,
      isBlogViewOpen,
      isBlogDeleting,
      isBlogPostViewOpen,
      isBlogEditorOpen,
      isBlogYearFilterOpen,
      toggleBlogEditor,
      toggleBlogPostViewOff,
      toggleModalOff,
      checkBlogPostViewOpen,
      isLoggedIn,
      blogPosts,
      blogYears,
      savedPost,
      files,
      editBlogPost,
      deleteBlogPost,
      editBlogPostView,
      editBlogPostForm,
      blogPostTitle,
      blogPostCategory,
      convertStringToHTML,
      clearSavedPostArray,
      closeBlogYearFilter,
      openBlogYearFilter,
    };
  },
};
</script>

//
<style lang="scss" scoped>
.blog-filter-panel {
  position: fixed;
  right: -1px;
  top: 22vh;
  max-height: 200px;
  width: calc(8vw + 2rem);
  background-color: rgba(0, 0, 0, 0.7) !important;
  overflow-y: scroll;
}

.card {
  --bs-card-border-color: rgba(0, 128, 0, 0) !important;
}

.blog-title {
  font-size: 2rem;
  font-family: Dosis;
  font-weight: 400;
  color: #fff;
}

.blog-category {
  font-size: 1.5rem;
  font-family: Dosis;
  color: #fff;
  padding-bottom: 20px;
}

.blog-year-paginated {
  font-size: 15px;
  color: white;
  cursor: pointer;
}
.card-img {
  height: 255px;
}

.card-img-overlay {
  transition: 0.3s all ease-in-out;
}

.card-img-overlay:hover {
  transform: translateY(-10px);
}

.blog-home {
  width: 315px !important;
}

.blog-editor-wrapper {
  background: rgba($color: #000000, $alpha: 0.8);
  border: 1px solid rgb(199, 208, 253);
}

p {
  font-size: 5.5em;
}

img {
  width: 100%;
  height: 255px;
  object-fit: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
