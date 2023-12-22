class Quiz1 {
  constructor() {
    this.quiz1InputNameModal = document.querySelector(".quiz1-name-input");
    this.addNewQuiz1NameEl = document.querySelector("#quiz1-new-quiz");
    this.addNewQuiz1NameButton = document.querySelector("#save-quiz-name");
    this.cardsContainer = document.getElementById("quiz1-cards-container");
    this.prevBtn = document.getElementById("quiz1-prev");
    this.nextBtn = document.getElementById("quiz1-next");
    this.currentEl = document.getElementById("quiz1-current");
    this.showBtn = document.getElementById("quiz1-show");
    this.hideBtn = document.getElementById("quiz1-hide");
    this.questionEl = document.getElementById("quiz1-question");
    this.answerEl = document.getElementById("quiz1-answer");
    this.addCardBtn = document.getElementById("quiz1-add-card");
    this.clearBtn = document.getElementById("quiz1-clear");
    this.addContainer = document.getElementById("quiz1-add-container");
    this.quiz1Container = document.querySelector(".quiz1-container");
    this.closeQuiz1 = document.querySelector(".quiz1-container .close-count");
    this.minQuiz1 = document.querySelector(".quiz1-container .min-count");
    this.maxQuiz1 = document.querySelector(".quiz1-container .max-count");
    this.quiz1 = document.querySelector(".quiz1");
    this.selectEl = document.querySelector("select#quiz1-name");
    this.quiz1HeaderEl = document.querySelector("#quiz1-con-h1");
    this.prof = 42;
    this.classNb = "I-3";
    this.quizName;

    this.cardsData = [];
    this.currentActiveCard = 0;
    this.cardsEl = [];
    this.cards = [];

    // this.getQuizName(this.prof);
    this.filePath;
    // this.createCards();
    this.addEventListeners();
  }
  async getQuizName() {
    let folderExist = await window.doSomething.checkFolder(`quiz1_names`);
    let fileExist = await window.doSomething.checkFileExist(
      `quiz1_names/list_${this.prof}`
    );
    if (!folderExist) {
      await window.doSomething.createFolder(`quiz1_names`);
      let fileAndData = {
        filePath: `quiz1_names/list_${this.prof}`,
        data: [],
      };
      await window.doSomething.writeFile(fileAndData);
    } else if (!fileExist) {
      let fileAndData = {
        filePath: `quiz1_names/list_${this.prof}`,
        data: [],
      };
      await window.doSomething.writeFile(fileAndData);
    }
    let listQ1 = await window.doSomething.readData(
      `quiz1_names/list_${this.prof}`
    );
    if (listQ1.length == 0) {
      this.quiz1HeaderEl.innerHTML = "Vnesi ime na kviz";
      this.quizName = "";
      return;
    } else {
      this.quizName = listQ1[listQ1.length - 1];
      this.filePath = `quiz_1_${this.prof}/quiz_${this.quizName}_${this.classNb
        .split("-")
        .join("")}.json`;
      let html = listQ1
        .map((nameQuiz) => `<option value="${nameQuiz}">${nameQuiz}</option>`)
        .join("");
      this.selectEl.insertAdjacentHTML("beforeend", html);
      this.quiz1HeaderEl.innerHTML = `${this.quizName.toUpperCase()}`;
      this.getCardsData();
    }
  }
  async getCardsData() {
    let fileExist = await window.doSomething.checkFileExist(this.filePath);

    if (fileExist) {
      let cards = await window.doSomething.readData(this.filePath);

      this.cardsData = cards === null ? [] : cards;

      this.createCards();
    } else return;
  }
  createCards() {
    if (this.cardsData.length > 0) {
      this.cardsData.forEach((data, index) => this.createCard(data, index));
    } else {
      return;
    }
  }
  createCard(data, index) {
    const card = document.createElement("div");
    card.classList.add("quiz1-card");

    if (index === 0) {
      card.classList.add("active");
    }

    card.innerHTML = `
    <div class="quiz1-inner-card">
    <div class="quiz1-inner-card-front">
      <p>
        ${data.question}
      </p>
    </div>
    <div class="quiz1-inner-card-back">
      <p>
        ${data.answer}
      </p>
    </div>
  </div>
    `;

    card.addEventListener("click", () =>
      card.classList.toggle("quiz1-show-answer")
    );

    // Add to DOM cards
    this.cardsEl.push(card);

    this.cardsContainer.appendChild(card);

    this.updateCurrentText();
  }
  updateCurrentText() {
    this.currentEl.innerText = `${this.currentActiveCard + 1}/${
      this.cardsEl.length
    }`;
  }
  async setCardsData(cards) {
    // localStorage.setItem("quiz1-cards", JSON.stringify(cards));

    let filePathAndData = {
      filePath: this.filePath,
      data: cards,
    };
    const response = await window.doSomething.writeFile(filePathAndData);
  }
  async addNameToList(name) {
    let path = `quiz1_names/list_${this.prof}`;
    let listNames = await window.doSomething.readData(path);

    listNames.push(name);

    let fileAndData = {
      filePath: path,
      data: listNames,
    };
    let res = await window.doSomething.writeFile(fileAndData);

    return res;
  }
  async createFile() {
    let pathFolder = `quiz_1_${this.prof}`;
    let folderExist = await window.doSomething.checkFolder(pathFolder);
    if (!folderExist) {
      await window.doSomething.createFolder(pathFolder);
    }

    let fileAndData = {
      filePath: this.filePath,
      data: [],
    };
    let res = await window.doSomething.writeFile(fileAndData);
    return res;
  }

  addEventListeners() {
    this.selectEl.addEventListener("change", () => {
      console.log(this.selectEl.value);
      this.quizName = this.selectEl.value;
      this.filePath = `quiz_1_${this.prof}/quiz_${this.quizName}_${this.classNb
        .split("-")
        .join("")}.json`;
      this.cardsData = [];
      this.currentActiveCard = 0;
      this.cardsEl = [];
      this.cards = [];
      this.quiz1HeaderEl.innerHTML = `${this.quizName.toUpperCase()}`;
      this.cardsContainer.innerHTML = "";
      this.getCardsData();
    });
    this.addNewQuiz1NameEl.addEventListener("click", () => {
      this.quiz1InputNameModal.classList.add("show");
    });
    this.addNewQuiz1NameButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const inputNameEl = document.querySelector(".name-quiz1-input");
      let name = inputNameEl.value;
      if (name === "") {
        return;
      }
      this.quizName = name;
      // this.path = `quiz_1_${this.prof}/${this.name}`;
      this.filePath = `quiz_1_${this.prof}/quiz_${this.quizName}_${this.classNb
        .split("-")
        .join("")}.json`;

      let res = await this.addNameToList(name);

      if (res == "ok") {
        let html = ` <option value="${name}">${name}</option>`;
        this.selectEl.insertAdjacentHTML("afterbegin", html);
        this.quiz1InputNameModal.classList.remove("show");
        this.cardsData = [];
        this.currentActiveCard = 0;
        this.cardsEl = [];
        this.cards = [];
        this.quiz1HeaderEl.innerHTML = `${this.quizName.toUpperCase()}`;
        this.cardsContainer.innerHTML = "";
        this.getCardsData();
      }

      let res1 = await this.createFile();
    });
    this.nextBtn.addEventListener("click", () => {
      if (this.cardsData.length == 0) return;
      this.cardsEl[this.currentActiveCard].className = "quiz1-card left";

      this.currentActiveCard = this.currentActiveCard + 1;

      if (this.currentActiveCard > this.cardsEl.length - 1) {
        this.currentActiveCard = this.cardsEl.length - 1;
      }

      this.cardsEl[this.currentActiveCard].className = "quiz1-card active";

      this.updateCurrentText();
    });
    this.prevBtn.addEventListener("click", () => {
      this.cardsEl[this.currentActiveCard].className = "quiz1-card quiz1-right";

      this.currentActiveCard = this.currentActiveCard - 1;

      if (this.currentActiveCard < 0) {
        this.currentActiveCard = 0;
      }

      this.cardsEl[this.currentActiveCard].className = "quiz1-card active";

      this.updateCurrentText();
    });
    this.showBtn.addEventListener("click", () =>
      this.addContainer.classList.add("quiz1-show")
    );
    this.hideBtn.addEventListener("click", () =>
      this.addContainer.classList.remove("quiz1-show")
    );
    this.addCardBtn.addEventListener("click", async () => {
      const question = this.questionEl.value;
      const answer = this.answerEl.value;

      if (question.trim() && answer.trim()) {
        const newCard = { question, answer };

        this.createCard(newCard);

        this.questionEl.value = "";
        this.answerEl.value = "";

        // quiz1Container.style.display = "flex";

        this.cardsData.push(newCard);
        this.setCardsData(this.cardsData);
        this.addContainer.classList.remove("quiz1-show");
      }
    });
    this.clearBtn.addEventListener("click", () => {
      this.cardsData = [];
      this.setCardsData(this.cardsData);

      alert("Прашањата се избришани!");
      window.location.reload();
      this.cardsContainer.textContent = "";
    });
    this.maxQuiz1.addEventListener("click", () => {
      this.quiz1Container.classList.remove("display-min-quiz1");
    });
    this.minQuiz1.addEventListener("click", () => {
      this.quiz1Container.classList.add("display-min-quiz1");
    });
  }
}
export default Quiz1;
