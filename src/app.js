/* eslint-disable no-undef */

import { watch } from "melanke-watchjs";
import isURL from "validator/lib/isURL";
import axios from "axios";
import $ from "jquery";
import _ from "lodash";

import parse from "./parser";

export default () => {
  const corsProxy = "https://cors-anywhere.herokuapp.com/";
  const form = document.querySelector(".js-form");
  const input = document.querySelector(".js-input");
  const button = document.querySelector(".js-button");
  const feeds = document.querySelector(".js-feeds");
  const posts = document.querySelector(".js-posts");
  const modal = document.querySelector(".js-modal");

  const state = {
    url: null,
    feeds: [],
    form: "",
    modal: "",
    description: "",
  };

  const updateFeeds = (url, data) => {
    const { title, description, items } = parse(data);
    const isFeedExist = state.feeds.map((item) => item.url).includes(url);

    if (isFeedExist) {
      const currentFeed = state.feeds.find((item) => item.url === url);
      const newItems = _.differenceBy(items, currentFeed.items, "link");

      if (newItems.length > 0) {
        currentFeed.items.push(...newItems);
      }
    } else {
      state.feeds.push({
        url,
        title,
        description,
        items,
      });
      state.url = "";
      state.form = "valid";
    }
  };

  const fetchRSS = (url) => {
    axios
      .get(`${corsProxy}${url}`)
      .then((response) => {
        const { data } = response;

        updateFeeds(url, data);

        setTimeout(() => {
          fetchRSS(url);
        }, 5000);
      })
      .catch((error) => {
        state.form = "invalid";
        console.log(error);
      });
  };

  const addFeed = (title, description) => {
    const feed = document.createElement("li");

    feed.classList.add("list-group-item");
    feed.innerHTML = `<h3>${title}</h3><span>${description}</span>`;
    feeds.append(feed);
  };

  const addPosts = (items) => {
    const links = items
      .map(
        (item) =>
          `<li class="list-group-item d-flex justify-content-between align-items-center"><a href="${item.link}">${item.title}</a><button type="button" class="btn btn-info ml-5" data-toggle="modal" data-target="#descriptionModal" data-description="${item.description}">Description</button></li>`
      )
      .join("");

    posts.innerHTML += links;
  };

  const handleInput = (event) => {
    state.url = event.target.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    state.form = "progress";
    fetchRSS(state.url);
  };

  watch(state, "url", () => {
    const isEmpty = state.url === "";
    const isExist = state.feeds.find(({ url }) => url === state.url);

    if (isEmpty) {
      state.form = "empty";
      return;
    }

    if (isURL(state.url) && !isExist) {
      state.form = "valid";
      return;
    }

    state.form = "invalid";
  });

  watch(state, "form", () => {
    switch (state.form) {
      case "invalid":
        input.classList.add("is-invalid");
        button.disabled = true;
        break;

      case "valid":
        input.classList.remove("is-invalid");
        button.disabled = false;
        break;

      case "progress":
        button.disabled = true;
        break;

      default:
        input.value = "";
        input.classList.remove("is-invalid");
        button.disabled = true;
    }
  });

  watch(state, "feeds", () => {
    feeds.innerHTML = "";
    posts.innerHTML = "";

    state.feeds.map(({ title, description, items }) => {
      addFeed(title, description);
      addPosts(items);

      return null;
    });
  });

  watch(state, "modal", () => {
    if (!state.modal) {
      return;
    }

    const content = modal.querySelector(".modal-text");

    content.textContent = state.description;
  });

  input.addEventListener("input", handleInput);
  form.addEventListener("submit", handleSubmit);

  $("#descriptionModal").on("show.bs.modal", (event) => {
    const descriptionButton = $(event.relatedTarget);
    const description = descriptionButton.data("description");

    state.modal = "active";
    state.description = description;
  });

  $("#descriptionModal").on("hide.bs.modal", () => {
    state.modal = "";
    state.description = "";
  });
};
