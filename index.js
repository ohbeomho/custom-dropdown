class CustomDropdownItem extends HTMLElement {
  value;
  name;
  selected;

  constructor() {
    super();
  }

  connectedCallback() {
    this.value = this.getAttribute("value");
    this.name = this.textContent || "Dropdown Item";
    this.selected = this.hasAttribute("selected");
  }
}

class CustomDropdown extends HTMLElement {
  value;
  open;
  itemList;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.getElementById("custom-dropdown-template");
    const style = document.createElement("style");
    // TODO: Style
    style.textContent = `
.custom-dropdown {
  overflow: hidden;
  user-select: none;
  position: relative;
}

::slotted(div) {
  display: flex;
  flex-direction: column;
  position: absolute;
}
`;
    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));

    const selectItem = (item) => {
      if (!(item instanceof CustomDropdownItem)) return;

      shadow.querySelector(".selected").textContent = item.name;
      this.value = item.value;
    };

    shadow
      .querySelector("slot[name=items]")
      .addEventListener("slotchange", (e) => {
        this.itemList = e.target.assignedNodes()[0];

        for (let child of this.itemList.children) {
          if (child.selected) selectItem(child);
          child.addEventListener("click", () => selectItem(child));
        }
      });
  }

  connectedCallback() {
    this.open = this.hasAttribute("open");
    this.addEventListener("click", () => {
      this.open ? this.removeAttribute("open") : this.setAttribute("open", "");
      this.itemList.style.position = this.open ? "absolute" : "static";
      this.open = !this.open;
    });
  }
}

customElements.define("custom-dropdown", CustomDropdown);
customElements.define("custom-dropdown-item", CustomDropdownItem);
