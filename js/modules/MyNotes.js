import axios from "axios";

class MyNotes {
  constructor() {
    this.deleteButtons = document.querySelectorAll(".delete-note");
    this.editButtons = document.querySelectorAll(".edit-note");
    this.saveButtons = document.querySelectorAll(".update-note");
    this.createButton = document.querySelector(".submit-note");

    this.handleDelete = async (e) => {
      var thisNote = e.currentTarget.parentNode;
      try {
        const response = await axios.delete(
          universityData.root_url +
            "/wp-json/wp/v2/note/" +
            thisNote.dataset.id,
          {
            headers: { "X-WP-Nonce": universityData.nonce },
          }
        );
        thisNote.classList.add("fade-out");
        if (response.data.userNoteCount < 5) {
          document
            .querySelector(".note-limit-message")
            .classList.remove("active");
        }
      } catch (error) {
        console.error(error);
        console.log("there was an error");
      }
    };

    this.handleSave = async (e) => {
      var thisNote = e.currentTarget.parentNode;

      var ourUpdatedPost = {
        title: thisNote.querySelector(".note-title-field").value,
        content: thisNote.querySelector(".note-body-field").value,
      };

      try {
        const response = await axios.post(
          universityData.root_url +
            "/wp-json/wp/v2/note/" +
            thisNote.dataset.id,
          ourUpdatedPost,
          {
            headers: {
              "X-WP-Nonce": universityData.nonce,
            },
          }
        );
        console.log(response);
        this.makeNoteReadOnly(thisNote);
      } catch (error) {
        console.error(error);
        console.log("there was an error");
      }
    };

    this.handleEdit = async (e) => {
      var thisNote = e.currentTarget.parentNode;
      if (thisNote.dataset.status == "editable") {
        this.makeNoteReadOnly(thisNote);
      } else {
        this.makeNoteEditable(thisNote);
      }
    };

    this.handleCreate = async (e) => {
      var ourNewPost = {
        title: document.querySelector(".new-note-title").value,
        content: document.querySelector(".new-note-body").value,
        status: "publish",
      };

      try {
        const response = await axios.post(
          universityData.root_url + "/wp-json/wp/v2/note/",
          ourNewPost,
          {
            headers: {
              "X-WP-Nonce": universityData.nonce,
            },
          }
        );
        console.log(response);

        if (
          response.request.responseText == "You have reached your note limit"
        ) {
          document.querySelector(".note-limit-message").classList.add("active");
        }
        const newNote = document.createElement("li");
        newNote.dataset.id = response.data.id;
        newNote.innerHTML = `
          <input readonly class="note-title-field" type="text" value="${response.data.title.raw}">
          <span class="edit-note"><i class="fa fa-pencil" area-hidden="true"></i> Edit</span>
          <span class="delete-note"><i class="fa fa-trash-o" area-hidden="true"></i> Delete</span>

          <textarea readonly class='note-body-field'>${response.data.content.raw}</textarea>

          <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" area-hidden="true"></i> Save</span>
        `;

        newNote
          .querySelector(".edit-note")
          .addEventListener("click", this.handleEdit);
        newNote
          .querySelector(".delete-note")
          .addEventListener("click", this.handleDelete);
        newNote
          .querySelector(".update-note")
          .addEventListener("click", this.handleSave);

        document.querySelector("#my-notes").prepend(newNote);

        document.querySelector(".new-note-title").value = "";
        document.querySelector(".new-note-body").value = "";
      } catch (error) {
        console.error(error);
        console.log("there was an error");
      }
    };

    this.makeNoteEditable = (thisNote) => {
      let elements = thisNote.querySelectorAll(
        ".note-title-field, .note-body-field"
      );

      elements.forEach((element) => {
        element.removeAttribute("readonly");
        element.classList.add("note-active-field");
      });

      thisNote.querySelector(
        ".edit-note"
      ).innerHTML = `<i class="fa fa-times" area-hidden="true"></i> Cancel`;

      thisNote
        .querySelector(".update-note")
        .classList.add("update-note--visible");

      thisNote.dataset.status = "editable";
    };

    this.makeNoteReadOnly = (thisNote) => {
      let elements = thisNote.querySelectorAll(
        ".note-title-field, .note-body-field"
      );

      elements.forEach((element) => {
        element.setAttribute("readonly", "readonly");
        element.classList.remove("note-active-field");
      });

      thisNote.querySelector(
        ".edit-note"
      ).innerHTML = `<i class="fa fa-pencil" area-hidden="true"></i> Edit`;

      thisNote
        .querySelector(".update-note")
        .classList.remove("update-note--visible");

      thisNote.dataset.status = "false";
    };

    this.events();
  }

  events() {
    this.deleteButtons.forEach((button) => {
      button.addEventListener("click", this.handleDelete);
    });
    this.editButtons.forEach((button) => {
      button.addEventListener("click", this.handleEdit);
    });
    this.saveButtons.forEach((button) => {
      button.addEventListener("click", this.handleSave);
    });
    this.createButton.addEventListener("click", this.handleCreate);
  }
}

export default MyNotes;
