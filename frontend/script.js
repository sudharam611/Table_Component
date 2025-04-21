export class TableComponent {
  constructor(fetchDataCallBack, tableContainer, options = {}) {
    this.fetchDataCallBack = fetchDataCallBack;
    this.container = document.getElementById(tableContainer);
    this.data = [];
    this.filteredData = [];
    // this.currentIndex = 0;
    // this.dataSize = 40;
    // this.isLoading = false;
    this.sortKey = options.defaultSortKey || "";
    this.sortAsc = options.sortOrder !== "desc";
    this.columns = options.columns || [];
    this.bufferRows = 100;
    this.rowPool = [];
    this.rowHeight = 0;
    this.initial();
  }
  async initial() {
    // const spinner = document.getElementById("loading-spinner");
    // spinner.style.display = "block";
    try {
      this.data = await this.fetchDataCallBack();
      this.filteredData = [...this.data];
      this.createFilterUI();
      this.table = document.createElement("table");
      this.table.classList.add("reusable-table");
      this.thead = document.createElement("thead");
      this.tbody = document.createElement("tbody");
      this.table.appendChild(this.thead);
      this.table.appendChild(this.tbody);
      this.container.innerHTML = "";
      this.container.appendChild(this.table);
      this.renderTableHeaders();
      this.measureRowAndHeight();
      this.addSortListener();
      this.addScrollListeners();
      document
        .getElementById("reset-button")
        .addEventListener("click", () => this.reset());
      if (this.sortKey) this.sortData();
    } catch (error) {
      alert("Failed to fetch data. Please check the URL");
      console.log(error);
    } finally {
      // spinner.style.display = "none";
    }
  }

  measureRowAndHeight() {
    const tempRow = document.createElement("tr");
    this.columns.forEach(() => {
      const td = document.createElement("td");
      td.textContent = "Dummy";
      tempRow.appendChild(td);
    });
    this.tbody.appendChild(tempRow);
    this.rowHeight = tempRow.getBoundingClientRect().height;
    //console.log(this.rowHeight);
    this.tbody.removeChild(tempRow);
    const containerHeight = this.container.clientHeight;
   // console.log(containerHeight)
    const visibleRows = Math.ceil(containerHeight / this.rowHeight);
    //console.log(visibleRows);
    const buffer = 5;
    this.bufferRows = visibleRows + buffer;
    //console.log(this.bufferRows)
    for (let i = 0; i < this.bufferRows; i++) {
      const tr = document.createElement("tr");
      this.columns.forEach(() => {
        const td = document.createElement("td");
        tr.appendChild(td);
      });
      this.tbody.appendChild(tr);
      this.rowPool.push(tr);
      //console.log('row pool', this.rowPool)
    }
    this.tbody.style.position = "relative";

    //console.log(this.rowPool);
    this.updateRows();
  }

  updateRows() {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;
    // const totalRows = this.filteredData.length;
    // const firstVisibleIndex = Math.floor(scrollTop / this.rowHeight);
    const visibleRowCount = Math.ceil(viewportHeight / this.rowHeight) + 10;
    //const start = Math.max(0, firstVisibleIndex);
    //const end = Math.min(totalRows, start + visibleRowCount);
    const start = Math.max(0, Math.floor(scrollTop / this.rowHeight) - 2)
    const end = Math.min(this.filteredData.length, start + visibleRowCount + 4);
  
    for (let i = 0; i < this.rowPool.length; i++) {
      const dataIndex = start + i;
      const tr = this.rowPool[i];
      if (dataIndex < end) {
        const rowData = this.filteredData[dataIndex];
        const tds = tr.children;
        this.columns.forEach((col, colIndex) => {
          const cellData = rowData[col.key] ?? col.defaultValue ?? "N/A";
          const td = tds[colIndex];
          if (col.width) {
            td.style.width = col.width;
          }
          if (col.custom) {
            col.custom(cellData, td);
          } else {
            td.textContent =
              typeof cellData === "boolean"
                ? cellData
                  ? "YES"
                  : "NO"
                : cellData;
          }
          td.setAttribute("data-label", col.label);
        });
        tr.style.top = `${dataIndex * this.rowHeight}px`;
         tr.style.display = "";
      }
      else {
        tr.style.display = "none";
      }
    }
  }

  renderTableHeaders() {
    const tr = document.createElement("tr");
    this.columns.forEach((col) => {
      const th = document.createElement("th");
      // th.classList.add("sortable");
      th.setAttribute("data-key", col.key);
      th.textContent = col.label;
      if (col.width) {
        th.style.width = col.width;
      }
      if (col.sortable !== false) {
        th.classList.add("sortable");
        const sortArrow = document.createElement("span");
        sortArrow.classList.add("sort-arrow");
        sortArrow.setAttribute("data-key", col.key);
        sortArrow.style.cursor = "pointer";
        const img = document.createElement("img");
        img.src = "images/sort-icon.png";
        img.width = 20;
        img.height = 20;
        sortArrow.appendChild(img);
        th.appendChild(sortArrow);
      }
      tr.appendChild(th);
    });
    this.thead.innerHTML = "";
    this.thead.appendChild(tr);
  }

  createFilterUI() {
    const filterSection = document.createElement("div");
    filterSection.classList.add("search-section");
    const input = document.createElement("input");
    input.type = "text";
    input.id = "filter-input";
    input.placeholder = "Enter data to search";

    const button = document.createElement("button");
    button.id = "reset-button";
    button.textContent = "Reset";

    filterSection.appendChild(input);
    filterSection.appendChild(button);
    this.container.parentElement.insertBefore(filterSection, this.container);
    button.addEventListener("click", () => this.reset());
    this.addFilterListener();
  }

  addSortListener() {
    const headers = this.table.querySelectorAll("th");
    headers.forEach((th) => {
      const key = th.getAttribute("data-key");
      const columnConfig = this.columns.find((col) => col.key === key);
      if (columnConfig?.sortable !== false) {
        th.addEventListener("click", () => this.sortColumn(key));
      }
    });
  }

  sortColumn(key) {
    const columnConfig = this.columns.find((col) => col.key === key);
    if (columnConfig?.sortable === false) return;
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;
    this.updateSortArrow();
    this.sortData();
    this.updateRows();
  }

  sortData() {
    const key = this.sortKey;
    this.filteredData.sort((a, b) => {
      const value1 = a[key];
      const value2 = b[key];

      if (!isNaN(value1) && !isNaN(value2)) {
        return this.sortAsc ? value1 - value2 : value2 - value1;
      } else {
        return this.sortAsc
          ? String(value1).localeCompare(value2)
          : String(value2).localeCompare(value1);
      }
    });
  }

  updateSortArrow() {
    const arrows = document.querySelectorAll(".sort-arrow img");
    arrows.forEach((img) => {
      const key = img.parentElement.getAttribute("data-key");
      if (key === this.sortKey) {
        img.src = this.sortAsc ? "images/sort-up.png" : "images/sort-down.png";
        img.width = 15;
        img.height = 15;
      } else {
        img.src = "images/sort-icon.png";
        img.width = 15;
        img.height = 15;
      }
    });
  }


  addFilterListener() {
    const input = document.getElementById("filter-input");
    const noDataMessage = document.createElement("div");
    noDataMessage.classList.add("no-data-div");
    noDataMessage.textContent = "No results found for your search";
  
    let isMessageDisplayed = false;
    input.addEventListener(
      "input",
      this.debounce((e) => {
        const enteredInput = e.target.value.trim().toLowerCase(); 
        console.log(enteredInput);
        if (enteredInput === "") {
          this.filteredData = [...this.data];
        } else {
          this.filteredData = this.data.filter((row) =>
            Object.values(row).some((value) =>
              String(value).toLowerCase().includes(enteredInput)
            )
          );
          if (this.filteredData.length === 0) {
            if (!isMessageDisplayed) {
              if (!this.container.contains(noDataMessage)) {
                this.container.appendChild(noDataMessage);
                isMessageDisplayed = true;
              }
            }
          } else {
            if (isMessageDisplayed) {
              this.container.removeChild(noDataMessage);
              isMessageDisplayed = false;
            }
          }
        }
        this.updateRows();
      }, 300)
    );
  }
  
  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  reset() {
    // window.scrollTo(0,0)
    document.getElementById("filter-input").value = "";
    this.filteredData = [...this.data];
    this.container.scrollTop = 0;
    this.sortKey = "";
    this.sortAsc = true;
    this.updateSortArrow();

    const existingMessage = this.container.querySelector(".no-data-div");
    if (existingMessage) {
      this.container.removeChild(existingMessage);
    }
    this.rowPool.forEach((tr) => {
      tr.style.display = "";
    });
    this.updateRows();
  }

 
  // addScrollListeners() {
  //   this.container.addEventListener(
  //     "scroll",
  //     this.throttle(() => this.updateRows(), 50)
  //   );
  // }

  addScrollListeners() {
    let isUpdating = false;
    this.container.addEventListener("scroll", () => {
      if (!isUpdating) {
        requestAnimationFrame(() => {
          this.updateRows();  
          isUpdating = false; 
        });
        isUpdating = true; 
      }
    });
  }
  
 
  throttle(fn, limit) {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= limit) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  }
}
