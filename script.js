// Random phrases generator with some cool features :)
// My girlfriend make a lot of great fonts and always asking me about some names for them...
// Its so hard to come up with font names, sooo... I decided to create this app to simplify this process.
// That's it:)

// Main class for DataBase and storages creating. Also here we create basic methods that we needed for this storages.
class LocalStorage {

// Arrays with basic words. We used them just once and record to the storages.
    #adjectiveStartArray = ['rush', 'silver', 'summer', 'sexy', 'mushroom', 'space', 'stone', 'winter', 'air', 'musical', 'salt', 'sky', 'snow',
        'sugar', 'cotton', 'mind', 'night', 'flame', 'jelly', 'light', 'silent', 'acid', 'hollow', 'natural', 'sudden',
        'yellow', 'black', 'bright', 'clear', 'deep', 'grey', 'happy', 'high', 'quiet', 'round', 'smooth', 'sweet', 'young', 'blueberry', 'blackberry',
        'cherry', 'cranberry', 'chokeberry', 'raspberry', 'strawberry', 'almond', 'hazelnut', 'peanut', 'pistachio', 'banana', 'apricot', 'lemon', 'pineapple',
        'mango', 'avocado', 'water', 'melon', 'orange', 'juicy', 'grape', 'chili', 'cucumber', 'pepper', 'pumpkin', 'spinach', 'soya', 'big', 'brave', 'bright',
        'cold', 'dirty', 'fresh', 'funny', 'hot', 'lonely', 'lucky', 'rich', 'warm', 'wide', 'young', 'spicy', 'tender', 'yummy', 'soft', 'pretty',
        'sharp', 'shiny', 'fancy', 'skinny'];
    #nounStartArray = ['feeling', 'heat', 'light', 'summer', 'touch', 'wood', 'art', 'burn', 'flower', 'fruit', 'glass', 'hour', 'ice',
        'jelly', 'liquid', 'sign', 'water', 'brass', 'butter', 'gold', 'grass', 'leather', 'motion', 'paper', 'peace',
        'rhythm', 'space', 'time', 'blood', 'copper', 'edge', 'journey', 'love', 'oil', 'plant', 'river', 'voice', 'form',
        'grain', 'paint', 'point', 'ray', 'wave', 'harmony', 'morning', 'ornament', 'soup', 'mushroom', 'space', 'stone', 'thunder',
        'touch', 'winter', 'air', 'day', 'hope', 'milk', 'money', 'music', 'oil', 'place', 'salt', 'sky', 'snow', 'story', 'sugar', 'wine',
        'chalk', 'cotton', 'night', 'silk', 'breath', 'dust', 'flame', 'rain', 'sand', 'smile', 'wind', 'canvas', 'cloth',
        'effect', 'fire', 'harbor', 'sea', 'cherry', 'currant', 'raspberry', 'strawberry', 'cashew', 'chestnut', 'hazelnut', 'peanut',
        'pistachio', 'walnut', 'banana', 'pineapple', 'melon', 'orange', 'juice', 'pear', 'quince', 'carrot', 'cucumber', 'pepper', 'pumpkin', 'spinach',
        'skin', 'souffle', 'pudding'];

    #fontNamesStorage;
// Init the DataBase and storages in constructor on a Dexie.js base.
    constructor() {
        this.#fontNamesStorage = new Dexie("fontNames");
        this.#fontNamesStorage.version(1).stores({
            adjectives: "word",
            noun: "word",
            saved: "names"
        });
    }

// Basic methods for our data. Its really simple.
    doActionForEachItems(storage, func) {
        return this.#fontNamesStorage[storage].each(func)
    }

    async getItemsCount(storage) {
        return this.#fontNamesStorage[storage].count();
    }

    async convertStorageToArray(storage) {
        return this.#fontNamesStorage[storage].toArray()
    }

    setItem(storage, type, value) {
        this.#fontNamesStorage[storage].put({[type]: value});
    }

    deleteItem(storage, value) {
        this.#fontNamesStorage[storage].delete(value);
    }

    deleteAll(storage, type) {
        this.#fontNamesStorage[storage].clear(type);
    }

// Filling the storages from arrays wich includes words.
    fillStorage() {
        this.getItemsCount("adjectives")
            .then(response => {
                if (response === 0) {
                    for (let i = 0; i <= this.#adjectiveStartArray.length - 1; i++) {
                        this.setItem("adjectives", "word", this.#adjectiveStartArray[i]);
                    }
                    for (let i = 0; i <= this.#nounStartArray.length - 1; i++) {
                        this.setItem("noun", "word", this.#nounStartArray[i]);
                    }
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                }
            });
    }
}

// Manipulating with words in storage and HTML class.
class WordManagement {

// "Find" buttons, inputs and HTML divs (areas for words).
    #addNewAdjInput = document.querySelector(".add-adjective-input");
    #addNewAdjBtn = document.querySelector(".add-adjective-button");
    #addNewNounInput = document.querySelector(".add-noun-input");
    #addNewNounBtn = document.querySelector(".add-noun-button");
    #adjectivesArea = document.querySelector('.adjectives-area');
    #nounArea = document.querySelector('.noun-area');

// Filling the words area. We need to fill them to divs for manipulating around them.
    appendWordsToHTML(wordType, appendArea, wordCSSClass) {
        fontNames.convertStorageToArray(wordType)
            .then(resolve => {
                for (let i = 0; i <= resolve.length; i++) {
                    let anyWord = document.createElement('p');
                    anyWord.className = wordCSSClass;
                    anyWord.innerText = resolve[i].word;
                    appendArea.appendChild(anyWord);
                    let wordCollection = document.querySelectorAll("." + wordCSSClass);
                    wordCollection.forEach(element => {
                        element.addEventListener('click', () => {
                            this.deleteWord(element, wordType)
                        })
                    })
                }
            });
    }

// Getting the private buttons, inputs and HTML divs (areas for words).
    getAdjectiveArea() {
        return this.#adjectivesArea
    }

    getNounArea() {
        return this.#nounArea
    }

    getAdjectiveInput() {
        return this.#addNewAdjInput
    }

    getNounInput() {
        return this.#addNewNounInput
    }

    getAddNewAdjectiveBtn() {
        return this.#addNewAdjBtn
    }

    getAddNewNounBtn() {
        return this.#addNewNounBtn
    }

// Method for adding new word to area. There are two areas - adjective and noun area.
    addNewWord(targetStorage, inputType) {
        if (!(/^\s*$/).test(inputType.value)) {
            let word = inputType.value;
            fontNames.setItem(targetStorage, "word", word);
            inputType.value = "";
            window.location.reload()
        }
    };

// Method for removing word from area. You just need to chick in word.
    deleteWord = (element, targetStorage) => {
        let targetWord = element.innerHTML;
        fontNames.deleteItem(targetStorage, targetWord);
        window.location.reload()
    };

// Listeners initialization method.
    initEventListeners(wordTypeButton, targetStorage, wordTypeInput) {
        wordTypeButton.addEventListener("click", () => {
            this.addNewWord(targetStorage, wordTypeInput)
        });
    }

}

// Class for randomize features.
class WordsGeneratorManagement {
    #adjectiveArray = [];
    #nounArray = [];
    #generateBtn = document.querySelector(".generate-random-phrase-button");
    #output = document.querySelector(".random-phrase-output");
    #saveNameButton = document.querySelector(".save-random-phrase");
    #makeSavedShowButton = document.querySelector(".show-saved-phrases-button");
    #makeSavedDeleteButton = document.querySelector(".delete-saved-phrases-button");
    #savedNamesArea = document.querySelector(".saved-phrases-area");

// Push arrays for randomizer.
    constructor() {
        fontNames.doActionForEachItems("adjectives", items => this.#adjectiveArray.push(items));
        fontNames.doActionForEachItems("noun", items => this.#nounArray.push(items));
    }

// Generate new random phrase and display it method.
    displayRandomFontName() {
        let randomAdjective;
        let randomNoun;
        do {
            randomAdjective = this.#adjectiveArray[Math.floor(Math.random() * this.#adjectiveArray.length)].word;
            randomNoun = this.#nounArray[Math.floor(Math.random() * this.#nounArray.length)].word;
        }
        while (randomAdjective === randomNoun);
        this.#output.value = `${randomAdjective} ${randomNoun}`;
    }

// Save nice phrase to DataBase method.
    saveFontName() {
        if (this.#output.value !== "") {
            let saved = this.#output.value;
            fontNames.setItem("saved", "names", saved)
        }
    }

// Display saved phrases method.
    doSavedShowInTextarea() {
        this.#savedNamesArea.value = "";
        fontNames.convertStorageToArray("saved")
            .then(resolve => {
                if (resolve.length !== 0) {
                    for (let i = 0; i <= resolve.length; i++) {
                        this.#savedNamesArea.value += resolve[i].names + '\n'
                    }
                }
            })
    }

// Clear the saved phrases list.
    doSavedDelete() {
        fontNames.deleteAll("saved", 'names');
        this.#savedNamesArea.innerText = "";
        window.location.reload()
    }

// Listeners initialization method.
    initEventListeners() {
        this.#generateBtn.addEventListener('click', () => {
            this.displayRandomFontName()
        });
        this.#saveNameButton.addEventListener("click", () => {
            this.saveFontName()
        });
        this.#makeSavedShowButton.addEventListener("click", () => {
            this.doSavedShowInTextarea()
        });

        this.#makeSavedDeleteButton.addEventListener("click", () => {
            this.doSavedDelete()
        });
    }
}

// Init App.
const fontNames = new LocalStorage();
fontNames.fillStorage();

const wordManagementAdjectives = new WordManagement();

const wordManagementNoun = new WordManagement();

const gen = new WordsGeneratorManagement();

wordManagementAdjectives.appendWordsToHTML("adjectives",
    wordManagementAdjectives.getAdjectiveArea(), "adjective-word");

wordManagementAdjectives.initEventListeners(wordManagementAdjectives.getAddNewAdjectiveBtn(),
    "adjectives", wordManagementAdjectives.getAdjectiveInput());

wordManagementNoun.appendWordsToHTML("noun",
    wordManagementNoun.getNounArea(), "noun-word");

wordManagementNoun.initEventListeners(wordManagementNoun.getAddNewNounBtn(),
    "noun", wordManagementNoun.getNounInput());

gen.initEventListeners();