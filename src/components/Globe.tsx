import { onMount } from "solid-js";
import * as d3 from "d3";
import worldData from "../lib/world.json";
import { PRIMARY_TEXT } from "../lib/constants";

const GlobeComponent = (props: { tilt?: number }) => {
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
    "Latvia",
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
    "Falkland Islands",
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
      // negative phi lifts the centre north of the equator
      .rotate([0, props.tilt ?? -10])
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
        visitedCountries.includes(d.properties.name) ? PRIMARY_TEXT : "white",
      )
      .style("stroke", "black")
      .style("stroke-width", 0.3)
      .style("opacity", 0.8);

    const HOME: [number, number] = [12.5683, 55.6761];
    // blue is the one hue the map does not already use, so the pin reads
    // against both the coral country fill and the white landmass
    const HOME_COLOR = "#2563EB";

    // the pin is screen-space, not geometry: drawn with its tip at (0,0) and
    // moved onto the projected point on every tick
    const pin = map.append("g");

    pin
      .append("path")
      .attr(
        "d",
        "M0,0C-4.5,-6.5 -7,-9.5 -7,-13a7,7 0 1 1 14,0c0,3.5 -2.5,6.5 -7,13Z",
      )
      .attr("fill", HOME_COLOR)
      .style("stroke", "white")
      .style("stroke-width", 1);

    pin.append("circle").attr("cy", -13).attr("r", 2.6).attr("fill", "white");
    pin.append("title").text("Copenhagen — where I'm based");

    // geometry clips itself on the far side of the globe, a screen-space pin does not
    const placePin = () => {
      const [lambda, phi] = projection.rotate();
      const point = projection(HOME);
      const visible = d3.geoDistance(HOME, [-lambda, -phi]) < Math.PI / 2;
      pin.attr("display", visible && point ? null : "none");
      if (point) pin.attr("transform", `translate(${point[0]}, ${point[1]})`);
    };

    placePin();

    d3.timer(() => {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      svg
        .selectAll(".countries path")
        .attr("d", (d: any) => pathGenerator(d as any));
      placePin();
    }, 200);
  });

  return (
    <div class="flex flex-col text-white justify-center items-center w-full h-full">
      <div class="w-full h-full" ref={mapContainer}></div>
    </div>
  );
};

export default GlobeComponent;
