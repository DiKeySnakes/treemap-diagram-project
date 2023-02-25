let movieData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

const drawTreeMap = () => {
  const hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node['children'];
    })
    .sum((node) => {
      return node['value'];
    })
    .sort((node1, node2) => {
      return node2['value'] - node1['value'];
    });

  const createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);

  const movieTiles = hierarchy.leaves();

  const block = canvas
    .selectAll('g')
    .data(movieTiles)
    .enter()
    .append('g')
    .attr('transform', (movie) => {
      return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')';
    });

  block
    .append('rect')
    .attr('class', 'tile')
    .attr('fill', (movie) => {
      let category = movie['data']['category'];
      if (category === 'Action') {
        return 'rgba(125, 157, 232, 1)';
      } else if (category === 'Drama') {
        return 'rgba(216, 200, 166, 1)';
      } else if (category === 'Adventure') {
        return 'rgba(0, 221, 255, 1)';
      } else if (category === 'Family') {
        return 'rgba(0, 189, 94, 1)';
      } else if (category === 'Animation') {
        return 'rgba(0, 255, 128, 1)';
      } else if (category === 'Comedy') {
        return 'rgba(255, 163, 51, 1)';
      } else if (category === 'Biography') {
        return 'rgba(255, 51, 92, 1)';
      }
    })
    .attr('stroke', 'rgba(240, 240, 240, 1)')
    .attr('data-name', (movie) => {
      return movie['data']['name'];
    })
    .attr('data-category', (movie) => {
      return movie['data']['category'];
    })
    .attr('data-value', (movie) => {
      return movie['data']['value'];
    })
    .attr('width', (movie) => {
      return movie['x1'] - movie['x0'];
    })
    .attr('height', (movie) => {
      return movie['y1'] - movie['y0'];
    })
    .on('mouseover', (movie) => {
      tooltip.transition().style('visibility', 'visible');

      const revenue = movie['data']['value']
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      tooltip.html('$ ' + revenue + '<hr />' + movie['data']['name']);

      tooltip.attr('data-value', movie['data']['value']);
    })
    .on('mouseout', (movie) => {
      tooltip.transition().style('visibility', 'hidden');
    });

  block
    .append('text')
    .text((movie) => {
      return movie['data']['name'];
    })
    .attr('x', 5)
    .attr('y', 20);
};

const movieDataUrl =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

d3.json(movieDataUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    console.log(movieData);
    drawTreeMap();
  }
});
