// import Hours from "./Hours";

class CounterCas {
  counter;
  currentCas;
  videoFlag = 1;
  constructor(Hours) {
    this.Hours = Hours;
    this.minutesEl = document.querySelector(".min");
    this.secondsEl = document.querySelector(".sec");
    this.casPause = document.querySelector(".cas-pauza");
    this.frame = document.querySelector(".frame");
    this.formCounter = document.querySelector(".form");
    this.radioEl1 = document.querySelector("#c1");
    this.counterWraper = document.querySelector(".counter-wraper");
    this.closeCounter = document.querySelector(".counter-wraper .close-count");
    this.minCounter = document.querySelector(".counter-wraper .min-count");
    this.maxCounter = document.querySelector(".counter-wraper .max-count");
    this.youtubeBtn = document.querySelector(".youtube-btn");
    this.counterInputUrl = document.querySelector(".counter-input-url");
    this.closeBtn = document.querySelector(".counter-input-url .url-close-btn");
    this.saveUrl = document.querySelector(".save-url-btn");
    this.errorEl = document.querySelector(".error");
    this.videoUrlInput = document.querySelector(".video-url-input");
    this.radioEl1.checked = "true";

    this.init(Hours.hoursNormal);

    this.events();
  }
  init(hours) {
    this.counter = setInterval(() => {
      let date = new Date();
      let fulltime = date.getTime();
      let month = date.toLocaleString("default", { month: "short" });

      let day = date.getDate();

      let year = date.getFullYear();

      let midnight = new Date(`${month} ${day}, ${year} 00:00:00`).getTime();

      let currentTime = fulltime - midnight;

      let casoviInMilisecons = hours.map((item) => {
        let container = {};
        container.cas = item.cas;
        container.start =
          new Date(`${month} ${day}, ${year} ${item.start}`).getTime() -
          midnight;
        container.end =
          new Date(`${month} ${day}, ${year} ${item.end}`).getTime() - midnight;
        return container;
      });

      let currentCas = casoviInMilisecons.find((cas) => {
        return (
          currentTime >= Number(cas.start) && currentTime <= Number(cas.end)
        );
      });

      if (currentCas) {
        let diff = currentCas.end - currentTime;

        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.casPause.innerHTML = `ЧАС-${currentCas.cas}`;
        this.minutesEl.textContent = minutes >= 10 ? minutes : `0${minutes}`;
        this.secondsEl.innerHTML = seconds >= 10 ? seconds : `0${seconds}`;

        if (minutes <= 1 && diff > 0) {
          if (this.videoFlag == 1) {
            this.playVideo();
          }
        } else if (diff <= 0) {
          this.displayPause();
        }
      } else {
        this.displayPause();
      }
    }, 1000);
  }
  displayPause() {
    this.casPause.innerHTML = "ПАУЗА";
  }

  randomNubmer(num) {
    return Math.floor(Math.random() * num);
  }
  async playVideo() {
    this.videoFlag = 0;
    let videoUrlArray = await window.doSomething.readData("videos");
    let video = videoUrlArray[this.randomNubmer(videoUrlArray.length)];
    let proxiWin = window.open(video);
    setTimeout(() => {
      proxiWin.close();
      this.videoFlag = 1;
    }, 180000);
  }
  events() {
    this.formCounter.addEventListener("change", () => {
      clearInterval(this.counter);
      if (this.formCounter.hourLength.value == "10") {
        this.init(this.Hours.hoursMinus_10);
      } else if (this.formCounter.hourLength.value == "5") {
        this.init(this.Hours.hoursMinus_5);
      } else this.init(this.Hours.hoursNormal);
    });
    this.maxCounter.addEventListener("click", () => {
      this.counterWraper.classList.add("max-wraper");
    });
    this.minCounter.addEventListener("click", () => {
      this.counterWraper.classList.remove("max-wraper");
    });

    this.youtubeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.counterInputUrl.classList.add("show-input-url");
    });
    // this.closeBtn.addEventListener("click", () => {
    //   this.counterInputUrl.classList.remove("show-input-url");
    // });
    this.saveUrl.addEventListener("click", async () => {
      if (this.videoUrlInput.value == "") {
        this.errorEl.textContent = "Внесете урл на видео!";
        return;
      }
      let res = await window.doSomething.checkFileExist("videos");

      if (!res) {
        await window.doSomething.writeFile({
          filePath: "videos",
          data: [this.videoUrlInput.value],
        });
      } else {
        let urlVideos = await window.doSomething.readData("videos");

        urlVideos.push(videoUrlInput.value);
        videoUrlInput.value = "";
        await window.doSomething.writeFile({
          filePath: "videos",
          data: urlVideos,
        });
      }
    });
  }
}
export default CounterCas;
