import { Box, Text } from "@chakra-ui/layout";

let speak = false;
const TranslateModal2 = () => {
  const botToggler = document.querySelector(".toggler");
  const fromText = document.querySelector(".from-text");
  const toText = document.querySelector(".to-text");
  const exchageIcon = document.querySelector(".exchange");

  const selectTag = document.querySelectorAll("select");
  const icons = document.querySelectorAll(".row i");
  const translateBtn = document.querySelector(".translate");

  if (exchageIcon !== null) {
    exchageIcon.addEventListener("click", () => {
      let tempText = fromText.value,
        tempLang = selectTag[0].value;
      fromText.value = toText.value;
      toText.value = tempText;
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    });
  }

  if (fromText !== null) {
    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });
  }

  if (translateBtn !== null) {
    translateBtn.addEventListener("click", () => {
      speak = false;
      let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      const url = fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
          toText.setAttribute("placeholder", "Translation");
        });
    });
  }

  // icons.forEach((icon) => {
  //   icon.addEventListener("click", ({ target }) => {
  //     if (!fromText.value || !toText.value) return;
  //     if (target.classList.contains("fa-copy")) {
  //       if (target.id == "from") {
  //         navigator.clipboard.writeText(fromText.value);
  //       } else {
  //         navigator.clipboard.writeText(toText.value);
  //       }
  //     } else {
  //       let utterance;
  //       if (target.id == "from") {
  //         utterance = new SpeechSynthesisUtterance(fromText.value);
  //         utterance.lang = selectTag[0].value;
  //       } else {
  //         utterance = new SpeechSynthesisUtterance(toText.value);
  //         utterance.lang = selectTag[1].value;
  //       }
  //       if (utterance !== null) {
  //         console.log(utterance);
  //         speechSynthesis.speak(utterance);
  //       }
  //     }
  //   });
  // });

  icons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      if (e.stopPropagation) e.stopPropagation();
      e.preventDefault(); // Prevent default action

      const { target } = e;

      if (!fromText.value || !toText.value) return;

      if (target.classList.contains("fa-copy")) {
        if (target.id == "from") {
          navigator.clipboard.writeText(fromText.value);
        } else {
          navigator.clipboard.writeText(toText.value);
        }
      } else {
        let utterance;
        if (target.id == "from") {
          utterance = new SpeechSynthesisUtterance(fromText.value);
          utterance.lang = selectTag[0].value;
        } else {
          utterance = new SpeechSynthesisUtterance(toText.value);
          utterance.lang = selectTag[1].value;
        }
        if (utterance !== null && !speak) {
          console.log(utterance);
          speechSynthesis.speak(utterance);
          utterance = null;
          speak = true;
          // window.reload();
          // window.location.reload();
        }
      }
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    if (botToggler) {
      botToggler.addEventListener("click", () => {
        document.body.classList.toggle("show-container");
      });
    }
  });

  return (
    <>
      <div id="main">
        <button class="toggler">
          <span class="material-symbols-outlined" id="toogle">
            {" "}
            Translate{" "}
          </span>
          <span class="material-symbols-outlined" id="close">
            {" "}
            close{" "}
          </span>
        </button>

        <div class="container">
          <div class="wrapper">
            <div class="text-input">
              <textarea
                spellcheck="false"
                class="from-text"
                placeholder="Enter text"
              ></textarea>
              <textarea
                spellcheck="false"
                readonly
                disabled
                class="to-text"
                placeholder="Translation"
              ></textarea>
            </div>
            <ul class="controls">
              <li class="row from">
                <div class="icons">
                  <i id="from" class="fas fa-volume-up"></i>
                  <i id="from" class="fas fa-copy"></i>
                </div>
                <select>
                  <option value="en-GB">English</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="fr-FR">French</option>
                </select>
              </li>
              <li class="exchange">
                <i class="fas fa-exchange-alt"></i>
              </li>
              <li class="row to">
                <select>
                  <option value="hi-IN">Hindi</option>
                  <option value="en-GB">English</option>
                  <option value="fr-FR">French</option>
                </select>
                <div class="icons">
                  <i id="to" class="fas fa-volume-up"></i>
                  <i id="to" class="fas fa-copy"></i>
                </div>
              </li>
            </ul>

            <button class="translate">Translate Text</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslateModal2;
