import { onMount } from "solid-js";
import * as d3 from "d3";
import worldData from "../lib/world.json";
import { PRIMARY_TEXT } from "../lib/constants";

const GlobeComponent = () => {
  let mapContainer: HTMLDivElement | undefined;

  const visitedCountries = [
    "France",
    "Spain",
    "England",
    "Ireland",
    "Netherlands",
    "Belgium",
    "Austria",
    "Czech Republic",
    "Poland",
    "Denmark",
    "Sweden",
    "Luxembourg",
    "Lithuania",
    "USA",
    "Italy",
    "Greece",
    "Germany",
    "Switzerland",
    "Portugal",
    "Argentina",
    "Brazil",
    "Uruguay",
    "Chile",
    "Aruba",
    "Venezuela",
    "The Bahamas",
    "Falkland Islands"
  ];

  onMount(() => {
    if (!mapContainer) return;

    // fixed drawing box, the viewBox scales it to the card and keeps it centered at any size
    const size = 500;
    const sensitivity = 75;

    let projection = d3
      .geoOrthographic()
      .scale(size / 2 - 1)
      .center([0, 0])
      .rotate([0, -10])
      .translate([size / 2, size / 2]);

    const initialScale = projection.scale();
    let pathGenerator = d3.geoPath().projection(projection);

    let svg = d3
      .select(mapContainer)
      .append("svg")
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("width", "100%")
      .attr("height", "100%");

    svg
      .append("circle")
      .attr("fill", "#EEE")
      .attr("stroke", "#000")
      .attr("stroke-width", "0.2")
      .attr("cx", size / 2)
      .attr("cy", size / 2)
      .attr("r", initialScale);

    let map = svg.append("g");

    map
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", (d: any) => pathGenerator(d as any))
      .attr("fill", (d: { properties: { name: string } }) =>
        visitedCountries.includes(d.properties.name) ? PRIMARY_TEXT : "white"
      )
      .style("stroke", "black")
      .style("stroke-width", 0.3)
      .style("opacity", 0.8);

    d3.timer(() => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      svg.selectAll("path").attr("d", (d: any) => pathGenerator(d as any));
    }, 200);
  });

  return (
    <div class="flex flex-col text-white justify-center items-center w-full h-full">
      <div class="w-full h-full" ref={mapContainer}></div>
    </div>
  );
};

export default GlobeComponent;
