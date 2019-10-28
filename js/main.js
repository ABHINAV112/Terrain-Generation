var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

noise.seed(Math.random());

class cameraCustom {
  constructor(jump, startHeight) {
    this.jump = jump;
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    document.addEventListener("keyup", e => {
      if (e.code === "ArrowUp") {
        this.camera.position.y += this.jump;
      } else if (e.code === "ArrowDown") {
        this.camera.position.y -= this.jump;
      } else if (e.code === "ArrowRight") {
        this.camera.position.x += this.jump;
      } else if (e.code === "ArrowLeft") {
        this.camera.position.x -= this.jump;
      } else if (e.code == "Space") {
        this.camera.position.z += this.jump;
      } else if (e.code == "ShiftLeft") {
        this.camera.position.z -= this.jump;
      }
    });
    this.camera.position.z = startHeight;
    this.camera.lookAt(0, 0, 0);
  }
}

class Terrain {
  constructor(width, length, space, height) {
    this.width = width;
    this.length = length;
    this.space = space;
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.height = height;
    this.terrain = [];
    for (let i = 0; i < length; i++) {
      var currRow = [];
      for (let j = 0; j < width; j++) {
        currRow.push(0);
      }
      this.terrain.push(currRow);
    }
    this.camera = new cameraCustom(this.space, this.height * 4);
  }
  // random number implementation keeping previous number generated into account
  randomize() {
    var prev = Math.round(Math.random() * this.height);
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.width; j++) {
        this.terrain[i][j] =
          1 + Math.round(prev * 0.9 + Math.random() * prev * 0.2);
      }
    }
  }
  // using perlin noise for generating heights
  perlinNoise(step) {
    var yoff = 0;
    for (let i = 0; i < this.length; i++) {
      var xoff = 0;
      for (let j = 0; j < this.width; j++) {
        this.terrain[i][j] = (1 + noise.simplex2(yoff, xoff)) * this.height;
        xoff += step;
      }
      yoff += step;
    }
  }
  findNeighbours(i, j) {
    var neighbours = [];
    if (i + 1 < this.width) {
      neighbours.push([i + 1, j]);
    }
    if (j + 1 < this.length) {
      neighbours.push([i, j + 1]);
    }
    if (i - 1 >= 0) {
      neighbours.push([i - 1, j]);
    }
    if (j - 1 >= 0) {
      neighbours.push([i, j - 1]);
    }
    // if (j - 1 >= 0 && i - 1 >= 0) {
    //   neighbours.push([i - 1, j - 1]);
    // }
    if (j - 1 >= 0 && i + 1 < this.width) {
      neighbours.push([i + 1, j - 1]);
    }
    if (j + 1 < this.length && i - 1 >= 0) {
      neighbours.push([i - 1, j + 1]);
    }
    // if (j + 1 < this.length && i + 1 < this.width) {
    //   neighbours.push([i + 1, j + 1]);
    // }
    return neighbours;
  }
  generateTerrain() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.width; j++) {
        var currNeighbours = this.findNeighbours(i, j);
        var currPointVector = new THREE.Vector3(
          i * this.space,
          j * this.space,
          this.terrain[i][j] * this.space
        );
        for (let k = 0; k < currNeighbours.length; k++) {
          var geometry = new THREE.Geometry();
          var currNeighbour = currNeighbours[k];
          var currNeighbourVector = new THREE.Vector3(
            currNeighbour[0] * this.space,
            currNeighbour[1] * this.space,
            this.terrain[currNeighbour[0]][currNeighbour[1]] * this.space
          );
          geometry.vertices.push(currPointVector);
          geometry.vertices.push(currNeighbourVector);
          scene.add(new THREE.Line(geometry, this.material));
        }
      }
    }
  }
}

var ter = new Terrain(100, 100, 3, 10);
// ter.perlinNoise();
// ter.perlinNoise(0.05);
ter.randomize();
ter.generateTerrain();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, ter.camera.camera);
}
animate();

document.body.appendChild(renderer.domElement);
