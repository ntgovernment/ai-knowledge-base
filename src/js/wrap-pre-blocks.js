// Utility to wrap <h2>-<h6> + <pre> in .aikb-pre-block for unified styling
export function wrapPreBlocks(main) {
  main = main || document.getElementById("aikb-main-content") || document.body;
  const headingSelector = "h2, h3, h4, h5, h6";
  const headings = main.querySelectorAll(headingSelector);
  headings.forEach((heading) => {
    const next = heading.nextElementSibling;
    if (
      next &&
      next.tagName === "PRE" &&
      !heading.parentElement.classList.contains("aikb-pre-block")
    ) {
      // Create wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "aikb-pre-block";
      heading.parentNode.insertBefore(wrapper, heading);
      wrapper.appendChild(heading);
      wrapper.appendChild(next);
    }
  });
  // Also style any <pre> not already wrapped
  main.querySelectorAll("pre").forEach((pre) => {
    if (!pre.parentElement.classList.contains("aikb-pre-block")) {
      const wrapper = document.createElement("div");
      wrapper.className = "aikb-pre-block";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
  });
}
