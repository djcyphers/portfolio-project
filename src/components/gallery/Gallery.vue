<template>
  <div class="gallery-wrapper">
    <div class="gallery-view container" v-if="isGalleryOpen">
      <div class="row">
        <!-- Bootstrap responsive card (create gallery) -->
        <div
          v-if="isLoggedIn && isNewGalleryButtonVisible"
          class="responsive-box col-md-6 col-lg-3 p-1"
          role="button"
          @click="createNewGalleryView"
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
        <template v-if="isLoggedIn && isNewGalleryItemButtonVisible">
          <div
            class="responsive-box col-md-6 col-lg-3 p-1"
            role="button"
            @click="createNewGalleryItemView"
          >
            <!-- Create New Item -->
            <div
              class="card create-gallery bg-dark text-white"
              style="height: 255px"
            >
              <div class="card-body">
                <h3 class="card-title">Create a New Gallery Item</h3>
              </div>
            </div>
          </div>
          <!-- Click to go back to gallery -->
          <div
            class="responsive-box col-md-6 col-lg-3 p-1"
            role="button"
            @click="openGalleryView"
          >
            <!-- Create New Item -->
            <div
              class="card create-gallery bg-dark text-white"
              style="height: 255px"
            >
              <div class="card-body">
                <h3 class="card-title">Go Back to Gallery</h3>
              </div>
            </div>
          </div>
        </template>
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
              :alt="coverArtName(gallery)"
            />
            <div class="card-img-overlay">
              <div class="gallery-title card-title">
                <h3>{{ coverArtName(gallery) }}</h3>
              </div>
              <div class="gallery-description card-text">
                <p>{{ coverArtDescription(gallery) }}</p>
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
            class="col-md-6 col-lg-3 gallery-item"
            v-for="(galleryItem, index) in galleryItems"
            :key="index"
          >
            <a
              :href="galleryItemImg(galleryItem)"
              class="glightbox"
              :data-title="galleryItemTitle(galleryItem)"
              :data-description="galleryItemDescription(galleryItem)"
            >
              <img :src="galleryItemImg(galleryItem)" :alt="galleryItemTitle(galleryItem)" />
            </a>
            
            <div class="gallery-item-edit">
              <button
                class="btn btn-primary"
                @click="editGalleryItem(galleryItem.title)"
              >
                Edit {{ galleryItem }}
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
      v-if="isNewGalleryFormOpen"
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
        <button class="btn btn-secondary" @click="cancelGalleryCreateForm">
          Cancel
        </button>
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
      v-if="createNewGalleryItemFormView"
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
        <button class="btn btn-secondary" @click="cancelGalleryItemCreateForm">
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
    const galleryItem = ref([]);
    const galleryItems = ref([]);
    const galleryId = ref("");
    const files = ref({ files: [] });
    const isNewGalleryFormOpen = ref(false);
    const isNewGalleryButtonVisible = ref(false);
    const isNewGalleryItemButtonVisible = ref(false);
    const createNewGalleryItemFormView = ref(false);
    const editGalleryInit = ref(false);
    const editGalleryView = ref(false);
    const editGalleryForm = ref({ galleryName: "", galleryDescription: "" });
    const newGallery = ref({ galleryName: "", galleryDescription: "" });
    const newGalleryItem = ref({ galleryName: "", title: "", description: "" });
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

    /*

      Gallery and Gallery Item Views

    */
  
    // Try and get the cover art image from the assets folder
    function coverArtImg(gallery) {
      if (!gallery) {
        const gallery = {       
          galleryName: "Image loading...",
        };
        return gallery.value;
      }
      const name = gallery.galleryName.toLowerCase();
      const formatName = name.replace(/ /g, "-");
      let img = computed(() => {
        const str = gallery.galleryCoverArtUrl;
        return str.split("\\").pop().split("/").pop();
      });
      return require(`../../assets/galleries/` + `${formatName}/${img.value}`);
    }

    // Get the gallery item art image from the assets folder
    function galleryItemImg(galleryItem) {
      if (!galleryItem) {
        const galleryItem = {       
          title: "Image loading...",
        };
        return galleryItem;
      }
      const formatName = galleryItem.galleryName.toLowerCase().replace(/ /g, "-");
      let img = computed(() => {
        const str = galleryItem.galleryItemUrl;
        return str.split("\\").pop().split("/").pop();
      });
      return require(`../../assets/galleries/` + `${formatName}/${img.value}`);
    }

    // Get the gallery item title or fallback to this...
    function galleryItemTitle(galleryItem) {
      if (!galleryItem) {
        const galleryItem = {       
          title: "Image loading...",
        };
        return galleryItem.title;
      };
      return galleryItem.title;
    }

    // Get the gallery item description from the db
    function galleryItemDescription(galleryItem) {
      if (!galleryItem) {
        const galleryItem = {       
          description: "Image loading...",
        };
        return galleryItem.description;
      };
      return galleryItem.description;
    }

    // Cover art info fallback
    function coverArtName(gallery) {
      if (!gallery) {
        const gallery = {       
          galleryName: "Loading...",
        };
        return gallery.galleryName;
      }
      return gallery.galleryName;
    }

    // Cover art description fallback why vue why
    function coverArtDescription(gallery) {
      if (!gallery) {
        const gallery = {
          galleryDescription: "Image loading...",
        };
        return gallery.galleryDescription;
      }
      return gallery.galleryDescription;
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
            // console.log("GALLERY VALUE: " + galleries.value[0]._id);
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
            getAllGalleries();
          }
        })
        .catch((error) => {
          console.log("CG ERROR! => " + fData);
          swal("Error", error.response.data, "error");
        });
    }

    // Get newly created gallery and add it to the galleries array
    async function getAllGalleries() {
      await axios
        .get("gallery/all")
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            galleries.value.push(response.data);
            console.log("Get all galleries => " + response.data);
            // isGalleryOpen defaults to true on mounted
            isGalleryViewOpen.value = true;
          }
        })
        .catch((error) => {
          swal("Error", error + " Couldn't get any galleries!", "error");
        });
    }

    // Create new gallery item
    async function createNewGalleryItem() {
      let fData = new FormData();
      if (galleryId !== "") {
        fData.append("galleryName", galleryId.value);
        galleryId.value = galleryId.value.toLowerCase();
      } else {
        fData.append("galleryName", galleries.value[0].galleryId);
        galleryId.value = galleries.value[0].galleryId.value.toLowerCase();
      }
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
            // Return to view gallery items
            openGalleryItemView();
            // Add new gallery to galleries
            galleryItems.value = response.data;
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

    // Cancel Gallery Create New
    function cancelGalleryCreateForm() {
      isNewGalleryButtonVisible.value = true;
      isNewGalleryFormOpen.value = false;
      isGalleryViewOpen.value = true;
    }

    // Cancel Gallery Item Create New
    function cancelGalleryItemCreateForm() {
      isNewGalleryItemButtonVisible.value = true;
      createNewGalleryItemFormView.value = false;
      isGalleryItemViewOpen.value = true;
    }

    // Initiate new gallery creation
    function createNewGalleryView() {
      // exitGalleries.value();
      isGalleryViewOpen.value = false;
      isNewGalleryButtonVisible.value = false;
      isNewGalleryFormOpen.value = true;
    }

    // Open gallery view from gallery item view
    function openGalleryView() {
      isGalleryItemViewOpen.value = false;
      isGalleryViewOpen.value = true;
      isNewGalleryButtonVisible.value = true;
      isNewGalleryItemButtonVisible.value = false;
      createNewGalleryItemFormView.value = false;
    }

    // Open gallery item view from clicking on a gallery
    function openGalleryItemView() {
      // Close gallery view
      isGalleryViewOpen.value = false;
      // Hide create new gallery button
      isNewGalleryButtonVisible.value = false;
      // Open gallery item view
      isGalleryItemViewOpen.value = true;
      // Show create new gallery item button
      isNewGalleryItemButtonVisible.value = true;
      // Cancel gallery item create form
      cancelGalleryItemCreateForm();
    }

    // Create new gallery item open view
    function createNewGalleryItemView() {
      // Close gallery view
      isGalleryViewOpen.value = false;
      // Hide create new gallery button
      isNewGalleryButtonVisible.value = false;
      // Open gallery item view
      createNewGalleryItemFormView.value = true;
      // Show create new gallery item button
      isNewGalleryItemButtonVisible.value = false;
    }

    // Return to view galleries
    function returnToViewGalleries() {
      viewGalleries.value();
      isGalleryViewOpen.value = true;
      isNewGalleryFormOpen.value = false;
      editGalleryView.value = false;
    }

    // Edit gallery
    function editGallery(galleryName) {
      editGalleryView.value = true;
      isNewGalleryFormOpen.value = false;
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
      await axios
        .get("gallery/items/" + gallery.galleryName)
        .then((response) => {
          if (response.data.error) {
            // Select response depending on error
            if (response.data.message === "Gallery Item Not Found!") {
              // Switch to create new gallery item view
              galleryId.value = gallery.galleryName;
              openGalleryItemView();
              swal("Error", "Waiting for user to add content!", "error");
            }
          } else if (response.data.title === undefined) {
            // If no gallery items get the name for creating new items (ie: createNewGalleryItem)
            galleryId.value = gallery.galleryName;
            swal("Error", "No gallery items found!", "error");
            openGalleryItemView();
          } else {
            openGalleryItemView();
            // Add gallery items to gallery item array
            galleryItems.value.push(response.data);
            //console.log("GALLERY ITEMS RESPONSE => " + response.data._id);
            galleryId.value = response.data.galleryName;
            //console.log("GALLERY ITEMS => " + galleryItems.value);
          }
        })
        .catch((error) => {
          swal("Error", "Uh oh!" + error, "error");
        });
    }
    return {
      gallery,
      galleries,
      galleryItem,
      galleryItems,
      viewGalleries,
      exitGalleries,
      newGallery,
      newGalleryItem,
      getAllGalleries,
      createNewGallery,
      createNewGalleryView,
      createNewGalleryItemFormView,
      createNewGalleryItem,
      createNewGalleryItemView,
      isNewGalleryFormOpen,
      uploadFile,
      editGallery,
      editGalleryForm,
      editGalleryInit,
      editGalleryView,
      updateGallery,
      returnToViewGalleries,
      coverArtImg,
      coverArtName,
      coverArtDescription,
      galleryItemImg,
      galleryItemTitle,
      galleryItemDescription,
      store,
      isLoggedIn,
      isGalleryOpen,
      isGalleryViewOpen,
      isGalleryItemViewOpen,
      isNewGalleryButtonVisible,
      isNewGalleryItemButtonVisible,
      openGalleryView,
      openGalleryItemView,
      cancelGalleryUpdate,
      cancelGalleryCreateForm,
      cancelGalleryItemCreateForm,
      expandGallery,
      lightbox,
    };
  },
};
</script>
