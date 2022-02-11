<template>
  <div class="gallery-wrapper">
    <div class="gallery-view container" v-if="isGalleryOpen">
      <div class="row">
        <!-- Bootstrap responsive card (create gallery) -->
        <div
          v-if="isLoggedIn && isNewGalleryButtonVisible"
          class="responsive-box col-md-6 col-lg-3 p-1"
          role="button"
          @click="initNewGallery"
        >
          <!-- Create New Gallery -->
          <div
            class="card create-gallery bg-dark text-white"
            style="height: 255px"
          >
            <div class="card-body">
              <h4 class="card-title">Create a New Gallery</h4>
              <p class="card-text">Click here to begin!</p>
            </div>
          </div>
        </div>
        <!-- Bootstrap responsive card (add item to gallery) -->
        <div
          v-if="isLoggedIn && addGalleryItemView"
          class="responsive-box col-md-6 col-lg-3 p-1"
          role="button"
          @click="initNewGalleryItem"
        >
          <!-- Create New Item -->
          <div
            class="card create-gallery bg-dark text-white"
            style="height: 255px"
          >
            <div class="card-body">
              <h4 class="card-title">Create a New Gallery Item</h4>
              <p class="card-text">Click Here!</p>
            </div>
          </div>
        </div>
        <!-- Main Galleries -->
        <template v-if="isGalleryViewOpen">
          <div
            class="
              responsive-box
              col-md-6 col-lg-3
              gallery-base
              card
              text-black
              p-1
            "
            v-for="(gallery, index) in galleries"
            :key="index"
            @click="expandGallery(gallery)"
          >
            <img
              class="card-img img-thumbnail"
              :src="coverArtImg(gallery)"
              :alt="gallery.galleryName"
            />
            <div class="card-img-overlay">
              <div class="gallery-title card-title">
                <h3>{{ gallery.galleryName }}</h3>
              </div>
              <div class="gallery-description card-text">
                <p>{{ gallery.galleryDescription }}</p>
              </div>
            </div>
            <template v-if="editGalleryInit">
              <div class="gallery-edit">
                <button
                  class="btn btn-primary"
                  @click="editGallery(gallery.galleryName)"
                >
                  Edit
                </button>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- Gallery Item View (for item in gallery) -->
    <template v-if="isGalleryItemViewOpen">
      <div class="gallery-item-view container">
        <div class="row">
          <div
            class="col-md-6 col-lg-3 gallery-item card text-black p-1"
            v-for="(galleryItem, index) in gallery.galleryItems"
            :key="index"
          >
            <img
              class="card-img img-thumbnail"
              :src="galleryItem.galleryItemUrl"
              :alt="galleryItem.title"
            />
            <div class="card-img-overlay">
              <div class="gallery-item card-title">
                <h3>{{ galleryItem.title }}</h3>
              </div>
              <div class="gallery-item-description card-text">
                <p>{{ galleryItem.description }}</p>
              </div>
            </div>
            <div class="gallery-edit">
              <button
                class="btn btn-primary"
                @click="editGalleryItem(galleryItem.title)"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- Create new gallery multiplart form -->
    <div
      class="gallery__new card bg-dark text-white p-4"
      style="height: 60%; width: 60%"
      v-if="createNewGalleryView"
    >
      <form enctype="multipart/form-data" @submit.prevent="createNewGallery">
        <div class="form-group">
          <label for="galleryName">Gallery Name</label>
          <input
            type="text"
            class="form-control"
            id="galleryName"
            v-model="newGallery.galleryName"
          />
        </div>
        <div class="form-group">
          <label for="galleryDescription">Gallery Description</label>
          <input
            type="text"
            class="form-control"
            id="galleryDescription"
            v-model="newGallery.galleryDescription"
          />
        </div>
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input type="file" id="file" @change="uploadFile($event)" multiple />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
    <!-- Edit gallery form -->
    <div
      class="gallery__edit card bg-dark text-white mx-auto p-4"
      style="height: 60%; width: 60%"
      v-if="editGalleryView"
    >
      <form enctype="multipart/form-data" @submit.prevent="updateGallery">
        <div class="form-group">
          <label for="galleryName">Gallery Name</label>
          <input
            type="text"
            class="form-control"
            id="galleryName"
            v-model="editGalleryForm.galleryName"
          />
        </div>
        <div class="form-group">
          <label for="galleryDescription">Gallery Description</label>
          <input
            type="text"
            class="form-control"
            id="galleryDescription"
            v-model="editGalleryForm.galleryDescription"
          />
        </div>
        <br />
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input type="file" id="file" @change="uploadFile($event)" multiple />
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <button class="btn btn-secondary" @click="cancelGalleryUpdate">
          Cancel
        </button>
      </form>
    </div>
    <!-- Create new gallery item multiplart form -->
    <div
      class="galleryitem__new card bg-dark text-white p-4"
      style="height: 60%; width: 60%"
      v-if="addGalleryItemView"
    >
      <form
        enctype="multipart/form-data"
        @submit.prevent="createNewGalleryItem"
      >
        <div class="form-group">
          <label for="galleryName">Gallery Item Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="newGalleryItem.title"
          />
        </div>
        <div class="form-group">
          <label for="galleryDescription">Gallery Item Description</label>
          <input
            type="text"
            class="form-control"
            id="galleryDescription"
            v-model="newGalleryItem.description"
          />
        </div>
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input type="file" id="file" @change="uploadFile($event)" multiple />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import swal from "sweetalert";
import axios from "axios";
// Bootstrap 5 gLightBox
import "glightbox/dist/css/glightbox.css";
import "glightbox/dist/js/glightbox.js";
import GLightbox from "glightbox";

export default {
  name: "Gallery",
  setup() {
    // Store State
    const store = inject("store");
    const isLoggedIn = computed(() => store.state.logged);
    const isGalleryOpen = computed(() => store.state.viewGallery);
    // Reactive local states
    const isGalleryViewOpen = ref(true);
    const isGalleryItemViewOpen = ref(false);
    const gallery = ref([]);
    const galleries = ref([]);
    const galleryItems = ref([]);
    const galleryId = ref("");
    const files = ref({ files: [] });
    const createNewGalleryView = ref(false);
    const isNewGalleryButtonVisible = ref(false);
    const addGalleryItemView = ref(false);
    const editGalleryInit = ref(false);
    const editGalleryView = ref(false);
    const editGalleryForm = ref({ galleryName: "", galleryDescription: "" });
    const newGallery = ref({ galleryName: "", galleryDescription: "" });
    const newGalleryItem = ref({ title: "", description: "" });
    // lightbox
    const lightbox = ref();

    // Setters and Getters
    //
    // View Gallery
    const viewGalleries = computed({
      get() {
        return store.methods.viewGallery;
      },
      set() {
        return store.methods.viewGallery;
      },
    });

    // Exit Gallery
    const exitGalleries = computed({
      get() {
        return store.methods.exitGallery;
      },
      set() {
        return store.methods.exitGallery;
      },
    });

    // Main()
    //
    // Try and get the cover art image from the assets folder
    function coverArtImg(gallery) {
      let name = gallery.galleryName.toLowerCase();
      let img = computed(() => {
        const str = gallery.galleryCoverArtUrl;
        return str.split("\\").pop().split("/").pop();
      });
      return require(`../../assets/galleries/` + `${name}/${img.value}`);
    }

    // Get all galleries from db
    onMounted(async () => {
      // Init gallery button to true
      isNewGalleryButtonVisible.value = true; // still needs isLoggedIn check
      //lightbox settings
      lightbox.value = GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        closeButton: true,
        autoplayVideos: true,
        autoplayVideosUntilClose: true,
        closeOnSlideClick: true,
      });
      // Get all galleries from db
      await axios
        .get("gallery/all")
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            galleries.value = response.data;
            // console.log("GALLERY VALUE: " + galleries.value);
            // isGalleryOpen defaults to true on mounted
            isGalleryViewOpen.value = true;
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
    });

    // Create new gallery
    async function createNewGallery() {
      let fData = new FormData();
      fData.append("galleryName", newGallery.value.galleryName);
      fData.append("galleryDescription", newGallery.value.galleryDescription);
      fData.append("files", files.value.files[0]);
      await axios
        .post("gallery/create", fData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            swal("Success", "Gallery created!", "success");
            // Return to view galleries
            returnToViewGalleries();
            // Add new gallery to galleries
            galleries.value.push(response.data.gallery);
          }
        })
        .catch((error) => {
          console.log("CG ERROR! => " + fData);
          swal("Error", error.response.data, "error");
        });
    }

    // Create new gallery item
    async function createNewGalleryItem() {
      let fData = new FormData();
      fData.append("galleryId", galleryId.value);
      fData.append("title", newGalleryItem.value.title);
      fData.append("description", newGalleryItem.value.description);
      fData.append("files", files.value.files[0]);
      await axios
        .post("gallery/item/create/" + galleryId.value, fData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            swal("Success", "Gallery item created!", "success");
            // Return to view galleries
            returnToViewGalleries();
            // Add new gallery to galleries
            galleryItems.value.push(response.data.galleryItem);
          }
        })
        .catch((error) => {
          console.log("CG ERROR! => " + fData);
          swal("Error", error.response.data, "error");
        });
    }

    // Upload file
    async function uploadFile(event) {
      files.value.files = event.target.files;
    }

    // Cancel Gallery Update
    function cancelGalleryUpdate() {
      editGalleryView.value = false;
      isGalleryViewOpen.value = true;
    }

    // Initiate new gallery creation
    function initNewGallery() {
      isGalleryViewOpen.value = false;
      isNewGalleryButtonVisible.value = false;
      createNewGalleryView.value = true;
    }

    // Initiate new gallery item creation
    function initNewGalleryItem() {
      exitGalleries.value();
      isGalleryViewOpen.value = false;
      addGalleryItemView.value = true;
    }

    // Return to view galleries
    function returnToViewGalleries() {
      viewGalleries.value();
      isGalleryViewOpen.value = true;
      createNewGalleryView.value = false;
      editGalleryView.value = false;
    }

    // Edit gallery
    function editGallery(galleryName) {
      editGalleryView.value = true;
      createNewGalleryView.value = false;
      isGalleryViewOpen.value = false;
      // Save gallery id
      galleryId.value = galleryName;
    }
    // Update gallery
    async function updateGallery() {
      let fData = new FormData();
      fData.append("galleryOldName", galleryId.value);
      fData.append("galleryName", editGalleryForm.value.galleryName);
      fData.append(
        "galleryDescription",
        editGalleryForm.value.galleryDescription
      );
      fData.append("files", files.value.files[0]);
      await axios
        .patch("gallery/update/" + galleryId.value, fData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            swal("Success", "Gallery updated!", "success");
            // Update gallery in galleries
            galleries.value.forEach((gallery) => {
              if (gallery.galleryName === response.data.galleryName) {
                gallery.galleryName = response.data.gallery.galleryName;
                gallery.galleryDescription =
                  response.data.gallery.galleryDescription;
                gallery.galleryCoverArtUrl =
                  response.data.gallery.galleryCoverArtUrl;
              }
            });
            editGalleryView.value = false;
            viewGalleries.value();
            isGalleryViewOpen.value = true;
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
    }
    // Open gallery to view gallery items
    async function expandGallery(gallery) {
      // Make api call to get items
      console.log(gallery.galleryName);
      await axios
        .get("gallery/name/" + gallery.galleryName)
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            isGalleryViewOpen.value = false;
            isGalleryItemViewOpen.value = true;
            // Add gallery items to gallery item array
            galleryItems.value = response.data.gallery.galleryItems;
            galleryId.value = gallery.galleryName;
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
    }
    return {
      gallery,
      galleries,
      createNewGallery,
      viewGalleries,
      exitGalleries,
      createNewGalleryView,
      newGallery,
      newGalleryItem,
      addGalleryItemView,
      createNewGalleryItem,
      initNewGallery,
      initNewGalleryItem,
      uploadFile,
      editGallery,
      editGalleryForm,
      editGalleryInit,
      editGalleryView,
      updateGallery,
      returnToViewGalleries,
      coverArtImg,
      store,
      isLoggedIn,
      isGalleryOpen,
      isGalleryViewOpen,
      isGalleryItemViewOpen,
      isNewGalleryButtonVisible,
      cancelGalleryUpdate,
      expandGallery,
      lightbox,
    };
  },
};
</script>
