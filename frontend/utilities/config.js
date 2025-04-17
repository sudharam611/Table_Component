export const tableConfiguration = {
  columns: [
    // {
    //   label: "Select",
    //   key: "checkbox",
    //   width: "5%",
    //   sortable: false,
    //   custom: () => {
    //     const cell = document.createElement("td");
    //     const checkbox = document.createElement("input");
    //     checkbox.type = "checkbox";
    //     checkbox.className = "row-checkbox";
    //     cell.appendChild(checkbox);
    //     return cell;
    //   },
    // },
    {
      label: "ID",
      key: "id",
      sortable: false,
      defaultValue: "0",
      width: "5%",
    },
    {
      label: "Name",
      key: "name",
      sortable: true,
      defaultValue: "Unknown",
      width: "30%",
    },
    {
      label: "Age",
      key: "age",
      sortable: true,
      defaultValue: "NIL",
      width: "10%",
    },
    {
      label: "Rank",
      key: "rank",
      sortable: true,
      defaultValue: "0",
      width: "10%",
    },
    // {label: "Present", key: "present", sortable: true, defaultValue: "NIL", width: "10%"},
    // {label: "Address", key: "address", trimming: true, width: "10%"},
    {
      label: "Percentage",
      key: "percentage",
      width: "20%",
      custom: (value, td) => {
        td.textContent = value;
      
        td.style.backgroundColor =
          value > 80 ? "#77B254" :
          value > 50 ? "#FFF085" : "#D84040";
      
        td.style.color = "#000";
        td.style.textAlign = "center";
        td.style.fontWeight = "bold";
        // td.style.borderRadius = "4px";
        td.style.padding = "4px 8px";
      }
      
    },
  ],
  defaultSortKey: "id",
  sortOrder: "asc",
};
