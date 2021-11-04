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
        <div class="content1 float-left">
          <div class="content1-wrapper">
            <!-- Temp Stuff -->
            <Welcome></Welcome>
            <!-- End Temp -->
          </div>
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

        <!-- <div class="content3 scroller">@include('album.albumview')</div> -->
      </li>
      <!-- end box3 -->

      <li id="box4" class="box">
        <a name="box4"></a>
        <div class="content4 scroller">
          <Dashboard v-if="store.state.dashboard === true" />
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
import { inject } from "vue";

export default {
  name: "Home",
  components: { Welcome, Header, Background, About, Admin, Dashboard },
  setup() {
    const store = inject("store");
    return {
      store,
    };
  },
};
</script>
