import axios from "axios";

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    this.addSearchHTML();
    this.openButton = document.getElementsByClassName("js-search-trigger");
    this.closeButton = document.getElementsByClassName("search-overlay__close");
    this.searchOverlay = document.getElementsByClassName("search-overlay");
    this.inputElement = document.getElementById("search-term");
    this.resultsDiv = document.getElementById("search-overlay__results");
    this.isOpen = false;
    this.isLoading = false;
    this.typingTimer;
    this.previousValue;

    // 2. methods
    this.openOverlay = (e) => {
      this.searchOverlay[0].classList.add("search-overlay--active");
      this.isOpen = true;
      setTimeout(() => this.inputElement.focus(), 301);
      document.querySelector("body").classList.add("body-no-scroll");
      e.preventDefault();
      e.stopPropagation();
    };

    this.closeOverlay = () => {
      this.searchOverlay[0].classList.remove("search-overlay--active");
      this.isOpen = false;
      this.inputElement.value = "";
      document.querySelector("body").classList.remove("body-no-scroll");
    };

    this.handleKeyPress = (e) => {
      const keyName = e.key;

      if (keyName === "Escape" && this.isOpen) {
        this.closeOverlay();
      }
      if (
        keyName === "s" &&
        !this.isOpen &&
        ![...document.querySelectorAll("input, textarea")].some(
          (item) => item === document.activeElement
        )
      ) {
        this.openOverlay();
      }
    };

    this.handleTyping = (e) => {
      if (this.inputElement.value != this.previousValue) {
        clearTimeout(this.typingTimer);
        if (this.inputElement.value) {
          if (!this.isLoading) {
            this.resultsDiv.innerHTML = `<div class="spinner-loader"></div>`;
            this.isLoading = true;
          }
          this.typingTimer = setTimeout(() => this.getResults(e), 750);
        } else {
          this.resultsDiv.innerHTML = "";
          this.isLoading = false;
        }
      }
      this.previousValue = this.inputElement.value;
    };

    this.getResults = async (e) => {
      try {
        const { data: results } = await axios.get(
          `${universityData.root_url}/wp-json/university/v1/search?term=${this.inputElement.value}`
        );
        console.log(results);

        this.resultsDiv.innerHTML = `
        <div class="row">
           <div class="one-third">
              <h2 class="search-overlay__section-title">General Information</h2>
                  <ul class="link-list min-list">
                  ${
                    !results.generalInfo.length
                      ? `<p>No general information matches that search.</p>`
                      : `${results.generalInfo
                          .map(
                            (result) =>
                              `<li><a href="${result.permalink}">${
                                result.title
                              }</a> ${
                                result.postType === "post"
                                  ? `by ${result.author}`
                                  : ""
                              }</li>`
                          )
                          .join("")}`
                  }
                  </ul>
           </div>
           <div class="one-third">
              <h2 class="search-overlay__section-title">Programs</h2>
                  <ul class="link-list min-list">
                  ${
                    !results.programs.length
                      ? `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs.</a></p>`
                      : `${results.programs
                          .map(
                            (result) =>
                              `<li><a href="${result.permalink}">${result.title}</a></li>`
                          )
                          .join("")}`
                  }
                  </ul>
              <h2 class="search-overlay__section-title">Professors</h2>
                  <ul class="professor-cards">
                  ${
                    !results.professors.length
                      ? `<p>No professors match that search.</p>`
                      : `${results.professors
                          .map(
                            (result) =>
                              `
                              <li class="professor-card__list-item">
                                <a class="professor-card" href="${result.permalink}">
                                  <img class="professor-card__image" src="${result.imageLandscape}">
                                  <span class="professor-card__name">${result.title}</span>
                                </a>
                              </li>
                              `
                          )
                          .join("")}`
                  }
                  </ul>
           </div>
           <div class="one-third">
              <h2 class="search-overlay__section-title">Campuses</h2>
                  <ul class="link-list min-list">
                  ${
                    !results.campuses.length
                      ? `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses.</a></p>`
                      : `${results.campuses
                          .map(
                            (result) =>
                              `<li><a href="${result.permalink}">${result.title}</a></li>`
                          )
                          .join("")}`
                  }
                  </ul>
              <h2 class="search-overlay__section-title">Events</h2>
                  ${
                    !results.events.length
                      ? `<p>No events match that search. <a href="${universityData.root_url}/events">View all events.</a></p>`
                      : `${results.events
                          .map(
                            (result) =>
                              `
                              <div class="event-summary">
                                <a class="event-summary__date t-center" href="${result.permalink}">
                                  <span class="event-summary__month">${result.month}</span>
                                  <span class="event-summary__day">${result.day}</span>
                                </a>
                                <div class="event-summary__content">
                                  <h5 class="event-summary__title headline headline--tiny"><a href="${result.permalink}">${result.title}</a></h5>
                                  <p>
                                  ${result.excerpt}

                                  <a href="${result.permalink}" class="nu gray">Learn more</a></p>
                                </div>
                              </div>
                              `
                          )
                          .join("")}`
                  }
           </div>
        </div>
      `;
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.resultsDiv.innerHTML = `<h2 class="search-overlay__section-title">Unexpected Error</h2>`;
      }
    };

    this.events();
  }

  addSearchHTML() {
    const searchElement = document.createElement("div");
    searchElement.classList.add("search-overlay");
    searchElement.innerHTML = `
<div class="search-overlay__top">
  <div class="container">
    <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
    <input type="text" class='search-term' placeholder="What are you looking for?" id="search-term" autocomplete="off">
    <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
  </div>
</div>
<div class="container">
  <div id="search-overlay__results">
    
  </div>
</div>
    `;
    document.body.appendChild(searchElement);
  }

  // 3. events
  events() {
    this.openButton[1].addEventListener("click", this.openOverlay);
    this.closeButton[0].addEventListener("click", this.closeOverlay);
    document.addEventListener("keydown", this.handleKeyPress);
    this.inputElement.addEventListener("keyup", this.handleTyping);
  }
}

export default Search;

//START
