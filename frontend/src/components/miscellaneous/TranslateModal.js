import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";

const translatebtn = document.querySelector(".translate");

const TranslateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI for Modal

  const fromText = document.querySelector(".from-text");
  const toText = document.querySelector(".to-text");
  const exchageIcon = document.querySelector(".exchange");

  const selectTag = document.querySelectorAll("select");
  const icons = document.querySelectorAll(".row i");

  function handleExchangeClick() {
    let tempText;
    if (fromText != null) tempText = fromText.value;

    let tempLang;
    if (selectTag[0] != null) tempLang = selectTag[0].value;

    if (fromText != null && toText != null) {
      fromText.value = toText.value;
      toText.value = tempText;
    }

    if (selectTag[0] != null && selectTag[1] != null) {
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    }
  }
  async function handleTranslateClick2() {
    const text = fromText.value;
    const translateFrom = selectTag[0].value;
    const translateTo = selectTag[1].value;

    if (!text) {
      return;
    }

    print(text);
    toText.setAttribute("placeholder", "Translating...");

    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${translateFrom}|${translateTo}`;

    console.log(apiUrl);
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.responseData) {
        toText.value = data.responseData.translatedText;
        console.log(data.responseData.translatedText);
      } else {
        console.log("Translation response format is unexpected.");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  // function handleTranslateClick() {
  //   let text = fromText;
  //   let translateFrom = selectTag[0];
  //   let translateTo = selectTag[1];

  //   if (text != null) {
  //     console.log(text.value);
  //   }

  //   if (!text) return;

  //   toText.setAttribute("placeholder", "Translating...");

  //   let apiUrl = `https://api.mymemory.translated.net/get?q=${text.value}&langpair=${translateFrom.value}|${translateTo.value}`;

  //   const url = fetch(apiUrl)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       toText.value = data.responseData.translatedText;
  //       console.log(toText.value);
  //     });
  // }

  function handleCopyClick(event) {
    const { target } = event;

    if (!fromText || !fromText.value || !toText.value) return;

    if (target.id === "from") {
      navigator.clipboard.writeText(fromText.value);
    } else {
      navigator.clipboard.writeText(toText.value);
    }
  }
  function handleVolumeClick(event) {
    const { target } = event;

    let utterance;

    if (target.id === "from" && fromText != null) {
      utterance = new SpeechSynthesisUtterance(fromText.value);
      utterance.lang = selectTag[0].value;
    } else {
      if (toText != null) {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
    }

    if (utterance != null) speechSynthesis.speak(utterance);
  }

  if (translatebtn !== null) {
    translatebtn.addEventListener("click", handleTranslateClick2);
  }

  function print(text) {
    console.log(text.value);
  }

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        mr={5}
        aria-label="Translate Text"
        icon={<span class="material-symbols-outlined">translate</span>}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"full"}>
        {/* if(isOpen) populateSelectTags(); */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Translate Text
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <div class="container">
              <div class="wrapper">
                <div class="text-input">
                  <textarea
                    spellcheck="false"
                    class="from-text"
                    placeholder="Enter text"
                    // onKeyUp={handleKeyUp}
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
                      <i
                        id="from"
                        class="fas fa-volume-up"
                        onClick={handleVolumeClick}
                      ></i>
                      <i
                        id="from"
                        class="fas fa-copy"
                        onClick={handleCopyClick}
                      ></i>
                    </div>
                    <select>
                      <option value="en-GB">English</option>
                      <option value="hi-IN">Hindi</option>
                      <option value="fr-FR">French</option>
                    </select>
                  </li>
                  <li class="exchange">
                    <i
                      class="fas fa-exchange-alt"
                      onClick={handleExchangeClick}
                    ></i>
                  </li>
                  <li class="row to">
                    <select>
                      <option value="hi-IN">Hindi</option>
                      <option value="en-GB">English</option>
                      <option value="fr-FR">French</option>
                    </select>
                    <div class="icons">
                      <i
                        id="to"
                        class="fas fa-volume-up"
                        onClick={handleVolumeClick}
                      ></i>
                      <i
                        id="to"
                        class="fas fa-copy"
                        onClick={handleCopyClick}
                      ></i>
                    </div>
                  </li>
                </ul>
              </div>
              <button class="translate">Translate Text</button>
              {/* <button onClick={handleTranslateClick2}>Translate Text</button> */}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TranslateModal;
