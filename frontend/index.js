import { TableComponent } from "./script.js";
import { fetchData } from "./utilities/fetchData.js";
import { tableConfiguration } from "./utilities/config.js";

new TableComponent( () => fetchData(), "table-wrapper", tableConfiguration);