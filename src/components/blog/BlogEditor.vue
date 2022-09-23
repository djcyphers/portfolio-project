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
      <button @click="processBlogPost">
        Publish
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
import { computed, ref, inject, onMounted } from "vue";
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
  setup() {
    // onMounted
    onMounted(async () => {
      await getCategoriesOnMount();
    });
    // Create a new blog post
    const newBlogPostData = ref({ blogTitle: "", blogContent: "", blogCategory: "" });
    // Categories ref
    const categories = ref([]);
    // Blog Editor
    const editor = useEditor({
      content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
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
   
    // Process blog post data
    function processBlogPost() {
      const blogTitleElement = document.querySelector('h1').innerHTML.toString();
      if (!blogTitleElement) {
        return swal("Error", "Add a blog title!", "error");
      }
      const blogContentElment = document.querySelector('.ProseMirror').children.toString();
      newBlogPostData.value.blogTitle = blogTitleElement;
      newBlogPostData.value.blogContent = blogContentElment;
      console.log("Process Post => " + JSON.stringify(newBlogPostData));
    }

    // Create blog post
    async function createBlogPost() {
      let fData = new FormData();
        fData.append("blogTitle", newBlogPostData.value.blogTitle);
        fData.append("blogCategory", newBlogPostData.value.blogCategory);
        fData.append("blogContent", newBlogPostData.value.blogContent);
        for (let file of files) {
            fData.append('files', file, file.name) // note, no square-brackets
        }
        await axios
            .post("blog/create", fData, {
            })
            .then((response) => {
              if (response.data.error) {
                swal("Error", response.data.message, "error");
              } else {
                swal("Success", response.data.message, "success");
                returnToViewBlogPosts();
                getAllBlogPosts();
              }
            })
            .catch((error) => {
              console.log("Create post error! => " + error);
              swal("Error", error.response.data, "error");
            })
    }

    // Responsive refs
    const files = ref({ files: [] });
    const isLoggedIn = computed(() => store.state.logged);
    // Global store state
    const store = inject("store");
    // Image url and file uploadf for Tiptap
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
      files.value.files = event.target.files[0];
      if (files.value) {
        const rawData = await toBase64(files.value.files);
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
    async function getCategoriesOnMount() {
      await axios
        .get("blog/categories/all")
        .then((response) => {
          categories.value = response.data;
        })
        .catch((error) => {
          console.log(error);
          swal("Error", `Error: ${error}`, "error");
        });
    }
    // Input category in editor menu bar
    function enterInputCategory() {
      category.value = document.querySelector('.category-input-box').innerHTML;
      console.log('Category is inputed: ' + category.value);
    }
    // Select categories from selection from db response
    function selectInputCategory(category) {
      newBlogPostData.value.blogCategory = category;
    }

    return {
      editor,
      useEditor,
      EditorContent,
      Link,
      Highlight,
      Youtube,
      FloatingMenu,
      BubbleMenu,
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
      processBlogPost,
      categories,
      getCategoriesOnMount,
      enterInputCategory,
      selectInputCategory,
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
