var scene = new THREE.Scene();

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.y = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

class cameraCustom {
  constructor(jump) {
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
    this.camera.position.z = 200;
    this.camera.lookAt(0, 0, 0);
  }
}

class Terrain {
  constructor(width, height, space) {
    this.width = width;
    this.height = height;
    this.space = space;
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff });

    this.terrain = [];
    for (let i = 0; i < height; i++) {
      var currRow = [];
      for (let j = 0; j < width; j++) {
        currRow.push(0);
      }
      this.terrain.push(currRow);
    }
  }
  randomize() {
    var size = 100;
    var prev = Math.floor(Math.random() * size);
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.terrain[i][j] = Math.floor(prev / 2 + Math.random() * prev);
      }
    }
  }
  findNeighbours(i, j) {
    var neighbours = [];
    if (i + 1 < this.width) {
      neighbours.push([i + 1, j]);
    }
    if (j + 1 < this.height) {
      neighbours.push([i, j + 1]);
    }
    if (i - 1 >= 0) {
      neighbours.push([i - 1, j]);
    }
    if (j - 1 >= 0) {
      neighbours.push([i, j - 1]);
    }
    if (j - 1 >= 0 && i - 1 >= 0) {
      neighbours.push([i - 1, j - 1]);
    }
    if (j - 1 >= 0 && i + 1 < this.width) {
      neighbours.push([i + 1, j - 1]);
    }
    if (j + 1 < this.height && i - 1 >= 0) {
      neighbours.push([i - 1, j + 1]);
    }
    if (j + 1 < this.height && i + 1 < this.width) {
      neighbours.push([i + 1, j + 1]);
    }
    return neighbours;
  }
  generateTerrain() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        var currNeighbours = this.findNeighbours(i, j);
        var currPointVector = new THREE.Vector3(
          i * this.space,
          j * this.space,
          this.terrain[i][j] * this.space
        );
        console.log(i * this.space, j * this.space, this.terrain[i][j]);
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
          console.log("geometry", geometry.vertices);
          scene.add(new THREE.Line(geometry, this.material));
        }
      }
    }
  }
}

var ter = new Terrain(50, 50, 3);
ter.randomize();
ter.generateTerrain();

var camera = new cameraCustom(10);

function animate() {
  requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  renderer.render(scene, camera.camera);
}
animate();

document.body.appendChild(renderer.domElement);
