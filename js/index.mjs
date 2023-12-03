document.addEventListener("DOMContentLoaded", async () => {
  const width = 1200;
  const height = 680;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const gdp = await d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );

  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleUtc()
    .domain([
      new Date(d3.min(gdp.data, (d) => d[0])),
      new Date(d3.max(gdp.data, (d) => d[0])),
    ])
    .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(gdp.data, (d) => d[1])])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add the x-axis.
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  function onMouseOver(e) {
    console.log(this);
    console.log(e);
  }

  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(gdp.data)
    .join("rect")
    .on("mouseover", function (e, data) {
      const w = 120;
      const h = 40;
      const [x, y] = d3.pointer(e);

      const g = svg
        .append("g")
        .attr("id", "tooltip")
        .attr("data-date", data[0]);

      g.append("rect")
        .attr("height", h)
        .attr("width", w)
        .attr("x", x + w / 2)
        .attr("y", y - h / 2)
        .attr("fill", "white");

      g.append("text")
        .text(data[0])
        .attr("height", h)
        .attr("width", w)
        .attr("x", x + w)
        .attr("y", y)
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black");
    })
    .on("mouseleave", function (e) {
      svg.selectAll("#tooltip").remove();
    })
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => x(new Date(d[0])))
    .attr("y", (d) => height - marginBottom)
    .attr("width", 3)
    .attr("height", 0)
    .attr("fill", "#dc2626")
    .transition()
    .duration(1000)
    .ease(d3.easeElastic)
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => height - marginBottom - y(d[1]))
    .attr("fill", "#60a5fa")
    .delay((_, i) => i * 5);

  const container = document.querySelector(".container");
  const title = document.createElement("h1");
  title.id = "title";
  title.textContent = gdp.name;
  container.appendChild(title);
  container.appendChild(svg.node());

  document.body.appendChild(container);
});
