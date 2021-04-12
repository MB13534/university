import axios from "axios";

class Like {
  constructor() {
    this.handleClick = (e) => {
      const currentLikeBox =
        e.currentTarget.parentNode.querySelector(".like-box");
      if (currentLikeBox.dataset.exists == "yes") {
        this.removeLike(currentLikeBox);
      } else {
        this.addLike(currentLikeBox);
      }
    };

    this.addLike = async (currentLikeBox) => {
      try {
        const response = await axios.post(
          universityData.root_url + "/wp-json/university/v1/manageLike",
          {
            professorId: currentLikeBox.dataset.professor,
          },
          {
            headers: {
              "X-WP-Nonce": universityData.nonce,
            },
          }
        );
        currentLikeBox.dataset.exists = "yes";
        let likeCount = parseInt(
          currentLikeBox.querySelector(".like-count").innerHTML,
          10
        );
        likeCount++;
        currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
        currentLikeBox.dataset.like = response.data;
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    this.removeLike = async (currentLikeBox) => {
      try {
        const response = await axios.delete(
          universityData.root_url + "/wp-json/university/v1/manageLike",
          {
            headers: {
              "X-WP-Nonce": universityData.nonce,
            },
            data: {
              like: currentLikeBox.dataset.like,
            },
          }
        );
        currentLikeBox.dataset.exists = "no";
        let likeCount = parseInt(
          currentLikeBox.querySelector(".like-count").innerHTML,
          10
        );
        likeCount--;
        currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
        currentLikeBox.dataset.like = "";
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (document.querySelector(".like-box")) {
      this.events();
    }
  }

  events() {
    this.likeButton = document.querySelector(".like-box");
    this.likeButton.addEventListener("click", this.handleClick);
  }
}

export default Like;
