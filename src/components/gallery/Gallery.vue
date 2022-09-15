<template>
  <div class="gallery-wrapper">
    <div class="gallery-view container" v-if="isGalleryViewOpen">
      <div class="row g-5">
        <!-- Main Galleries -->
        <template v-if="isGalleryViewOpen">
          <div
            class="
              responsive-box
              col-md-6 col-lg-3
              gallery-base
              bg-transparent
              card
              me-3
            "
            v-for="(gallery, index) in galleries"
            :key="index"
            @click="expandGallery(gallery)"
          >
            <img
              class="card-img img-thumbnail bg-black"
              :src="coverArtImg(gallery)"
              :alt="coverArtName(gallery)"
            />
            <!-- Keeps the text on the bottom of the image card (bootstrap5)-->
            <div class="card-img-overlay d-flex flex-column justify-content-end">
              <div class="gallery-title card-title bg-black mb-0 opacity-75">
                <h3>{{ coverArtName(gallery) }}</h3>
              </div>
              <div class="gallery-description card-text bg-black opacity-75">
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
                  @click="deleteGallery(gallery, index)"
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
      <!-- Close Button -->
      <GalleryCloseButton @click.prevent="openGalleryView"/>
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
              <img :src="galleryItemImg(galleryItem)" class="img-fluid rounded" :alt="galleryItemTitle(galleryItem)" />
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
                  @click="deleteGalleryItem(galleryItem, index)"
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
          />updateGallery
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
      <form enctype="multipart/form-data" @submit.prevent="updateGallery()">
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
      v-if="isNewGalleryItemFormOpen"
    >
      <form
        enctype="multipart/form-data"
        @submit.prevent="createNewGalleryItem()"
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
import { ref, onMounted, computed, inject, onUnmounted } from "vue";
import swal from "sweetalert";
import axios from "axios";
import Lightbox from 'bs5-lightbox';
import GalleryCloseButton from "./GalleryCloseButton";

export default {
    name: "Gallery",
    setup() {
        // Store StateS
        const store = inject("store");
        const isLoggedIn = computed(() => store.state.logged);
        // View Gallery
        // This section needs to be refactored more const viewGalleries = computed(() => store.methods.viewGallery);
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
        // View Gallery Items
        const viewGalleryItems = computed({
          get() {
            return store.methods.viewGalleryItems;
          },
          set() {
            return store.methods.viewGalleryItems;
          },
        });
        // Close Gallery Items View
        const closeGalleryItemsView = computed({
          get() {
            return store.methods.closeGalleryItems;
          },
          set() {
            return store.methods.closeGalleryItems;
          },
        });
        const viewGalleryForm = computed({
          get() {
            return store.methods.newGalleryForm;
          },
          set() {
            return store.methods.newGalleryForm;
          }
        });
        const closeGalleryForm = computed({
          get() {
            return store.methods.closeGalleryForm;
          },
          set() {
            return store.methods.closeGalleryForm;
          }
        });
        const viewGalleryItemForm = computed({
          get() {
            return store.methods.newGalleryItemForm;
            },
          set() {
            return store.methods.newGalleryItemForm;
          }
        });
        const closeGalleryItemForm = computed({
          get() {
            return store.methods.closeGalleryItemForm;
          },
          set() {
            return store.methods.closeGalleryItemForm;
          }
        });
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
       onMounted(async () => {
         // Get all galleries from db
            await getGalleriesOnMount().value;
            gallery.value = localStorage.getItem("gallery") || [];
            await getGalleryItemsOnMount().value
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
        // Get all gallery items depending on which gallery is open
        async function getGalleryItemsOnMount() {
          if (!gallery.value.length > 0) {
            return;
          }
          const getGalleryByName = JSON.parse(localStorage.getItem("gallery")); 
          // Get current open gallery from local storage
          await axios
            .get("gallery/items/" + getGalleryByName.galleryName)
            .then((response) => {
              galleryItems.value = response.data;
            })
            .catch((error) => {
              console.log(error);
              swal("Error", "Get gallery items onMount error!", "error");
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
        // Try and get the cover art image from the assets folder
        function coverArtImg(gallery) {
            const name = gallery.galleryName;
            if (name === undefined)
                return; // Vue state trying to add img buggy
            const formatName = name.replace(/ /g, "-").toLowerCase();
            let img = computed(() => {
                const str = gallery.galleryCoverArtUrl;
                return str.split("\\").pop().split("/").pop();
            });
            if (img) {
            return require(`../../assets/galleries/` + `${formatName}/${img.value}`);
            }
            else {
              return []; // Vue state trying to add img buggy webpack issue
            }
        }
        function galleryItemImg(galleryItem) {
            const name = galleryItem.galleryName;
            if (name === undefined || name === "undefined") { // Strange behavoir of name returning undefined after creating a gallery item 
                return;
            }
            const formatName = name.replace(/ /g, "-").toLowerCase();
            let img = computed(() => {
                const str = galleryItem.galleryItemUrl;
                return str.split("\\").pop().split("/").pop();
            });
            return require(`@/assets/galleries/` + `${formatName}/${img.value}`) || [];
        }
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
        // Initiate new gallery creation
        function createNewGalleryView() {
            exitGalleries.value();
            viewGalleryForm.value();
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
        function returnToViewGalleries() {
            viewGalleries.value();
            closeGalleryForm.value();
            editGalleryView.value = false;
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
            createNewGalleryView,
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
            returnToViewGalleries,
            coverArtImg,
            coverArtName,
            coverArtDescription,
            galleryItemImg,
            galleryItemTitle,
            galleryItemDescription,
            getGalleriesOnMount,
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
    },
    components: { GalleryCloseButton }
};
</script>
