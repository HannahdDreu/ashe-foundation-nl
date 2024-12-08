// Event listener for form submission
let form = document.getElementById("contact");
form.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    let elements = form.elements;
    let payload = {};
    for (let i = 0; i < elements.length; i++) {
      let item = elements.item(i);
      switch (item.type) {
        case "checkbox":
          payload[item.name] = item.checked;
          break;
        case "submit":
          break;
        default:
          payload[item.name] = item.value;
          break;
      }
    }
    console.log("payload", payload);
  },
  true
);

// Example of scaling logic
var siteWidth = 1280;
var scale = screen.width / siteWidth;
document
  .querySelector('meta[name="viewport"]')
  .setAttribute("content", "width=" + siteWidth + ", initial-scale=" + scale + "");

  
