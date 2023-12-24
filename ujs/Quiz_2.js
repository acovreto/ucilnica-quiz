class Quiz_2 {
  quiz2QuestionsAnswers = [];
  pathToListNames;
  curentQuestion = 0;
  profNb;
  correctArr;
  questionCounter = 0;
  correctAnswerCounter = 0;
  correctAnsweredQuestions = 0;
  constructor() {
    this.quiz2SelectNameEl = document.querySelector("#quiz2-name");
    this.quiz2Header = document.querySelector(".quiz2-content .quiz2-lang");
    this.quiz2ChooseQuizCon = document.querySelector("#quiz2-choose-quiz-con");
    this.quiz2QuestionEl = document.querySelector(".quiz2-question");
    this.answers = [...document.querySelectorAll(".quiz2-answer-show")];
    this.scoreEl = document.querySelector(".quiz2-score-count");
    this.questionCount = document.querySelector(".quiz2-question-count");
    this.allQuestionsEl = document.querySelector(".quiz2-all-questions");
    this.addQuestionWraper = document.querySelector(".quiz2-questions-wraper");
    this.ol = document.querySelector("ol");
    this.quiz2start = document.querySelector(".quiz2-start");
    this.finishEl = document.querySelector(".quiz2-finish");
    this.finishEl.setAttribute("disabled", "");
    this.btnHide = document.querySelector(".quiz2-btn-hide");
    this.quizSaveQuestion = document.querySelector("#quiz2-save-question");
    this.quiz2NextBtn = document.querySelector(".quiz2-next");

    this.quiz2Container = document.querySelector(".quiz2-container");
    this.quiz2Form = document.querySelector(".quiz2-form");
    this.textareaQuiz2 = document.querySelectorAll("textarea.quiz2-answer");
    this.addQuestion = document.querySelector("#quiz2-add-question");
    this.closeQuiz2 = document.querySelector(".quiz2-container .close-count");
    this.minQuiz2 = document.querySelector(".quiz2-container .min-count");
    this.maxQuiz2 = document.querySelector(".quiz2-container .max-count");
    this.quiz2Clear = document.querySelector(".quiz2-clear");
    this.quiz2Error = document.querySelector(".quiz2-error");
    this.quiz2Open = document.querySelector(".quiz2");
    this.quiz2Delete = document.querySelector(".quiz2-delete");
    this.quiz2AddQuiz = document.querySelector("#quiz2-add-quiz");
    this.quiz2AddNamePanel = document.querySelector(".quiz2-input-name-con");
    this.quiz2SaveQuestion = document.querySelector("#quiz2-save-question");
    this.quiz2CorrectCountEl = document.querySelector(".quiz2-correct-count");
    this.quiz2RadioBatons = document.querySelectorAll(
      ".quiz2-radio-btns input[type='radio']"
    );
    this.quiz2ChooseQuizButton = document.querySelector(
      `body > div.quiz2-container > div.quiz2-panel > div.quiz2-content >
       div.quiz2-btn-box.first > button.quiz2-btn.quiz2-start`
    );
    this.closeSelectPanelButton = document.querySelector(
      `#quiz2-choose-quiz-con #close`
    );
    this.quiz2NameInputButton = document.querySelector(
      "#quiz2-input-name-button"
    );
    this.quiz2AddNamePanelInput = document.querySelector(
      ".quiz2-input-name-con input"
    );
    this.quiz2AddNamePanelClose = document.querySelector(
      ".quiz2-input-name-con #close"
    );

    this.check = this.checkAnswer.bind(this);
    // this.initQuiz2();
    this.events();
  }
  async initQuiz2() {
    let folderPath = `quiz_2_${this.profNb}`;

    let res = await this.checkFolderExist(folderPath);
    if (!res) {
      await this.createFolder(folderPath);
    }
    await this.getQuiz2Name();
  }
  async getQuiz2Name(profNb) {
    let folderPath = "quiz2_names";
    this.pathToListNames = `quiz2_names/list_${this.profNb}.json`;
    let res = await this.checkFolderExist(folderPath);

    if (!res) {
      await this.createFolder(folderPath);
    }
    let flieExist = await window.doSomething.checkFileExist(
      this.pathToListNames
    );

    if (!flieExist) {
      let filePathAndData = {
        filePath: this.pathToListNames,
        data: [],
      };
      res = await window.doSomething.writeFile(filePathAndData);

      this.quiz2Name = "";
      this.renderQuiz2();
      return;
    }

    let names = await this.getQuizNames(this.pathToListNames);

    if (names.length == 0) {
      this.quiz2Name = "";
    } else {
      this.quiz2Name = names[names.length - 1];
      let html = names.map(
        (name) => `<option value="${name}">${name}</option>`
      );
      this.quiz2SelectNameEl.insertAdjacentHTML("beforeend", html);
    }

    this.quiz2QuestionsAnswers = await this.getQuizData();

    this.renderQuiz2();
  }

  async checkFolderExist(folderPath) {
    let res = await window.doSomething.checkFolder(folderPath);

    return res;
  }
  async createFolder(folderPath) {
    await window.doSomething.createFolder(folderPath);
  }
  async checkFileExist(path) {
    let res = await window.doSomething.checkFileExist(path);
    return res;
  }
  async createFile(fileAndData) {
    let res = await window.doSomething.writeFile(fileAndData);
    return res;
  }
  async addNameToList(name) {
    let data = await window.doSomething.readData(this.pathToListNames);
    data.push(name);
    let filePathAndData = {
      filePath: this.pathToListNames,
      data: data,
    };
    let res = await window.doSomething.writeFile(filePathAndData);
  }
  async addNameToSelect(name) {
    let names = await this.getQuizNames(this.pathToListNames);
    this.quiz2SelectNameEl.innerHTML = "";
    let html1 = `<option value="" disabled selected hidden>Одбери квиз</option>`;
    let html2 = names.map((name) => `<option value="${name}">${name}</option>`);
    let html = html1 + html2;
    this.quiz2SelectNameEl.insertAdjacentHTML("beforeend", html);
    this.renderQuiz2();
  }
  async getQuizNames(filePath) {
    return await window.doSomething.readData(filePath);
  }
  async getQuizData() {
    let path = `quiz_2_${this.profNb}/quiz_${this.quiz2Name}.json`;

    let res = await window.doSomething.checkFileExist(path);

    if (res) {
      let data = await window.doSomething.readData(path);
      return data;
    } else {
      return [];
    }
  }

  async renderQuiz2() {
    if (this.quiz2Name == "" || this.quiz2Name == null) {
      this.quiz2QuestionsAnswers = [];
      this.quiz2Header.textContent = "КРЕИРАЈ КВИЗ!";

      return;
    }
    this.quiz2QuestionEl.innerHTML = "";
    this.quiz2CorrectCountEl.textContent = "";
    this.answers.forEach((answer) => {
      answer.style.backgroundColor = "#44403c";
      answer.style.color = "#fafaf9";
      answer.style.fontSize = "2rem";
      answer.innerHTML = "";
    });
    let path = `quiz_2_${this.profNb}/quiz_${this.quiz2Name}.json`;
    if (!(await this.checkFileExist(path))) {
      let filePathAndData = {
        filePath: path,
        data: [],
      };
      let res = await window.doSomething.writeFile(filePathAndData);
    }
    this.quiz2QuestionsAnswers = await window.doSomething.readData(path);
    this.quiz2Header.textContent = `КВИЗ-${this.quiz2Name}`;

    if (this.quiz2QuestionsAnswers.length == 0) {
      this.quiz2QuestionEl.textContent =
        "Квизот нема податоци! Внесете прашања и одговори!";
      this.answers.forEach((answer) => (answer.innerHTML = ""));
      return;
    }

    if (this.quiz2QuestionsAnswers.length == 0) {
      console.log(this.quiz2QuestionsAnswers.length == 0);
      return;
    } else {
      this.renderQuestion();
      this.correctArr =
        this.quiz2QuestionsAnswers[this.curentQuestion].correctArr;
      this.answers.forEach((answer) => {
        answer.addEventListener("click", this.check);
      });
      this.btnHide.addEventListener("click", (e) => {
        e.preventDefault();
        this.addQuestionWraper.classList.remove("show-wraper");
        this.answers.forEach((answer) => {
          answer.textContent = "";
          answer.style.backgroundColor = "#44403c";
        });
      });
    }
  }
  renderQuestion() {
    this.questionCounter++;
    if (this.curentQuestion > this.quiz2QuestionsAnswers.length - 1) {
      this.curentQuestion = 0;
    }
    if (this.curentQuestion < 0) {
      this.curentQuestion = this.quiz2QuestionsAnswers.length - 1;
    }

    this.quiz2CorrectCountEl.textContent = `Прашањето има:${
      this.quiz2QuestionsAnswers[this.curentQuestion].correctArr.length
    } точни одговори`;

    this.questionCount.textContent = this.questionCounter;
    this.quiz2QuestionEl.textContent =
      this.quiz2QuestionsAnswers[this.curentQuestion].question;
    this.answers[0].textContent = `a) ${
      this.quiz2QuestionsAnswers[this.curentQuestion].a
    }`;
    this.answers[1].textContent = `b) ${
      this.quiz2QuestionsAnswers[this.curentQuestion].b
    }`;
    this.answers[2].textContent = `c) ${
      this.quiz2QuestionsAnswers[this.curentQuestion].c
    }`;
    this.answers[3].textContent = `d) ${
      this.quiz2QuestionsAnswers[this.curentQuestion].d
    }`;
  }
  checkAnswer(e) {
    if (this.correctArr.includes(e.target.textContent[0])) {
      this.correctAnswerCounter++;

      e.target.style.backgroundColor = "green";
      e.target.style.color = "#fafaf9";

      if (this.correctAnswerCounter == this.correctArr.length) {
        this.correctAnswered();
      }
    } else {
      e.target.style.backgroundColor = "red";
      e.target.style.color = "#fafaf9";
      this.correctAnswerCounter = 0;
      this.answers.forEach((answer) => {
        answer.removeEventListener("click", this.check);
      });
    }

    this.finishEl.removeAttribute("disabled");
  }
  correctAnswered() {
    this.correctAnsweredQuestions++;
    this.scoreEl.textContent = Number(this.scoreEl.textContent) + 1;
    this.correctAnswerCounter = 0;
    this.answers.forEach((answer) => {
      answer.removeEventListener("click", this.check);
    });
  }

  events() {
    this.minQuiz2.addEventListener("click", (e) => {
      e.preventDefault();
      this.quiz2Container.classList.add("min-quiz2-container");
    });
    this.maxQuiz2.addEventListener("click", (e) => {
      e.preventDefault();
      this.quiz2Container.classList.remove("min-quiz2-container");
    });
    this.quiz2AddQuiz.addEventListener("click", () => {
      this.quiz2AddNamePanel.classList.add("show");
    });
    this.quiz2NameInputButton.addEventListener("click", async () => {
      if (this.quiz2AddNamePanelInput.value == "") return;
      let name = this.quiz2AddNamePanelInput.value;
      this.quiz2Name = name;

      await this.addNameToList(name);
      await this.addNameToSelect(name);

      this.quiz2AddNamePanel.classList.remove("show");
      this.renderQuiz2();
    });
    this.quiz2AddNamePanelClose.addEventListener("click", () => {
      this.quiz2AddNamePanel.classList.remove("show");
    });
    this.quiz2ChooseQuizButton.addEventListener("click", () => {
      this.quiz2ChooseQuizCon.classList.add("show");
    });
    this.quiz2SelectNameEl.addEventListener("change", async () => {
      this.quiz2Name = this.quiz2SelectNameEl.value;
      let path = `quiz_2_${this.profNb}/quiz_${this.quiz2Name}.json`;
      if (!(await window.doSomething.checkFileExist(path))) {
        let filePathAndData = {
          filePath: path,
          data: [],
        };
        let res = await window.doSomething.writeFile(filePathAndData);
      }
      this.quiz2ChooseQuizCon.classList.remove("show");
      this.scoreEl.textContent = 0;

      this.questionCount.textContent = 0;
      this.correctAnsweredQuestions = 0;
      this.questionCounter = 0;
      this.renderQuiz2();
    });
    this.closeSelectPanelButton.addEventListener("click", () => {
      this.quiz2ChooseQuizCon.classList.remove("show");
    });
    this.addQuestion.addEventListener("click", (e) => {
      e.preventDefault();
      this.addQuestionWraper.classList.add("show-wraper");
    });
    this.btnHide.addEventListener("click", (e) => {
      this.addQuestionWraper.classList.remove("show-wraper");
      this.scoreEl.textContent = 0;

      this.questionCount.textContent = 0;
      this.correctAnsweredQuestions = 0;
      this.questionCounter = 0;
      this.renderQuiz2();
    });
    this.quizSaveQuestion.addEventListener("click", async () => {
      let path = `quiz_2_${this.profNb}/quiz_${this.quiz2Name}.json`;
      let fExists = await window.doSomething.checkFileExist(path);

      if (!fExists) {
        let filePathAndData = {
          filePath: path,
          data: [],
        };
        let res = await window.doSomething.writeFile(filePathAndData);
      } else console.log("vlez2");
      this.quiz2QuestionsAnswers = await window.doSomething.readData(path);

      let answers = [];

      this.textareaQuiz2.forEach((el) => {
        answers.push(el.value);
        el.value = "";
      });
      let correctAnswers = [];
      this.quiz2RadioBatons.forEach((el) => {
        if (el.checked) {
          correctAnswers.push(el.value);
        }
      });
      let qAndA = {
        question: this.quiz2Form.questionQuiz2.value,
        a: answers[0],
        b: answers[1],
        c: answers[2],
        d: answers[3],
        correctArr: correctAnswers,
      };
      this.quiz2RadioBatons.forEach((el) => {
        el.checked = false;
      });
      this.quiz2QuestionsAnswers.push(qAndA);

      this.quiz2Form.questionQuiz2.value = "";
      let filePathAndData1 = {
        filePath: path,
        data: this.quiz2QuestionsAnswers,
      };
      await window.doSomething.writeFile(filePathAndData1);
    });
    this.quiz2NextBtn.addEventListener("click", () => {
      console.log(this.correctArr);
      console.log(this.quiz2QuestionsAnswers.length);

      if (!this.correctArr || this.quiz2QuestionsAnswers.length == 0) return;
      this.answers.forEach((answer) => {
        answer.addEventListener("click", this.check);
        answer.style.backgroundColor = "#44403c";
        answer.innerHTML = "";
      });
      this.curentQuestion++;
      if (this.curentQuestion > this.quiz2QuestionsAnswers.length - 1) {
        this.curentQuestion = 0;
      }

      this.correctArr =
        this.quiz2QuestionsAnswers[this.curentQuestion].correctArr;
      console.log("hello");
      this.renderQuestion();
    });

    this.finishEl.addEventListener("click", () => {
      this.quiz2QuestionEl.textContent = `Ученикот одговори точно на ${this.scoreEl.textContent} 
      од ${this.questionCount.textContent} прашања `;
      this.scoreEl.textContent = 0;

      this.questionCount.textContent = 0;
      this.correctAnsweredQuestions = 0;
      this.questionCounter = 0;
    });
    this.quiz2Delete.addEventListener("click", async () => {
      if (!this.quiz2QuestionsAnswers) {
        return;
      }
      console.log(this.quiz2QuestionsAnswers.length);
      this.quiz2QuestionsAnswers.splice(this.curentQuestion, 1);
      console.log(this.quiz2QuestionsAnswers);
      let filePathAndData = {
        filePath: `quiz_2_${this.profNb}/quiz_${this.quiz2Name}.json`,
        data: this.quiz2QuestionsAnswers,
      };

      await window.doSomething.writeFile(filePathAndData);
      if (this.quiz2QuestionsAnswers.length == 0) {
        this.renderQuiz2();
      } else {
        this.questionCounter--;
        this.curentQuestion++;
        this.renderQuestion();
      }
    });
  }
}
export default Quiz_2;
