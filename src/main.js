import "./index.scss";
import { gsap } from "gsap";

window.gsap = gsap;

const CONFIG = {
  // Use a relative path because the site is hosted at /envelope/ on GitHub Pages.
  svgAssets: [{ url: "./envelope.svg", container: ".envelope" }],
  animation: {
    defaultEase: "power2.inOut",
  },
};

let flowerStarted = false;

async function loadSVGAssets(assets) {
  try {
    const svgContents = await Promise.all(
      assets.map(async (asset) => {
        const response = await fetch(asset.url);

        if (!response.ok) {
          throw new Error(`Failed to load ${asset.url}: ${response.status}`);
        }

        return response.text();
      })
    );

    svgContents.forEach((content, index) => {
      const container = document.querySelector(assets[index].container);

      if (!container) {
        throw new Error(`Container not found: ${assets[index].container}`);
      }

      container.innerHTML = content;
    });

    initializeAnimation();
  } catch (error) {
    console.error("Failed to load SVG assets:", error);
  }
}

function createAnimationTimeline() {
  const timeline = gsap.timeline({
    defaults: {
      ease: CONFIG.animation.defaultEase,
    },
    onComplete: () => {
      startFlowerAnimation();
    },
  });

  window.tl = timeline;
  return timeline;
}

function setupEnvelopeAnimation(timeline) {
  timeline
    .from("#text > *", {
      autoAlpha: 0,
      stagger: 0.1,
    })

    .from("#arrow", {
      y: "+=10",
      repeat: 2,
      yoyo: true,
      autoAlpha: 0,
    })

    .to("#arrow", {
      autoAlpha: 0,
    })

    .to(
      "#button",
      {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: "center center",
      },
      "<"
    )

    .to(
      "#text > *",
      {
        autoAlpha: 0,
        stagger: 0.1,
      },
      "<"
    )

    .to("#closed", {
      duration: 2,
      transformOrigin: "center top",
      fill: "#f5f5f5",
      scaleY: -1,
      ease: "linear",
    })

    .from(
      "#pattern-top",
      {
        duration: 1.5,
        transformOrigin: "center bottom",
        scaleY: 0,
        ease: "linear",
      },
      "-=1"
    )

    .from(
      "#paper",
      {
        duration: 2,
        scaleY: 0,
        transformOrigin: "center bottom",
      },
      "-=2.5"
    )

    .to("#paper-mask", {
      y: "+=500",
      duration: 2.5,
    })

    .to(
      [
        "#pattern-top",
        "#closed",
        "#shadows-inner",
        "#pattern-bottom",
        "#accents",
        "#body",
        "#bottom-shadow",
      ],
      {
        y: "+=500",
        duration: 2.6,
      },
      "<"
    )

    .from(
      "#paper-mask-full",
      {
        autoAlpha: 0,
        duration: 0.01,
      },
      "-=1"
    )

    .from(
      "#shadows-inner",
      {
        autoAlpha: 0,
        y: "+=2",
      },
      0.1
    );
}

function initializeAnimation() {
  console.log("Initializing envelope animation...");

  const timeline = createAnimationTimeline();
  setupEnvelopeAnimation(timeline);
}

function startFlowerAnimation() {
  if (flowerStarted) return;

  const flowerScene = document.querySelector("#flowerScene");
  if (!flowerScene) return;

  flowerStarted = true;

  flowerScene.classList.remove("not-loaded");
  flowerScene.classList.add("show");

  console.log("Flower animation started.");
}

document.addEventListener("DOMContentLoaded", () => {
  loadSVGAssets(CONFIG.svgAssets);
});
