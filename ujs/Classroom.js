// import Quiz1 from "./Quiz_1";

class Classroom {
  constructor(StudentsClasses, quiz1, cube, quiz2) {
    this.StudentsClasses = StudentsClasses;
    this.td = document.querySelector("td");
    this.h2 = document.querySelector(".container-header2 h2");
    this.tableStudents = document.querySelector(".table-students");
    this.tableBody = document.querySelector("tbody");
    this.tableHead = document.querySelector("thead");
    this.btn = document.querySelector(".btn");
    this.submitBtn = document.querySelector(".submit-btn");
    this.form = document.querySelector("form");
    this.predmet = document.querySelector(".predmet");
    this.close = document.querySelector("#close");
    this.header = document.querySelector(".header");
    this.classHeader = document.querySelector(".class-header");
    this.randomStudent = document.querySelector(".random-student");
    this.modalContainer = document.querySelector(".modal-container");
    this.tableContainer = document.querySelector(".table-container");
    this.ucenik = document.querySelector(".ucenik");
    this.modalOpen = document.querySelector("#sign-in");
    this.toggle = document.querySelector(".toggle");
    this.body = document.querySelector("body");
    this.headerText = document.querySelector(".header-text");
    this.signIn = document.querySelector("#sign-in");
    this.signOut = document.querySelector("#sign-out");
    this.home = document.querySelector(".home");
    this.studentTable = document.querySelector(".student-table");
    this.tajmer = document.querySelector(".tajmer");
    this.modalUcilnici = document.querySelector(".modal-ucilnici");
    this.modalUcilniciWraper = document.querySelector(".modal-ucilnici-wraper");
    this.closeUcilniciBtn = document.querySelector(".close-ucilnici-btn");
    this.dropdownList = document.querySelector(".ucilnica-dropdown");
    this.clasNumbHeader = document.querySelector(".class-number-header");
    this.quiz2 = quiz2;

    this.quiz1 = quiz1;
    this.cube = cube;

    this.profNb;
    this.classNb;
    this.brojUcenici;
    this.listStudentsData;
    this.allInputs;
    this.events();
  }
  events() {
    window.addEventListener("load", (e) => {
      this.modalContainer.classList.add("show-modal");
    });
    this.submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (this.form.broj.value && this.form.password.value) {
        if (
          this.StudentsClasses.profNum.includes(this.form.broj.value) &&
          this.form.password.value ==
            this.StudentsClasses.passwords[
              this.StudentsClasses.profNum.indexOf(this.form.broj.value)
            ]
        ) {
          this.profNb = this.form.broj.value;

          this.signIn.classList.remove("show-btn");
          this.signOut.classList.add("show-btn");
          this.headerText.textContent = "Добре дојдовте во училница";
          this.form.broj.value = "";
          this.form.password.value = "";
          this.modalContainer.classList.remove("show-modal");
          this.modalContainer.style.display = "none";
          this.showModalUcilniciList();
        } else {
          return;
        }
      } else {
        return;
      }
    });
    this.modalUcilnici.addEventListener("click", async (e) => {
      if (e.target.nodeName == "BUTTON") {
        this.classNb = e.target.textContent;

        this.quiz1.prof = this.profNb;
        this.quiz1.classNb = this.classNb;
        this.quiz2.profNb = this.profNb;

        this.headerText.textContent = "";

        this.classHeader.innerHTML = this.classNb;
        let folderExist = await window.doSomething.checkFolder("classes");
        if (!folderExist) {
          window.doSomething.createFolder("classes");
        }

        let path = `classes/class${this.classNb.split("-").join("")}_${
          this.profNb
        }.json`;
        let fExists = await window.doSomething.checkFileExist(path);

        if (!fExists) {
          let ucilnica = this.StudentsClasses.classes.find(
            (k) => k.name == this.classNb
          );
          if (!ucilnica) {
            alert("Nema takov klas!");
          } else {
            // console.log(ucilnica);
            let listStudents = [];
            ucilnica.students.split("\n").forEach((student) => {
              let s1 = student.split(".");
              listStudents.push(s1[1].trim());
            });

            let klassData = [];
            listStudents.forEach((student) => {
              klassData.push({
                student,
                oceni: ["", "", "", "", "", "", "", "", "", ""],
              });
            });
            let fileAndData = {
              filePath: path,
              data: klassData,
            };
            let res = await window.doSomething.writeFile(fileAndData);
          }
        }

        this.listStudentsData = await window.doSomething.readData(path);

        this.cube.listStudentsData = this.listStudentsData;

        this.brojUcenici = this.listStudentsData.length;
        this.modalUcilniciWraper.classList.remove("show-ucilnici");
        this.tableStudents.classList.add("show-table");
        this.displayTableStudents();
        this.quiz1.getQuizName();
        this.quiz2.initQuiz2();
      } else return;
    });
    this.signOut.addEventListener("click", (e) => {
      window.location.reload();
    });
    this.tableBody.addEventListener("click", async (e) => {
      if (e.target.nodeName == "BUTTON") {
        let path = `classes/class${this.classNb.split("-").join("")}_${
          this.profNb
        }.json`;
        let row = e.target.closest("tr");
        let ime = row
          .querySelector("td:first-child")
          .textContent.split(".")
          .filter((el) => el.length > 3);

        let tableRowInput = row.querySelectorAll("td input");

        let oceRow = [];
        tableRowInput.forEach((el) => {
          oceRow.push(el.value);
        });

        let index = this.listStudentsData.findIndex(
          (obj) => obj.student == ime
        );
        this.listStudentsData[index].oceni = oceRow;

        let fileAndData = {
          filePath: path,
          data: this.listStudentsData,
        };
        let res = await window.doSomething.writeFile(fileAndData);

        alert("Податоците се зачувани");
      }
      return false;
    });
  }
  displayTableStudents() {
    this.tableBody.innerHTML = "";
    this.tableHead.innerHTML = "";
    this.tableStudents.classList.add("show-table");

    let html = ``;

    this.listStudentsData.forEach((item, index) => {
      let html1 = ``;
      let html0 = ``;
      this.tableHead.innerHTML = `<tr>
      <th>Име и Презиме</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th>Оцена</th>
      <th><button class="close-btn" id="close">
      <i class="fa fa-times"></i>
    </button></th>
    </tr>`;
      html0 = `<tr><td>${index + 1}.${item.student}</td>`;

      item.oceni.forEach((oce, index) => {
        html1 += `<td><input class="ocena-input" type="text" name="ocena${index}" value="${
          oce ? oce : ""
        }" /></td> `;
      });
      html1 += `<td><button class="btn btn-zacuvaj">зачувај</button></td></tr>`;
      html += html0 + html1;
    });

    this.tableBody.insertAdjacentHTML("afterbegin", html);
    this.allInputs = document.querySelectorAll(".ocena-input");
  }
  showModalUcilniciList() {
    this.modalUcilnici.innerHTML = "";
    let html = ``;
    this.StudentsClasses.classesNames.forEach((year) => {
      let html0 = ``;
      year.class.forEach((c) => {
        html0 += `<th><button class="btn-class">${c}</button><th>`;
      });
      html += `<tr><th>${year.godina}</th>${html0}</tr>`;
    });

    this.modalUcilnici.insertAdjacentHTML("afterbegin", html);
    this.modalUcilniciWraper.classList.add("show-ucilnici");
  }
}

export default Classroom;
