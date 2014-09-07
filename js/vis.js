// Generated by CoffeeScript 1.7.1
(function() {
  var FreqMap, activate, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  FreqMap = function() {
    var arc, arcTween, charge, collide, colorScale, countries, currentDataset, currentNodes, force, freqMap, height, legend_data, majColor, minColor, moveToPoint, node, nodeG, opacityScale, path, pie, pies, projection, projectionTween, radius, radiusScale, setLayout, setupNodes, tick, tickCharged, trans_data, update, vis, width;
    vis = null;
    width = 960;
    height = 500;
    currentNodes = [];
    node = null;
    nodeG = null;
    radius = 12;
    radiusScale = d3.scale.linear().domain([0, 1]).range([5, radius * 1.5]);
    opacityScale = d3.scale.sqrt().domain([1, 30]).range([.3, 1]);
    charge = function(node) {
      return -Math.pow(node.radius, 2.0) / 8;
    };
    force = d3.layout.force().size([width, height]).gravity(0).friction(0.01);
    pies = null;
    pie = d3.layout.pie().startAngle(5 * Math.PI / 2).endAngle(Math.PI / 2).sort(null);
    arc = d3.svg.arc().innerRadius(0).outerRadius(radius);
    colorScale = d3.scale.ordinal().domain([1, .1, .01, .001]).range(['#1f78b4', '#33a02c', '#e31a1c', '#6a3d9a']);
    minColor = null;
    majColor = '#fdbf6f';
    legend_data = [[.25, .75]];
    trans_data = [[.25, .75], [.25, .75], [.25, .75], [.25, .75]];
    projection = null;
    countries = null;
    path = null;
    currentDataset = '1000genomes_phase3';
    freqMap = (function(_this) {
      return function(selection, data) {
        var graticule;
        projection = d3.geo.kavrayskiy7().rotate([-155, 0, 0]).clipExtent([[3, 3], [width - 3, height - 3]]).scale(150).translate([width / 2, height / 2]);
        path = d3.geo.path().projection(projection);
        graticule = d3.geo.graticule();
        currentNodes = setupNodes(data);
        setLayout('true');
        vis = d3.select('#vis').append("svg").attr("width", width).attr("height", height);
        vis.append("defs").append("path").datum({
          type: "Sphere"
        }).classed("map-path", true).attr({
          "id": "sphere",
          "d": path
        });
        vis.append("use").attr({
          "xlink:href": "#sphere",
          'fill': 'none',
          'stroke': '#000',
          'stroke-width': '3px'
        }).classed("map-path", true);
        vis.append("use").attr({
          "xlink:href": "#sphere",
          'fill': '#fff'
        }).classed("map-path", true);
        vis.append("path").datum(graticule).attr({
          "d": path,
          'fill': 'none',
          'stroke': '#777',
          'stroke-width': '.3px',
          'stroke-opacity': '.5'
        }).classed("map-path", true);
        return d3.json('data/world-50m.json', function(error, world) {
          countries = topojson.feature(world, world.objects.countries);
          vis.append('path').datum(topojson.feature(world, world.objects.land)).classed("map-path", true).attr({
            'd': path,
            'fill': '#ddd'
          });
          return update();
        });
      };
    })(this);
    freqMap.updateData = function(url) {
      return d3.json(url, function(error, data) {
        if (error) {

        } else {
          currentNodes = setupNodes(data);
          vis.selectAll('.node').remove();
          return update();
        }
      });
    };
    freqMap.updateMapSimple = function(dataset) {

      /*
      country_raw = countries.features.filter (d) =>
        if d.id == 840
          d.id
      country = country_raw[0]
      bounds = path.bounds(country)
      dx = bounds[1][0] - bounds[0][0]
      dy = bounds[1][1] - bounds[0][1]
      x = (bounds[0][0] + bounds[1][0]) / 2
      y = (bounds[0][1] + bounds[1][1]) / 2
      s = .9 / Math.max(dx / width, dy / height)
      t = [width / 2 - s * x, height / 2 - s * y]
       */
      if (dataset === '1000genomes_phase3') {
        projection.scale(150).translate([width / 2, height / 2]).rotate([-155, 0, 0]);
        vis.selectAll('.map-path').attr('d', path);
        return currentDataset = dataset;
      } else if (dataset === 'hgdp') {
        projection.scale(150).translate([width / 2, height / 2]).rotate([-155, 0, 0]);
        vis.selectAll('.map-path').attr('d', path);
        return currentDataset = dataset;
      } else {
        projection.scale(1000).rotate([-15, 0, 0]).translate([width / 2 - 10, height / 2 + 850]);
        vis.selectAll('.map-path').attr('d', path);
        return currentDataset = dataset;
      }
    };
    freqMap.updateMap = function(view) {
      var b, country, country_raw, new_path, new_projection, s, t;
      country_raw = countries.features.filter((function(_this) {
        return function(d) {
          if (d.id === 156) {
            return d.id;
          }
        };
      })(this));
      country = country_raw[0];
      b = path.bounds(country);
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
      t = [(width - s * (b[1][0] + b[0][0])) / 2, height - s * (b[1][1] + b[0][1])];
      new_projection = d3.geo.kavrayskiy7().scale(s).translate(t);
      new_path = d3.geo.path().projection(new_projection);
      return vis.selectAll('.map-path').attr('d', new_path);
    };
    projectionTween = function(projection0, projection1) {
      return (function(_this) {
        return function(d) {
          var old_path, old_projection, p0, p1, t;
          t = 0;
          old_projection = d3.geo.projection(project).scale(1).translate([width / 2, height / 2]);
          old_path = d3.geo.path().projection(old_projection);
          function project(λ, φ) {;
          λ *= 180 / Math.PI;
          φ *= 180 / Math.PI;
          p0 = projection0([λ, φ]);
          p1 = projection1([λ, φ]);
          return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
          };
          return function(_) {
            t = _;
            return old_path(d);
          };
        };
      })(this);
    };
    update = function() {
      var alleles, build, chr, coords, freqScale, legend, piePath, pos, trans_legend;
      force.nodes(currentNodes, function(d) {
        return d.id;
      }).start();
      freqScale = currentNodes[0].freqScale;
      minColor = colorScale(freqScale);
      coords = currentNodes[0].coord;
      chr = coords.split(':')[0];
      pos = coords.split(':')[1];
      alleles = currentNodes[0].alleles;
      if (currentDataset === '1000genomes_phase3') {
        build = 'hg19';
      } else {
        build = 'hg18';
      }
      $('#variant h2').html(("<a id='ucscLink' href='https://genome.ucsc.edu/cgi-bin/hgTracks?db=" + build + "&position=chr" + chr + "%3A" + pos + "-" + pos + "' target='_blank'>chr" + coords + "</a>") + (" <span style='color:" + minColor + "'>" + alleles[0] + "</span>/<span style='color: " + majColor + "'>" + alleles[1] + "</span>"));
      node = vis.selectAll(".node").data(currentNodes, function(d) {
        return d.id;
      });
      nodeG = node.enter().append("g").attr("class", "node").attr({
        "transform": function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }
      }).call(force.drag);
      piePath = nodeG.selectAll("path").data((function(_this) {
        return function(d, i) {
          return pie([0, 1]);
        };
      })(this)).enter().append("path").attr("d", arc).attr('class', 'nodePath').each((function(_this) {
        return function(d) {
          return _this._current = d;
        };
      })(this)).attr({
        "fill": (function(_this) {
          return function(d, i) {
            if (i === 0) {
              return minColor;
            } else {
              return '#fdbf6f';
            }
          };
        })(this),
        "stroke": 'white',
        "stroke-width": '1.5px'
      });
      piePath.data((function(_this) {
        return function(d) {
          return pie(d.af);
        };
      })(this)).transition().duration(500).attrTween("d", arcTween).attr({
        "opacity": function(d, i, index) {
          var nobs;
          nobs = currentNodes[index].nobs;
          return opacityScale(nobs);
        }
      });
      $(".node").tipsy({
        gravity: 'sw',
        html: true,
        title: function() {
          var d, tooltip;
          d = this.__data__;
          tooltip = ("<strong>pop: " + d.id + "</strong><br>") + ("<strong>maf: " + (d.af[0] * freqScale) + "</strong><br>") + ("<strong>mac: " + d.xobs + "</strong><br>") + ("<strong>nobs: " + d.nobs + "</strong>");
          return tooltip;
        }
      });
      node.exit().remove();
      $('#freqLegend h3').html("<p><i style='font-size:14px'>Frequency Scale = Proportion out of " + freqScale + "</i><br>Colors used in the pie chart also indicate frequency scale. ex. the pie below represents MAF = <span style='color:" + minColor + "'>" + (.25 * freqScale) + "</span></p>").css('font-size', 12);
      legend = d3.select("#freqLegend").selectAll("svg").data(legend_data).enter().append("svg").attr("width", radius + 50).attr("height", radius + 50).append("g").attr("transform", "translate(" + (radius + 10) + ", " + (radius + 6) + ")").attr('class', 'legendSvg');
      legend.selectAll("path").data(pie).enter().append("path").attr("d", d3.svg.arc().innerRadius(0).outerRadius(16)).attr({
        "fill": (function(_this) {
          return function(d, i) {
            if (i === 0) {
              return minColor;
            } else {
              return '#fdbf6f';
            }
          };
        })(this),
        "stroke": 'white',
        "stroke-width": '1.5px',
        "class": 'legslice'
      });
      d3.select('.legslice').transition().duration(800).attr({
        "fill": (function(_this) {
          return function(d, i) {
            if (i === 0) {
              return minColor;
            } else {
              return '#fdbf6f';
            }
          };
        })(this)
      });
      $('#transLegend h3').html('<p>Sample sizes below 30 chromosomes become increasingly transparent to represent uncertain allele frequencies i.e.</p>').css('font-size', 12);
      trans_legend = d3.select("#transLegend").selectAll("svg").data(trans_data).enter().append("svg").attr("width", radius + 50).attr("height", radius + 50).append("g").attr("transform", "translate(" + (radius + 10) + ", " + (radius + 20) + ")").attr('class', 'transSvg');
      trans_legend.selectAll("path").data(pie).enter().append("path").attr("d", d3.svg.arc().innerRadius(0).outerRadius(16)).attr({
        "fill": (function(_this) {
          return function(d, i) {
            if (i === 0) {
              return '#1f78b4';
            } else {
              return '#fdbf6f';
            }
          };
        })(this),
        "stroke": 'white',
        "stroke-width": '1.5px',
        "class": 'legslice',
        "opacity": (function(_this) {
          return function(d, i, index) {
            return opacityScale(index * 9);
          };
        })(this)
      });
      trans_legend.append('text').text((function(_this) {
        return function(d, i, index) {
          return i * 9;
        };
      })(this)).attr({
        'font-size': '11px'
      });
      return $('#testLegend h3').html('<p>More features are on the way...scaled circles as alternates to pie charts, computing a bounding box for regional datasets, pdf export for publication quality figures, and search by rsID or tables of markers. Contact us with any ideas!</p>').css('font-size', 12);
    };
    arcTween = (function(_this) {
      return function(a) {
        var i;
        i = d3.interpolate(_this._current, a);
        _this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      };
    })(this);
    setupNodes = function(data) {
      var nodes;
      nodes = [];
      data.forEach(function(d) {
        var coords;
        coords = projection(d.pos);
        node = {
          x: coords[0],
          y: coords[1],
          radius: radiusScale(d.freq[0]),
          id: d['pop'],
          lon: coords[0],
          lat: coords[1],
          af: d.freq,
          xobs: d.xobs,
          nobs: d.nobs,
          freqScale: d.freqscale,
          coord: d.chrom_pos,
          alleles: d.alleles
        };
        return nodes.push(node);
      });
      return nodes;
    };
    freqMap.toggleLayout = function(newLayout) {
      force.stop();
      setLayout(newLayout);
      return update();
    };
    setLayout = function(newLayout) {
      var layout;
      layout = newLayout;
      if (layout === "charged") {
        return force.on("tick", tickCharged).charge(charge);
      } else if (layout === "true") {
        return force.on("tick", tick).charge(0);
      }
    };
    tick = function(e) {
      var k;
      k = e.alpha * 0.08;
      node.each(moveToPoint(e.alpha));
      return node.attr("transform", (function(_this) {
        return function(d) {
          return "translate(" + d.x + " , " + d.y + ")";
        };
      })(this));
    };
    tickCharged = function(e) {
      var k, q;
      k = e.alpha * 0.08;
      q = d3.geom.quadtree(currentNodes);
      currentNodes.forEach(function(n) {
        return q.visit(collide(n));
      });
      node.each(moveToPoint(e.alpha));
      return node.attr("transform", (function(_this) {
        return function(d) {
          return "translate(" + d.x + " , " + d.y + ")";
        };
      })(this));
    };
    moveToPoint = function(alpha) {
      return (function(_this) {
        return function(d) {
          d.y += (d.lat - d.y) * alpha;
          return d.x += (d.lon - d.x) * alpha;
        };
      })(this);
    };
    collide = function(node) {
      var nx1, nx2, ny1, ny2, r;
      r = node.radius + 16;
      nx1 = node.x - r;
      nx2 = node.x + r;
      ny1 = node.y - r;
      ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        var l, x, y;
        if (quad.point && (quad.point !== node)) {
          x = node.x - quad.point.x;
          y = node.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = node.radius + quad.point.radius + 8;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    };
    return freqMap;
  };

  activate = function(group, link) {
    d3.selectAll("#" + group + " a").classed("active", false);
    return d3.select("#" + group + " #" + link).classed("active", true);
  };

  $(function() {
    var dropDown, options, plot, test_dd;
    test_dd = [
      {
        'dataset': '1000genomes_phase3',
        'build': 'hg19',
        'view': 'global'
      }, {
        'dataset': 'hgdp',
        'build': 'hg18',
        'view': 'europe'
      }, {
        'dataset': 'popres_euro',
        'build': 'hg18',
        'view': 'europe'
      }
    ];
    plot = FreqMap();
    activate("layouts", 'true');
    dropDown = d3.select("#datasets").append("select").attr("id", "dataset").attr('class', 'chosen');
    options = dropDown.selectAll("option").data(test_dd).enter().append("option");
    options.text((function(_this) {
      return function(d) {
        return "" + d.dataset + " (" + d.build + ")";
      };
    })(this)).attr("value", (function(_this) {
      return function(d) {
        return d.dataset;
      };
    })(this));
    $(".chosen").chosen();
    d3.select('#datasets').append('a').attr('id', 'dataLink').html("<i id='linkIcon' class='fa fa-external-link'></i>");
    d3.json('http://popgen.uchicago.edu/ggv_api/freq_table?data="1000genomes_phase3_table"&random_snp=True', (function(_this) {
      return function(error, data) {
        return plot('#vis', data);
      };
    })(this));
    $('#dataLink').attr("href", "http://www.1000genomes.org/").attr('target', '_blank');
    d3.selectAll("#layouts a").on("click", function(d) {
      var newLayout;
      newLayout = d3.select(this).attr("id");
      activate("layouts", newLayout);
      return plot.toggleLayout(newLayout);
    });
    $('#dataset').chosen().change(function() {
      var dataset, url;
      dataset = $('#dataset').chosen().val();
      if (dataset === '1000genomes_phase3') {
        $('#dataLink').attr("href", "http://www.1000genomes.org/").attr('target', '_blank');
      } else if (dataset === 'hgdp') {
        $('#dataLink').attr("href", "http://www.hagsc.org/hgdp/files.html").attr('target', '_blank');
      } else {
        $('#dataLink').attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/18760391").attr('target', '_blank');
      }
      url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&random_snp=True';
      plot.updateMapSimple(dataset);
      return plot.updateData(url);
    });
    d3.select('#random').on("click", function() {
      var dataset, url;
      dataset = $('#dataset').chosen().val();
      url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&random_snp=True';
      return plot.updateData(url);
    });
    $('#buttons').keyup(function(e) {
      var chrom, dataset, pos, rsID, url, variant;
      if (e.which === 13) {
        if ($('#search').val() === '') {

        } else {
          dataset = $('#dataset').chosen().val();
          variant = $('#search').val().split(':');
          if ($('#search').val().substring(0, 2) === 'rs') {
            rsID = $('#search').val();
            url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&rsID=' + rsID;
            return plot.updateData(url);
          } else if (variant[0].substring(0, 3) === 'chr') {
            chrom = variant[0].substring(3);
            pos = variant[1];
            url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&chr=' + chrom + '&pos=' + pos;
            return plot.updateData(url);
          } else {
            chrom = variant[0];
            pos = variant[1];
            url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&chr=' + chrom + '&pos=' + pos;
            return plot.updateData(url);
          }
        }
      }
    });
    return $('#submit').click(function() {
      var chrom, dataset, pos, rsID, url, variant;
      if ($('#search').val() === '') {

      } else {
        dataset = $('#dataset').chosen().val();
        variant = $('#search').val().split(':');
        if ($('#search').val().substring(0, 2) === 'rs') {
          rsID = $('#search').val();
          url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&rsID=' + rsID;
          return plot.updateData(url);
        } else if (variant[0].substring(0, 3) === 'chr') {
          chrom = variant[0].substring(3);
          pos = variant[1];
          url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&chr=' + chrom + '&pos=' + pos;
          return plot.updateData(url);
        } else {
          chrom = variant[0];
          pos = variant[1];
          url = 'http://popgen.uchicago.edu/ggv_api/freq_table?data="' + dataset + '_table"&chr=' + chrom + '&pos=' + pos;
          return plot.updateData(url);
        }
      }
    });
  });

}).call(this);
