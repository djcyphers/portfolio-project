<template>
  <div class="gallery-wrapper">
    <div class="gallery-view container" v-if="isGalleryOpen">
      <div class="row">
        <!-- Bootstrap responsive card with onclick handler -->
        <div
          v-if="isLoggedIn"
          class="responsive-box col-md-6 col-lg-3 p-1"
          role="button"
          @click="initNewGallery"
        >
          <div
            class="card create-gallery bg-dark text-white"
            style="height: 500px; width: 500px"
          >
            <div class="card-body">
              <h4 class="card-title">Create a New Gallery</h4>
              <p class="card-text">Click here to begin!</p>
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
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import swal from "sweetalert";
import axios from "axios";
export default {
  name: "Gallery",
  setup() {
    // Store State
    const store = inject("store");
    const isLoggedIn = computed(() => store.state.logged);
    const isGalleryOpen = computed(() => store.state.viewGallery);
    // Reactive local states
    const isGalleryViewOpen = ref(true);
    const gallery = ref([]);
    const galleries = ref([]);
    const galleryId = ref("");
    const files = ref({ files: [] });
    const createNewGalleryView = ref(false);
    const editGalleryInit = ref(false);
    const editGalleryView = ref(false);
    const editGalleryForm = ref({
      galleryName: "",
      galleryDescription: "",
    });
    const newGallery = ref({
      galleryName: "",
      galleryDescription: "",
    });
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
      exitGalleries.value();
      createNewGalleryView.value = true;
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
    return {
      gallery,
      galleries,
      createNewGallery,
      viewGalleries,
      exitGalleries,
      createNewGalleryView,
      newGallery,
      initNewGallery,
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
      cancelGalleryUpdate,
    };
  },
};
</script>
