export function addThreejsLine(ur_lineGeometry, tb, clr) {
  fetchFunction(ur_lineGeometry, function (data) {
    var lineInstance = tb.line({
      geometry: data.features[0].geometry.coordinates,
      width: 2,
      color: clr,
    });
    tb.add(lineInstance);
  });
}

function fetchFunction(url, cb) {
  fetch(url).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (data) {
        cb(data);
      });
    }
  });
}
