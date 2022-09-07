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
            style="height: 256px"
          >
            <div class="card-body">
              <h4 class="card-title">Create a New Gallery</h4>
              <p class="card-text">Click here to begin!</p>
            </div>
          </div>
        </div>
        <!-- Bootstrap responsive card (add item to gallery) -->
        <template v-if="isLoggedIn && isNewGalleryItemButtonVisible && !isGalleryUpdating">
          <div
            class="responsive-box col-md-6 col-lg-3 p-1"
            role="button"
            @click="createNewGalleryItemView"
          >
            <!-- Create New Item -->
            <div
              class="card create-gallery bg-dark text-white"
              style="height: 256px"
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
              style="height: 256px"
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
            <template v-if="isLoggedIn">
              <div class="btn-group" role="group" aria-label="Admin Buttons">
                <button
                  class="btn btn-primary edit-button"
                  @click="editGallery(gallery)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-primary delete-button"
                  @click="deleteGallery(gallery)"
                >
                  Delete
                </button>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- Gallery Item View (for item in gallery) -->
    <template v-if="isGalleryItemViewOpen && !isGalleryUpdating">
      <div class="gallery-item-view container">
        <div class="row">
          <div
            class="col-md-6 col-lg-3 gallery-item"
            v-for="(galleryItem, index) in galleryItems"
            :key="index"
            >
            <a
              ref="galleryItemRef"
              @click.prevent="attachLightbox($event)"
              :href="galleryItemImg(galleryItem)"
              class="lightbox"
              :data-footer="galleryItemDescription(galleryItem)"
              :data-gallery="galleryItemTitle(galleryItem)"
              data-toggle="lightbox"
            >
              <img :src="galleryItemImg(galleryItem)" :alt="galleryItemTitle(galleryItem)" />
            </a>
            <template v-if="isLoggedIn">
              <div class="btn-group" role="group" aria-label="Admin Buttons">
                <button
                  class="btn btn-primary edit-button"
                  @click="editGalleryItem(galleryItem.title)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-primary delete-button"
                  @click="deleteGalleryItem(galleryItem)"
                >
                  Delete
                </button>
              </div>
            </template>
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
          <label for="galleryName">Update Gallery Name</label>
          <input
            type="text"
            class="form-control"
            id="galleryName"
            v-model="editGalleryForm.galleryName"
          />
        </div>
        <div class="form-group">
          <label for="galleryDescription">Update Gallery Description</label>
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
import Lightbox from 'bs5-lightbox';

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
    const galleryName = ref("");
    const files = ref({ files: [] });
    const isNewGalleryFormOpen = ref(false);
    const isNewGalleryButtonVisible = ref(false);
    const isNewGalleryItemButtonVisible = ref(false);
    const isGalleryUpdating = ref(false);
    const createNewGalleryItemFormView = ref(false);
    const editGalleryInit = ref(false);
    const editGalleryView = ref(false);
    const editGalleryForm = ref({ galleryName: "", galleryDescription: "" });
    const newGallery = ref({ galleryName: "", galleryDescription: "" });
    const newGalleryItem = ref({ galleryName: "", title: "", description: "" });

    // Lightbox
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

    // Get all galleries from db
    onMounted(async () => {
      // Init gallery button to true
      isNewGalleryButtonVisible.value = true; // still needs isLoggedIn check
      // Get all galleries from db
      await getGalleriesOnMount().value;
    });

    // Get all galleries from db function
    async function getGalleriesOnMount() {
      await axios
        .get("gallery/all")
        .then((response) => {
          galleries.value = response.data;
        })
        .catch((error) => {
          console.log(error);
          swal("Error", "Get all galleries onMount error!", "error");
        });
    };

    const lightboxOptions = {
      keyboard: true,
    };

    //Start lightbox init
    const attachLightbox = (event) => {
      lightbox.value = new Lightbox(event.currentTarget, lightboxOptions);
      lightbox.value.show();
    };
  
    // Try and get the cover art image from the assets folder
    function coverArtImg(gallery) {
      const name = gallery.galleryName;
      const formatName = name.replace(/ /g, "-").toLowerCase();
      let img = computed(() => {
        const str = gallery.galleryCoverArtUrl;
        return str.split("\\").pop().split("/").pop();
      });
      return require(`../../assets/galleries/` + `${formatName}/${img.value}`);
    }

    function galleryItemImg(galleryItem) {
      const name = galleryItem.galleryName;
      if (name === undefined) { // Strange behavoir of name returning undefined after creating a gallery item 
        return;
      }
      const formatName = name.replace(/ /g, "-").toLowerCase();
      let img = computed(() => {
        const str = galleryItem.galleryItemUrl;
        return str.split("\\").pop().split("/").pop();
      });
      return require(`@/assets/galleries/` + `${formatName}/${img.value}`);
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
            galleries.value = response.data;
            //console.log("Get all galleries => " + response.data);
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
      // Galleries ref array needs to be accessed with [0] to get the first gallery
      // This array should always be set as object and not pushed to
      //console.log("GALLERY ID => " + galleries.value[0]._id);
      fData.append("galleryId", galleries.value[0]._id);
      fData.append("galleryName", galleries.value[0].galleryName);
      fData.append("title", newGalleryItem.value.title);
      fData.append("description", newGalleryItem.value.description);
      fData.append("files", files.value.files[0]);
      await axios
        .post("gallery/item/create/" + galleries.value[0]._id, fData, {
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
      isGalleryUpdating.value = false;
      isGalleryItemViewOpen.value = false;
      isNewGalleryItemButtonVisible.value = false;
      isNewGalleryButtonVisible.value = true;
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
      /* 
        Clear the array when going back to gallery view to prevent duplicate gallery items
      */
      galleryItem.value.length = 0;
      galleryItems.value.length = 0;
    }

    // Open gallery item view from clicking on a gallery
    function openGalleryItemView() {
      // Cancel gallery item create form
      cancelGalleryItemCreateForm();
      // Close gallery view
      isGalleryViewOpen.value = false;
      // Hide create new gallery button
      isNewGalleryButtonVisible.value = false;
      // Open gallery item view
      isGalleryItemViewOpen.value = true;
      // Show create new gallery item button
      isNewGalleryItemButtonVisible.value = true;
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

    // Delete gallery item
    async function deleteGalleryItem(galleryItem) {
      await axios
      .delete("gallery/item/delete/" + galleryItem._id)
      .then((response) => {
        if (response.data.error) {
          swal("Error", response.data.message, "error");
        } 
        else {
          swal("Success","File Deleted!", "success");
        }
      })
      .catch((error) => {
        swal("Error", "Delete Error => " + error, "error");
      });
    }

    // Edit gallery view
    function editGallery(galleryName) {
      isNewGalleryFormOpen.value = false;
      isGalleryViewOpen.value = false;
      isGalleryUpdating.value = true;
      editGalleryView.value = true;
      // Save gallery name to patch with req pram name
      galleryName.value = galleryName;
    }

    // Update gallery
    async function updateGallery(galleryName) {
      let fData = new FormData();
      fData.append("galleryOldName", galleryName);
      fData.append("galleryName", editGalleryForm.value.galleryName);
      fData.append(
        "galleryDescription",
        editGalleryForm.value.galleryDescription
      );
      fData.append("files", files.value.files[0]);
      await axios
        .patch("gallery/update/" + galleryName.value, fData, {
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

      if (gallery.galleryItems) { // Then go to create gallery item screen
      // Make api call to get items
      await axios
        .get("gallery/items/" + gallery.galleryName)
        .then((response) => {
          if (!response.data.error) {
            galleryItems.value = response.data;
            //console.log("GALLERY ITEMS => " + JSON.stringify(galleryItems.value));
            // Open gallery view
            openGalleryItemView();
          } else if (response.data.message = "Gallery Item Not Found!") {
            openGalleryItemView();
            swal("Error", response.data.message, "error");
          }
          else {
            openGalleryView();
            swal("Error", response.data.message, "error");
          }
      })
        .catch((error) => {
          swal("Error", "Uh oh!" + error, "error");
        });
      } else {
        openGalleryItemView();
        swal("Error", "Waiting for user to add content!", "error");
      }
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
      deleteGalleryItem,
      updateGallery,
      returnToViewGalleries,
      coverArtImg,
      coverArtName,
      coverArtDescription,
      galleryItemImg,
      galleryItemTitle,
      galleryItemDescription,
      getGalleriesOnMount,
      galleryName,
      store,
      isLoggedIn,
      isGalleryOpen,
      isGalleryViewOpen,
      isGalleryItemViewOpen,
      isGalleryUpdating,
      isNewGalleryButtonVisible,
      isNewGalleryItemButtonVisible,
      openGalleryView,
      openGalleryItemView,
      cancelGalleryUpdate,
      cancelGalleryCreateForm,
      cancelGalleryItemCreateForm,
      expandGallery,
      lightbox,
      lightboxOptions,
      attachLightbox,
    };
  },
};
</script>
