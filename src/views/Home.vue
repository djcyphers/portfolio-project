<template>
  <!-- Parallax Effect -->
  <Background></Background>
  <!-- End Effect -->

  <!-- header start -->
  <Header></Header>
  <!-- end header -->

  <!-- Begin Wrapper -->
  <div id="wrapper">
    <ul id="mask">
      <li id="box1" class="box">
        <a name="box1"></a>
        <div class="content1">
          <!-- Temp Stuff -->
          <Welcome></Welcome>
          <!-- End Temp -->
        </div>
      </li>
      <!-- end box1 -->

      <li id="box2" class="box">
        <a name="box2"></a>
        <div class="content2 scroller">
          <!-- About Component -->
          <About></About>
        </div>
      </li>
      <!-- end box2 -->

      <li id="box3" class="box">
        <a name="box3"></a>
        <Gallery
          v-if="store.state.isMainGalleryWrapperOpen"
          Class="content3 scroller"
        />
      </li>
      <!-- end box3 -->

      <li id="box4" class="box">
        <a name="box4"></a>
        <div class="scroller" :class="blogOpen ? 'blog-view' : 'content4'">
          <Dashboard v-if="store.state.dashboard" />
          <Blog v-if="isMainBlogWrapperOpen" />
        </div>
      </li>
      <!-- end box4 -->
      <Admin />
    </ul>
    <!-- end mask -->
  </div>
  <!-- end wrapper -->
</template>

<script>
import Welcome from "../components/Welcome";
import Header from "../components/Header";
import Background from "../components/Background";
import About from "../components/About";
import Admin from "../components/admin/Admin";
import Dashboard from "../components/dashboard/Dashboard";
import Gallery from "../components/gallery/Gallery";
import Blog from "../components/blog/Blog";
import { inject, onMounted, computed } from "vue";

export default {
  name: "Home",
  components: {
    Welcome,
    Header,
    Background,
    About,
    Admin,
    Dashboard,
    Gallery,
    Blog,
  },
  setup() {
    const store = inject("store");
    // View Gallery
    const viewGalleries = computed(() => store.methods.viewGallery);
    const isMainBlogWrapperOpen = computed(
      () => store.state.isMainBlogWrapperOpen
    );

    const blogOpen = computed(() => store.state.isBlogOpen);

    onMounted(async () => {
      viewGalleries.value();
    });

    return {
      store,
      viewGalleries,
      isMainBlogWrapperOpen,
      blogOpen,
    };
  },
};
</script>

<style lang="scss" scoped>
.blog-view {
  width: 80%;
  height: 100%;
  top: 0;
  padding-top: 80px;
  bottom: 10%;
  margin: 0 auto;
  position: relative;
  background: rgba(255, 255, 255, 0);
  z-index: 11;
}
</style>
