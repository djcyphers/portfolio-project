<template>
  <div class="gallery container">
    <div class="gallery__default" v-if="viewGalleries">
      <!-- Bootstrap responsive card with onclick handler -->
      <div
        class="card bg-dark text-white p-3"
        role="button"
        @click="initNewGallery"
      >
        <div class="card-body">
          <h4 class="card-title">Create a New Gallery</h4>
          <p class="card-text">This is where the magic happens. Click here!</p>
        </div>
      </div>
      <!-- Main Galleries -->
      <div class="gallery-container" v-if="editGalleryInit">
        <div class="gallery" v-for="(gallery, index) in galleries" :key="index">
          <div class="gallery-cover">
            <img
              class="gallery-coverimage"
              :src="coverArtImg(gallery)"
              :alt="gallery.galleryName"
            />
          </div>
          <div class="gallery-title">
            <h3>{{ gallery.galleryName }}</h3>
          </div>
          <div class="gallery-description">
            <p>{{ gallery.galleryDescription }}</p>
          </div>
          <div class="gallery-edit">
            <button class="btn btn-primary" @click="editGallery(gallery.id)">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Create new gallery multiplart form -->
    <div
      class="gallery__new bg-dark text-white p-3"
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
    <div class="gallery__edit bg-dark text-white p-3" v-if="editGalleryView">
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
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input type="file" id="file" @change="uploadFile($event)" multiple />
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import swal from "sweetalert";
import axios from "axios";
export default {
  name: "Gallery",
  setup() {
    // Reactive local states
    const gallery = ref([]);
    const galleries = ref([]);
    const galleryId = ref("");
    const files = ref({ files: [] });
    const viewGalleries = ref(true);
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
            editGalleryInit.value = true;
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

    // Initiate new gallery creation
    function initNewGallery() {
      viewGalleries.value = false;
      createNewGalleryView.value = true;
    }

    // Return to view galleries
    function returnToViewGalleries() {
      viewGalleries.value = true;
      createNewGalleryView.value = false;
      editGalleryInit.value = true;
    }

    // Edit gallery
    function editGallery(id) {
      editGalleryView.value = true;
      viewGalleries.value = false;
      createNewGalleryView.value = false;
      // Save gallery id
      galleryId.value = id;
    }
    // Update gallery
    async function updateGallery() {
      let fData = new FormData();
      fData.append("galleryId", galleryId.value);
      fData.append(
        "galleryOldName",
        galleries.value[galleryId.value].galleryName
      );
      fData.append("galleryName", editGalleryForm.value.galleryName);
      fData.append(
        "galleryDescription",
        editGalleryForm.value.galleryDescription
      );
      fData.append("files", files.value.files[0]);
      await axios
        .patch("gallery/update", fData, {
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
              if (gallery.id === response.data.gallery.id) {
                gallery.galleryName = response.data.gallery.galleryName;
                gallery.galleryDescription =
                  response.data.gallery.galleryDescription;
                gallery.galleryCoverArtUrl =
                  response.data.gallery.galleryCoverArtUrl;
              }
            });
            editGalleryView.value = false;
            viewGalleries.value = true;
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
    };
  },
};
</script>
