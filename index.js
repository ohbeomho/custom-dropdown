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
  open = false;
  itemList;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.getElementById("custom-dropdown-template");
    const style = document.createElement("style");
    style.textContent = `
.custom-dropdown {
  display: inline-block;
  overflow: hidden;
  user-select: none;
  position: relative;
}

::slotted(div),
.selected {
  border: 2px solid lightgray;
}

::slotted(div) {
  display: flex;
  flex-direction: column;
  position: absolute;
  border-top: none;
}

.arrow {
  display: inline-block;
  font-weight: bold;
  rotate: 90deg;
}

.selected {
  position: relative;
  padding: 0.5rem;
  z-index: 1;
}
`;
    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));

    const selectItem = (item) => {
      if (!(item instanceof CustomDropdownItem)) return;

      shadow.querySelector(".selected > span:not(.arrow)").textContent =
        item.name;
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
    this.addEventListener("click", () => {
      this.open = !this.open;
      this.open ? this.setAttribute("open", "") : this.removeAttribute("open");
      this.itemList.style.position = this.open ? "static" : "absolute";
    });
  }
}

customElements.define("custom-dropdown", CustomDropdown);
customElements.define("custom-dropdown-item", CustomDropdownItem);
