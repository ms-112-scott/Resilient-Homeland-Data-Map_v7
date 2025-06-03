// src/modules/init/setupStoryElements.js
import config from "../../config/config.js";

export function setupStoryElements() {
  const story = document.getElementById("story");
  const features = document.createElement("div");
  features.setAttribute("id", "features");

  const header = document.createElement("div");
  const footer = document.createElement("div");

  // Header
  if (config.title) {
    const titleText = document.createElement("h1");
    titleText.innerText = config.title;
    header.appendChild(titleText);
  }

  if (config.subtitle) {
    const subtitleText = document.createElement("h2");
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
  }

  if (config.byline) {
    const bylineText = document.createElement("p");
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
  }

  if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute("id", "header");
    story.appendChild(header);
  }

  // Chapters
  config.chapters.forEach((record, idx) => {
    const container = document.createElement("div");
    const chapter = document.createElement("div");

    container.setAttribute("id", record.id);
    container.classList.add("step");
    if (idx === 0) container.classList.add("active");

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(record.alignment || "centered");
    if (record.hidden) container.classList.add("hidden");

    features.appendChild(container);
  });

  story.appendChild(features);

  // Footer
  if (config.footer) {
    const footerText = document.createElement("p");
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
  }

  if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute("id", "footer");
    story.appendChild(footer);
  }
}
