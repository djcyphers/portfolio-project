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
          <!-- @component('layouts.components.about-info') @endcomponent -->
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
          <div class="content row">
            <div class="col-lg-12">
              <!-- <iframe src="http://www.ustream.tv/embed/10054617" width="608" height="368" scrolling="no" frameborder="0" style="border: 0px none transparent;"></iframe><br /> -->
            </div>
          </div>
        </div>
      </li>
      <!-- end box4 -->
    </ul>
    <!-- end mask -->
  </div>
  <!-- end wrapper -->
</template>

<script>
import Welcome from "../components/Welcome.vue";
import Header from "../components/Header.vue";
import Background from "../components/Background.vue";

export default {
  name: "Home",
  components: { Welcome, Header, Background },
};
</script>
