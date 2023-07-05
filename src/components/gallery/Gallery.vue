<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="gallery-wrapper">
    <div
      v-if="isGalleryViewOpen"
      class="gallery-view container"
    >
      <div class="row justify-content-center">
        <!-- Main Galleries -->
        <div
          v-for="(gallery, index) in galleries"
          :key="index"
          class="
              responsive-box
              col-md-6 col-lg-3
              gallery-base
              bg-transparent
              card
              me-3
              mb-3
              mt-4
            "
          @click="expandGallery(gallery)"
        >
          <img
            class="card-img img-thumbnail bg-black"
            :src="`http://localhost:4000/${gallery.galleryCoverArtUrl}`"
            :alt="coverArtName(gallery)"
          >
          <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
          <div class="card-img-overlay d-flex flex-column justify-content-end card-img-textarea">
            <div class="gallery-title card-title bg-black mb-0 opacity-75">
              {{ coverArtName(gallery) }}
            </div>
            <div class="gallery-description card-text bg-black opacity-75">
              {{ coverArtDescription(gallery) }}
            </div>
          </div>
          <template v-if="isLoggedIn">
            <div
              class="btn-group"
              role="group"
              aria-label="Admin Buttons"
            >
              <button
                class="btn btn-primary edit-button"
                @click.stop="editGallery(gallery)"
              >
                Edit
              </button>
              <button
                class="btn btn-primary delete-button"
                @click.stop="deleteGallery(gallery, index)"
              >
                Delete
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- Gallery Item View (for item in gallery) -->
    <template v-if="isGalleryItemViewOpen && !isGalleryUpdating">
      <!-- Close Button -->
      <CloseButton @click.prevent="openGalleryView" />
      <div class="gallery-item-view container">
        <div class="row justify-content-center">
          <div
            v-for="(galleryItem, index) in galleryItems"
            :key="index"
            class="col-lg-3 col-sm-4 text-white me-2"
          >
            <div class="image-card-item">
              <a
                :href="`http://localhost:4000/${galleryItem.galleryItemUrl}`"
                class="lightbox"
                :data-footer="galleryItemDescription(galleryItem)"
                :data-gallery="galleryItemTitle(galleryItem)"
                data-toggle="lightbox"
                @click.prevent="attachLightbox($event)"
              >
                <img
                  :src="`http://localhost:4000/${galleryItem.galleryItemUrl}`"
                  class="img-responsive gallery-card-image"
                  :alt="galleryItemTitle(galleryItem)"
                >
              </a>
                <div class="image-title text-white">{{ galleryItem.title }}</div>
            </div>
            <template v-if="isLoggedIn">
              <button
                class="btn btn-primary delete-button"
                @click="deleteGalleryItem(galleryItem, index)"
              >
                Delete
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>
    <!-- Create new gallery multiplart form -->
    <div
      v-if="isNewGalleryFormOpen"
      class="new-gallery-form card bg-dark text-white p-4"
      style="height: 60%; width: 60%"
    >
      <form
        enctype="multipart/form-data"
        @submit.prevent="createNewGallery"
      >
        <div class="form-group">
          <label for="galleryName">Gallery Name</label>
          <input
            id="galleryName"
            v-model="newGallery.galleryName"
            type="text"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="galleryDescription">Gallery Description</label>
          <input
            id="galleryDescription"
            v-model="newGallery.galleryDescription"
            type="text"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input
            id="file"
            type="file"
            multiple
            @change="uploadFile($event)"
          >
        </div>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Create
        </button>
        <button
          class="btn btn-secondary"
          @click="cancelGalleryCreateForm"
        >
          Cancel
        </button>
      </form>
    </div>
    <!-- Edit gallery form -->
    <div
      v-if="editGalleryView"
      class="gallery__edit card bg-dark text-white mx-auto p-4"
      style="height: 60%; width: 60%"
    >
      <form
        enctype="multipart/form-data"
        @submit.prevent="updateGallery()"
      >
        <div class="form-group">
          <label for="galleryName">Update Gallery Name</label>
          <input
            id="galleryName"
            v-model="editGalleryForm.galleryName"
            type="text"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="galleryDescription">Update Gallery Description</label>
          <input
            id="galleryDescription"
            v-model="editGalleryForm.galleryDescription"
            type="text"
            class="form-control"
          >
        </div>
        <br>
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input
            id="file"
            type="file"
            multiple
            @change="uploadFile($event)"
          >
        </div>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Update
        </button>
        <button
          class="btn btn-secondary"
          @click="cancelGalleryUpdate"
        >
          Cancel
        </button>
      </form>
    </div>
    <!-- Create new gallery item multiplart form -->
    <div
      v-if="isNewGalleryItemFormOpen"
      class="galleryitem__new card bg-dark text-white p-4"
      style="height: 60%; width: 60%"
    >
      <form
        enctype="multipart/form-data"
        @submit.prevent="createNewGalleryItem()"
      >
        <div class="form-group">
          <label for="galleryName">Gallery Item Title</label>
          <input
            id="title"
            v-model="newGalleryItem.title"
            type="text"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="galleryDescription">Gallery Item Description</label>
          <input
            id="galleryDescription"
            v-model="newGalleryItem.description"
            type="text"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="galleryCoverArtUrl">Upload File</label>
          <input
            id="file"
            type="file"
            multiple
            @change="uploadFile($event)"
          >
        </div>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Create
        </button>
        <button
          class="btn btn-secondary"
          @click="cancelGalleryItemCreateForm"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject, nextTick } from "vue";
import swal from "sweetalert";
import axios from "axios";
import Lightbox from 'bs5-lightbox';
import CloseButton from "../CloseButton.vue"

export default {
    name: "Gallery",
    components: { CloseButton },
    setup() {
        // Store StateS
        const store = inject("store");
        // View Gallery
        // This section needs to be refactored more const viewGalleries = computed(() => store.methods.viewGallery);
        const viewGalleries = computed(() => store.methods.viewGallery);
        // Exit Gallery
        const exitGalleries = computed(() => store.methods.exitGallery);
        // View Gallery Items
        const viewGalleryItems = computed(() => store.methods.viewGalleryItems);
        // Close Gallery Items View
        const closeGalleryItemsView = computed(() => store.methods.closeGalleryItems);
        // View new gallery create form
        const viewGalleryForm = computed(() => store.methods.newGalleryForm);
        // Close new gallery form
        const closeGalleryForm = computed(() => store.methods.closeGalleryForm);
        // View new gallery item create form
        const viewGalleryItemForm = computed(() => store.methods.newGalleryItemForm);
        // Close gallery item form
        const closeGalleryItemForm = computed(() => store.methods.closeGalleryItemForm);
 
        const isLoggedIn = computed(() => store.state.logged);
        // View Gallery Create Form
        const isGalleryViewOpen = computed(() => store.state.isGalleryViewOpen);
        const isGalleryItemViewOpen = computed(() => store.state.isGalleryItemViewOpen);
        const isNewGalleryFormOpen = computed(() => store.state.isNewGalleryFormOpen);
        const isNewGalleryItemFormOpen = computed(() => store.state.isNewGalleryItemFormOpen);
        // Reactive local states
        const gallery = ref([]);
        const galleryId = ref("");
        const galleries = ref([]);
        const galleryItem = ref([]);
        const galleryItems = ref([]);
        const getStorage = ref([]);
        const files = ref({ files: [] });
        const isGalleryUpdating = ref(false);
        const editGalleryInit = ref(false);
        const editGalleryView = ref(false);
        const editGalleryForm = ref({ galleryName: "", galleryDescription: "" });
        const newGallery = ref({ galleryName: "", galleryDescription: "" });
        const newGalleryItem = ref({ galleryName: "", title: "", description: "" });
        // Lightbox
        const lightbox = ref();
        
      /*
  
      Lifecycle Hooks
      
      */

        // Get all galleries from db
        onMounted(() => {
          // Get all galleries from db
          getGalleriesOnMount().value;
          gallery.value = localStorage.getItem("gallery") || [];
          getGalleryItems().value
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
              swal("Error", "Get all galleries error!", "error");
            });
        }

        // Get all gallery items depending on which gallery is open
        async function getGalleryItems() {
          const getGalleryByName = localStorage.getItem("gallery") ? JSON.parse(localStorage.getItem("gallery")) : []; 
          // Get current open gallery from local storage
          await axios
            .get("gallery/items/" + getGalleryByName.galleryName)
            .then((response) => {
              galleryItems.value = response.data;
            })
            .catch((error) => {
              console.log(error);
              swal("Error", "Get gallery items error!", "error");
            });
        }

        // Garbage collection
        // onUnmounted(async () => {
        //     localStorage.clear();
        // });
        
        /*
    
          Gallery and Gallery Item Views
    
        */

        const lightboxOptions = {
            keyboard: true,
        };

        //Start lightbox init
        const attachLightbox = (event) => {
            lightbox.value = new Lightbox(event.currentTarget, lightboxOptions);
            lightbox.value.show();
        };

        // Get the gallery item title or fallback to this...
        function galleryItemTitle(galleryItem) {
            if (!galleryItem) {
                const galleryItem = {
                    title: "Image loading...",
                };
                return galleryItem.title;
            }
            return galleryItem.title;
        }

        // Get the gallery item description from the db
        function galleryItemDescription(galleryItem) {
            if (!galleryItem) {
                const galleryItem = {
                    description: "Image loading...",
                };
                return galleryItem.description;
            }
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
              }
              else {
                  swal("Success", "Gallery created!", "success");
                  // Cancel gallery create form
                  closeGalleryForm.value();
                  // Return to view galleries
                  getAllGalleries();
              }
              })
              .catch((error) => {
                console.log("Create Gallery ERROR! => " + fData);
                swal("Error", "Create Gallery Error: " + error, "error");
            });
        }

        // Get newly created gallery and add it to the galleries array
        async function getAllGalleries() {
            await axios
                .get("gallery/all")
                .then((response) => {
                if (response.data.error) {
                    swal("Error", response.data.message, "error");
                }
                else {
                    galleries.value = response.data;
                    //console.log("Get all galleries => " + response.data);
                    // isGalleryView defaults to true on mounted
                    viewGalleries.value();
                }
            })
                .catch((error) => {
                swal("Error", error + " Couldn't get any galleries!", "error");
            });
        }

        // Create new gallery item
        async function createNewGalleryItem() {
            let fData = new FormData();
            let ls = JSON.parse(localStorage.getItem("gallery"));
            //console.log("NGI => " + ls);
            fData.append("galleryId", ls._id);
            fData.append("galleryName", ls.galleryName);
            fData.append("title", newGalleryItem.value.title);
            fData.append("description", newGalleryItem.value.description);
            fData.append("files", files.value.files[0]);
            await axios
                .post("gallery/item/create/" + ls._id, fData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => {
                if (response.data.error) {
                    swal("Error", response.data.message, "error");
                }
                else {
                    swal("Success", "Gallery item created!", "success");
                    // Return to view gallery items
                    openGalleryItemView();
                    // Add new gallery items to galleries
                    nextTick(() => {
                      getGalleryItems();
                    })
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
            viewGalleries.value();
            isGalleryUpdating.value = false;
            closeGalleryItemsView.value();
        }

        // Cancel Gallery Create New
        function cancelGalleryCreateForm() {
            closeGalleryForm.value();
            viewGalleries.value();
        }

        // Cancel Gallery Item Create New
        function cancelGalleryItemCreateForm() {
            closeGalleryItemForm.value();
            viewGalleryItems.value();
            exitGalleries.value();
        }

        // Open gallery view from gallery item view
        function openGalleryView() {
            closeGalleryItemsView.value();
            viewGalleries.value();
            closeGalleryItemForm.value();
            closeGalleryForm.value();
            /*
              Clear the array when going back to gallery view to prevent duplicate gallery items
            */
            localStorage.clear();
            galleryItem.value.length = 0;
            galleryItems.value.length = 0;
        }

        // Open gallery item view from clicking on a gallery
        function openGalleryItemView() {
            // Cancel gallery item create form
            cancelGalleryItemCreateForm();
            // Close gallery view
            exitGalleries.value();
            // Open gallery item view
            viewGalleryItems.value();
        }

        // Create new gallery item open view
        function createNewGalleryItemView() {
            // Close gallery view
            exitGalleries.value();
            // Open gallery item view
            viewGalleryItemForm.value();
        }

        // Return to view galleries
        function returnToViewGalleriesAfterDelete() {
            cancelGalleryCreateForm();
        }

        // Delete entire gallery
        async function deleteGallery(gallery, index) {
          // Remove from galleries array first
          galleries.value.splice(index, 1);
          await axios
              .delete("gallery/delete/" + gallery.galleryName)
              .then((response) => {
              if (response.data.error) {
                  swal("Error", response.data.message, "error");
              }
              else {
                  returnToViewGalleriesAfterDelete();
                  swal("Success", "Gallery Deleted!", "success");
              }
          })
              .catch((error) => {
              swal("Error", "Delete Gallery Error => " + error, "error");
          });
        }

        // Delete gallery item
        async function deleteGalleryItem(galleryItem, index) {
          // Remove from gallery items array first
          galleryItems.value.splice(index, 1);
          await axios
              .delete("gallery/item/delete/" + galleryItem._id)
              .then((response) => {
              if (response.data.error) {
                  swal("Error", response.data.message, "error");
              }
              else {
                  swal("Success", "File Deleted!", "success");
              }
          })
              .catch((error) => {
              swal("Error", "Delete Error => " + error, "error");
          });
        }

        // Edit gallery view
        function editGallery(gallery) {
            closeGalleryForm.value();
            exitGalleries.value();
            isGalleryUpdating.value = true;
            editGalleryView.value = true;
            if (gallery.galleryName) {
              localStorage.setItem("gallery", JSON.stringify(gallery));
            }
            gallery.value = localStorage.getItem("gallery") || [];
        }

        // Update gallery
        async function updateGallery() {
          let ls = JSON.parse(localStorage.getItem("gallery"));
          let fData = new FormData();
          fData.append("galleryOldName", ls.galleryName);
          fData.append("galleryName", editGalleryForm.value.galleryName);
          fData.append("galleryDescription", editGalleryForm.value.galleryDescription);
          fData.append("files", files.value.files[0]);
          await axios
            .put("gallery/update/" + ls.galleryName, fData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
            if (response.data.error) {
              swal("Error", response.data.message, "error");
            }
            else {
              swal("Success", "Gallery updated!", "success");
              // Update gallery in galleries
              galleries.value.forEach((gallery) => {
                  if (gallery.galleryName === response.data.galleryName) {
                      gallery.galleryName = response.data.galleryName;
                      gallery.galleryDescription = response.data.galleryDescription;
                      gallery.galleryCoverArtUrl = response.data.galleryCoverArtUrl;
                  }
              });
              editGalleryView.value = false;
              viewGalleries.value();
            }
            })
            .catch((error) => { swal("Error", error, "error"); });
        }

        // Open gallery to view gallery items
        async function expandGallery(gallery) {
          // console.log("Expand Gallery Just Fired!");
          if (gallery.galleryName !== "" || undefined) { // Then go to create gallery item screen
            // Make api call to get items
            localStorage.setItem("gallery", JSON.stringify(gallery));
                await axios
                    .get("gallery/items/" + gallery.galleryName)
                    .then((response) => {
                    if (!response.data.error) {
                        // Add response to galleryItems array
                        galleryItems.value = response.data || [];
                        // Open gallery view
                        openGalleryItemView();
                    }
                    else if (response.data.message = "Gallery Item Not Found!") {
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
            }
            else {
                openGalleryItemView();
                swal("Error", "Waiting for user to add content!", "error");
            }
        }
        return {
            gallery,
            galleryId,
            galleries,
            galleryItem,
            galleryItems,
            viewGalleries,
            viewGalleryItems,
            viewGalleryForm,
            viewGalleryItemForm,
            exitGalleries,
            newGallery,
            newGalleryItem,
            getAllGalleries,
            createNewGallery,
            createNewGalleryItem,
            createNewGalleryItemView,
            uploadFile,
            editGallery,
            editGalleryForm,
            editGalleryInit,
            editGalleryView,
            deleteGallery,
            deleteGalleryItem,
            updateGallery,
            returnToViewGalleriesAfterDelete,
            //coverArtImg,
            coverArtName,
            coverArtDescription,
            //galleryItemImg,
            galleryItemTitle,
            galleryItemDescription,
            getGalleriesOnMount,
            getGalleryItems,
            getStorage,
            store,
            isLoggedIn,
            isGalleryViewOpen,
            isGalleryItemViewOpen,
            isGalleryUpdating,
            isNewGalleryFormOpen,
            isNewGalleryItemFormOpen,
            openGalleryView,
            openGalleryItemView,
            closeGalleryItemsView,
            closeGalleryItemForm,
            closeGalleryForm,
            cancelGalleryUpdate,
            cancelGalleryCreateForm,
            cancelGalleryItemCreateForm,
            expandGallery,
            lightbox,
            lightboxOptions,
            attachLightbox,
      };
    }
};
</script>

<style lang="scss" scoped>
// Gallery Cover Image
.card-img {
  object-fit: contain;
  height: 255px;
}

.image-card-item {
    max-width: 300px;
    background-color: #FFF;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
    background-position: center;
    overflow: hidden;
    position: relative;
    margin: 10px auto;
    cursor: pointer;
    border-radius: 10px;
    font-size: calc(1vw + 0.5rem);
}

.gallery-card-image {
  object-fit: contain;
  height: 255px;
  width: 255px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.image-card-item img {
    transition: all linear 0.25s;
}

.image-card-item .image-title {
    position: absolute;
    bottom: 30px;
    font-size: 30px;
    color: #FFF;
    text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    font-weight: bold;
    transition: all linear 0.25s;
    background-color: rgba(0, 0, 0, 0.7);
    font-size: calc(0.5vw + 1rem);
}

.image-card-item .image-icons {
    position: absolute;
    bottom: 30px;
    right: 30px;
    color: #FFF;
    transition: all linear 0.25s;
}

.image-card-item .image-icons .fa {
    margin: 5px;
}

.image-card-item:hover img {
    filter: grayscale(100%);
}

.image-card-item:hover .image-title {
    bottom: 80px;
}

.image-card-item:hover .image-username {
    bottom: 60px;
}

.image-card-item:hover .image-icons {
    right: 40px;
}

.gallery-base img {
  transition: 0.5s all ease-in-out;
}

.gallery-base:hover img {
  transform: scale(1.05);
}

</style>
