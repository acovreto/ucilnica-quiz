class Cube {
  min = 10;
  max = 24;

  constructor() {
    this.cubeEl = document.getElementById("cube");
    this.sides = [...document.querySelectorAll(".dot")];
    this.cubeWraper = document.querySelector(".cube-wraper");
    this.closeCube = document.querySelector(".cube-wraper .close-count");
    this.minCube = document.querySelector(".cube-wraper .min-count");
    this.maxCube = document.querySelector(".cube-wraper .max-count");
    this.nameStudentAll = [...document.querySelectorAll(".name-student")];
    this.listStudentsData;
    this.events();
  }
  events() {
    this.cubeEl.addEventListener("click", () => {
      let numberOfStudents = this.listStudentsData.length;
      let randomArr = [];
      for (let i = 1; i <= 6; i++) {
        randomArr.push(this.getRandomNum(1, numberOfStudents + 1));
      }

      randomArr.forEach((n, i) => {
        this.sides[i].textContent = `${n}.`;
        if (this.listStudentsData) {
          this.nameStudentAll[i].textContent =
            this.listStudentsData[n - 1].student;
        }
      });
      let xRand = this.getRandom(this.max, this.min);
      let yRand = this.getRandom(this.max, this.min);

      this.cubeEl.style.transform =
        "rotateX(" + xRand + "deg) rotateY(" + yRand + "deg)";
    });
    this.minCube.addEventListener("click", () => {
      this.cubeWraper.classList.add("min-cube-wraper");
    });
    this.maxCube.addEventListener("click", () => {
      this.cubeWraper.classList.remove("min-cube-wraper");
    });
  }
  getRandom(max, min) {
    return (Math.floor(Math.random() * (max - min)) + min) * 90;
  }
  getRandomNum(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
export default Cube;
