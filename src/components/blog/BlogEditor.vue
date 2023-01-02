<template>
  <div class="bubble-menu-wrapper d-flex justify-content-center container">
    <BubbleMenu
      v-if="editor"
      class="bubble-menu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
    >
      <button
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        Bold
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        Italic
      </button>
      <button
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        Strike
      </button>
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        Left
      </button>
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        Center
      </button>
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        @click="editor.chain().focus().setTextAlign('right').run()"
      >
        Right
      </button>
      <button
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquote
      </button>
      <button
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        Codeblock
      </button>
      <button
        :class="{ 'is-active': editor.isActive('highlight') }"
        @click="editor.chain().focus().toggleHighlight().run()"
      >
        Highlight
      </button>
      <button
        :class="{ 'is-active': editor.isActive('highlight', { color: '#74c0fc' }) }"
        @click="editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run()"
      >
        Blue
      </button>
      <button
        :class="{ 'is-active': editor.isActive('link') }"
        @click="setLink"
      >
        WebLink
      </button>
      <button
        :disabled="!editor.isActive('link')"
        @click="editor.chain().focus().unsetLink().run()"
      >
        UnLink
      </button>
    </BubbleMenu>
  </div>
  <div class="floating-menu-wrapper container">
    <FloatingMenu
      v-if="editor"
      class="floating-menu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
    >
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button @click="addImageLink">
        ImgLink
      </button>
      <input
        id="file"
        class="file-upload-handler"
        type="file"
        hidden
        @change="uploadImageFile($event)"
      >
      <button
        class="upload-image-button"
        @click.prevent="uploadImageFileEvent()"
      >
        ImgFile
      </button>
      <button @click="addYoutubeLink">
        YouTube
      </button>
      <button v-if="!store.state.isBlogEditingPost" @click="processBlogPost();">
        Publish
      </button>
      <button v-if="store.state.isBlogEditingPost" @click="processBlogPost();store.state.isBlogEditingPost = false">
        Update
      </button>
      <div class="input-group">
        <!-- Add category manually -->
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"  type="button" aria-expanded="false">Categories</button>
        <!-- Select categories from db -->
        <ul class="dropdown-menu">
          <template v-for="(category, index) in categories" :key="index">
            <button class="dropdown-item" type="button" tabindex="0" @click.prevent="selectInputCategory(category)"> {{ category }} </button>
          </template>
        </ul>
        <input @keyup.enter="enterInputCategory" type="text" class="form-control category-input-box" tabindex="0" aria-label="Enter category input box">
      </div>
    </FloatingMenu>
  </div>
  <EditorContent
    class="blog-editor"
    :editor="editor"
  />
</template>

<script>
import { computed, ref, inject, onMounted, reactive, watch } from "vue";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/vue-3";
import axios from "axios";
import swal from "sweetalert";
// Tiptap Extensions
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
// load all highlight.js languages
import { lowlight } from "lowlight";
import any from "bluebird/js/release/any"; // I don't like this
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
export default {
  name: "BlogEditor",
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
  },
  props: {
    blogPostData: {
     type: Object,
     required: false,
    },
  },
  setup(props) {

    // Setup reactive store
    const store = inject("store");

    // onMounted
    onMounted(async () => {
      await getAllCategories();
    });

    const blogPostDataArray = ref(props.blogPostData);
    // Create a new blog post
    const newBlogPostData = ref({ blogTitle: "", blogContent: "", blogCategory: "" });
    // Toggle Blog Editor
    const toggleBlogEditor = computed(() => store.methods.toggleBlogEditor);
    // Blog Posts Store
    const blogPosts = reactive([]);
    // Categories
    const categories = reactive([]);
    // Category input ref
    const categoryInput = ref('');
    // Blog Editor
    const editor = useEditor({
      content: getEditorContent(),
      extensions: [
        StarterKit.configure({
          blockquote: {
            HTMLAttributes: {
              class: "blockquote",
            },
            codeBlock: false,
          },
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
          HTMLAttributes: {
            class: "blog-image img-fluid rounded mx-auto d-block",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
        }),
        BubbleMenu,
        FloatingMenu,
        Youtube.configure({
          nocookie: true,
          HTMLAttributes: {
            class: "youtube-video-container",
          },
        }),
        Highlight.configure({ 
          multicolor: true,
          HTMLAttributes: {
          class: 'highlighter',
          },
        }),
        Link.configure({
          protocols: ['ftp', 'mailto', 'https', 'http', 'tel'],
        }),
      ],
    });

    /* Blog API
    *
    * Manage blog data
    *
    */
    // Responsive refs
    const files = reactive({ files: [] });
    const isLoggedIn = computed(() => store.state.logged);
    const isBlogEditorOpen = computed(() => store.state.isBlogEditorOpen);
    // Form data reactive
    const fData = reactive( new FormData() );

   
    // onMounted
    onMounted(() => {
      getAllBlogPosts();
    });

    watch(blogPostDataArray, (newValue, oldValue) => {
        if (newValue === '') {
         blogPostDataArray.value = oldValue;
          console.log("WATCHING BLOG DATA => " + newValue);
        }
    })

    // ChatGPT helped. It was painful, but we did it!
    function getEditorContent() {
      let data = JSON.stringify(props.blogPostData);
      if (data.length > 2) {
        const pJSON = JSON.parse(data);
        let blogContent = pJSON.blogContent;
        // Parse the blogContent string into a JavaScript object
        blogContent = JSON.parse(blogContent);
        // Combine the elements of the object into a single string
        let htmlString = blogContent.join('');
        // Replace the escaped HTML strings with actual HTML tags
        htmlString = htmlString.replace(/\\"/g, '"');
        // Get the list of image URLs
        const imageUrls = pJSON.blogImagesUrls;
        // Get the blog title
        const blogTitle = pJSON.blogTitle.toLowerCase().replace(/ /g, '-');
        // Replace the <img> tags with the actual image data
        for (let i = 0; i < imageUrls.length; i++) {
          const regex = new RegExp(`<img class="blog-image img-fluid rounded mx-auto d-block" draggable="true" contenteditable="false">`, '');
          // Split the URL to get the file name
          const fileName = imageUrls[i].split('/').pop();
          const filePathParts = fileName.split('\\');
          // Import the image file using the `require` function
          const requiredImage = require(`@/assets/blog/${blogTitle}/${filePathParts[filePathParts.length - 1]}`);
          // Construct the required image URL
          const requiredImageUrl = requiredImage;
          htmlString = htmlString.replace(regex, `<img src="${requiredImageUrl}" class="blog-image img-fluid rounded mx-auto d-block" draggable="true" contenteditable="false">`);
        }
        console.log("EDITOR DATA => " + htmlString);
        return htmlString;
      } else {
        return `<p> Add your new blog post here! ✌🏻😎</p>
          <p>Make sure to add a H1 tag for Title to register!</p>`
      }
    }

    // Process blog post data
    function processBlogPost() {
      // Get blog title from first h1
      const blogTitleElement = document.querySelector('h1').innerHTML;
      if (blogTitleElement == undefined) {
        return swal("Error", "Add a blog title with a H1 tag!", "error");
      }
      newBlogPostData.value.blogTitle = blogTitleElement;
      // Get all elements inside Prose Mirror div
      const nl = document.querySelector('.ProseMirror').childNodes;
      if (nl) {
        // Get image src's from nodeList and convert to div class img element
        toArray(nl);
        if (!store.state.isBlogEditingPost) {
          createBlogPost(); // Use converted data and send to backend
        }
        else {
          updateBlogPost();
        }
        //console.log("ARRAY: " + arr);
        //console.table(imgArray);
      }
    }

    // Update blog post data
    async function updateBlogPost() {
        
        fData.append("blogTitle", newBlogPostData.value.blogTitle);
        fData.append("blogCategory", newBlogPostData.value.blogCategory);
        fData.append("blogContent", JSON.stringify(newBlogPostData.value.blogContent));
        // This honesly was difficult to figure out. I hate you FormData!
        for (let i = 0; i < files.files.length; i++) {
          fData.append('files', files.files[i])
        }
        await axios
            .put("blog/update/" + props.blogPostData._id, fData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              if (response.data.error) {
                swal("Error", response.data.message, "error");
              } else {
                swal("Success", response.data.message, "success");
                toggleBlogEditor.value();
              }
            })
            .catch((error) => {
              swal("Error", "Update Post Error: " + error, "error");
            })
    }

    // Create blog post
    async function createBlogPost() {
        fData.append("blogTitle", newBlogPostData.value.blogTitle);
        fData.append("blogCategory", newBlogPostData.value.blogCategory);
        fData.append("blogContent", JSON.stringify(newBlogPostData.value.blogContent));
        console.log("CREATE FUCKING POST: " + JSON.stringify(newBlogPostData.value.blogContent));
        // This honesly was difficult to figure out. I hate you FormData!
        for (let i = 0; i < files.files.length; i++) {
          fData.append('files', files.files[i])
        }
        await axios
            .post("blog/create", fData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              if (response.data.error) {
                swal("Error", response.data.message, "error");
              } else {
                swal("Success", response.data.message, "success");
                toggleBlogEditor.value();
              }
            })
            .catch((error) => {
              swal("Error", "Create Post Error: " + error, "error");
            })
    }

    // Get all blog posts on mount (after loading a new image or refresh)
    async function getAllBlogPosts() {
      await axios
        .get("blog/posts/all")
        .then((response) => {
          if (response.data.error) {
            swal("Error", response.data.message, "error");
          } else {
            // Put all posts into reactive array
            blogPosts.push(response.data);
          }
        })
        .catch((error) => {
          swal("Error", error, "error");
        });
    }

    // Image url and file upload for Tiptap
    const addImageLink = computed(() => {
      const url = window.prompt("URL");
      if (url) {
        return editor.value.chain().focus().setImage({ src: url }).run();
      } else { return swal("Error", "Please enter a valid URL.", "error")}
    });
    // Upload image file handler
    function uploadImageFileEvent() {
      document.querySelector(".file-upload-handler").click();
    }
    // Upload image file to ref store
    async function uploadImageFile(event) {
      if (!event.target.files.length) {
        swal("Error", `Upload Image Error! => ${error}`, "error");
        return;
      }
      files.files.push(event.target.files[0]);
      if (files.files) {
        const rawData = await toBase64(event.target.files[0]);
        editor.value.chain().focus().setImage({ src: rawData }).run();
      } else {
        swal("Error", `Upload Error! => ${error}`, "error");
      }
    }
    // Convert image to base64
    // https://stackoverflow.com/questions/62343417/how-to-properly-upload-files-as-base64-in-javascript
    const toBase64 = (files) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    // Add Youtube video link to editor
    const addYoutubeLink = computed(() => {
      const url = prompt("Enter YouTube URL");
      if (editor) {
        const editorCommands = 
        editor.value.commands.setYoutubeVideo({
          src: url,
          width: 960,
          height: 540,
        })
        return editorCommands;
      }
      else { return swal("Error", "Please enter a valid YouTube URL.", "error") }
    });

    function setLink() {
      // Set web link onclick
      const previousUrl = editor.value.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
      // cancelled
      if (url === null) {
        console.log("URL is null!");
        return
      }
      // empty
      if (url === '') {
        editor
          .value
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()
        return
      }
      // update link
      editor
      .value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }

    // Get all categories onMount
    async function getAllCategories() {
      await axios
        .get("blog/categories/all")
        .then((response) => {
          categories.push(response.data);
        })
        .catch((error) => {
          console.log(error);
          swal("Error", `Error: ${error}`, "error");
        });
    }
    // Input category in editor menu bar
    function enterInputCategory() {
      categoryInput.value = document.querySelector('.category-input-box').value;
      newBlogPostData.value.blogCategory = categoryInput.value;
      console.log('Category is inputed: ' + categoryInput.value);
    }
    // Select categories from selection from db response
    function selectInputCategory(category) {
      newBlogPostData.value.blogCategory = category;
    }

    // Convert nodeList to Array
    function toArray(obj) { // nodeList object
      const array = [];
      // iterate backwards ensuring that length is an UInt32
      for (var i = obj.length >>> 0; i--;) { 
        array[i] = obj[i];
      }
      // Push the src image to be saved later in db via axios / formidable
      const tmpArray = []; 
      array.forEach(function(chunk) {
        if (chunk.firstChild.src != undefined) {
          //console.log('ImgSrc: ' + chunk.firstChild.src);
          //fileArray.push(chunk.firstChild.src);
          chunk.firstChild.removeAttribute("src");
        }
        tmpArray.push(chunk.outerHTML);
      })
      //files.value.files = fileArray;
      //console.log('Array: ' + tmpArray)
      return newBlogPostData.value.blogContent = tmpArray;
    }

    return {
      editor,
      useEditor,
      getEditorContent,
      blogPostDataArray,
      Link,
      Highlight,
      Youtube,
      StarterKit,
      CodeBlockLowlight,
      lowlight,
      Image,
      TextAlign,
      addImageLink,
      addYoutubeLink,
      files,
      store,
      isLoggedIn,
      uploadImageFile,
      uploadImageFileEvent,
      toBase64,
      setLink,
      createBlogPost,
      newBlogPostData,
      toggleBlogEditor,
      isBlogEditorOpen,
      processBlogPost,
      updateBlogPost,
      categories,
      categoryInput,
      getAllCategories,
      getAllBlogPosts,
      enterInputCategory,
      selectInputCategory,
      toArray,
      fData,
      blogPosts,
    };
  },
};
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
  min-height: 256px;
  ul,
  ol {
    padding: 0 1rem;
  }
  iframe {
    border: 1px solid rgb(255, 255, 255);
    border-radius: 4px;
    min-width: 200px;
    min-height: 200px;
    display: block;
    outline: 0px solid transparent;
  }

  div[data-youtube-video=""] {
    cursor: move;
    padding-right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ProseMirror-selectednode iframe {
    transition: outline 0.15s;
    outline: 1px solid #cac6ff;
  }
}
.bubble-menu {
  display: flex;
  align-items: center;
  background-color: #0d0d0d;
  border: 1px solid;
  border-radius: 0.5rem;
  border-color: #fff;
  width: fit-content;

  button {
    border: none;
    background: none;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

.floating-menu {
  display: flex;
  background-color: #0d0d0d10;
  padding: 0.2rem;
  border: 1px solid;
  border-radius: 0.5rem;
  border-color: #fff;

  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;
    color: #fff;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
</style>
