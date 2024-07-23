let words = [
    { word: "Hello", translation: "Hola", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Goodbye", translation: "Adios", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Thank you", translation: "Gracias", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Please", translation: "Por favor", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Sorry", translation: "Lo siento", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Good morning", translation: "Buenos dias", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Good night", translation: "Buenas noches", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "How are you", translation: "Como estas", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "What's your name", translation: "Como te llamas", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Nice to meet you", translation: "Mucho gusto", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Water", translation: "Agua", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Food", translation: "Comida", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "House", translation: "Casa", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Car", translation: "Coche", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Book", translation: "Libro", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Friend", translation: "Amigo", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Family", translation: "Familia", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Time", translation: "Tiempo", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Day", translation: "Dia", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null },
    { word: "Night", translation: "Noche", level: Math.floor(Math.random() * 11), lastReview: null, nextReview: null }
];

let currentWordIndex = 0;
let currentSetIndex = 0;
let correctAnswersInSet = 0;
let wrongAnswers = [];
let currentSort = { column: null, direction: 'asc' };
const WORDS_PER_SET = 10;

function openTab(tabName) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    let tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    if (tabName === 'libraryTab') {
        updateLibraryTable();
    } else if (tabName === 'reviewTab') {
        updateReviewCount();
        displayReviewWord();
    }
}

function sortWords(column) {
    const direction = column === currentSort.column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    currentSort = { column, direction };

    words.sort((a, b) => {
        if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    updateLibraryTable();
}

function updateLibraryTable() {
    let tableBody = document.getElementById("libraryTableBody");
    tableBody.innerHTML = "";
    words.forEach((word, index) => {
        let row = tableBody.insertRow();
        row.insertCell(0).textContent = word.word;
        row.insertCell(1).textContent = word.translation;
        row.insertCell(2).textContent = word.level;
        row.insertCell(3).textContent = word.lastReview || 'Not reviewed';
        row.insertCell(4).textContent = word.nextReview || 'Review today';
        
        let actionsCell = row.insertCell(5);
        let modifyBtn = document.createElement('button');
        modifyBtn.textContent = 'Modify';
        modifyBtn.onclick = () => modifyWord(index);
        actionsCell.appendChild(modifyBtn);

        let removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeWord(index);
        actionsCell.appendChild(removeBtn);
    });
}

function updateReviewCount() {
    const today = new Date().toISOString().split('T')[0];
    const wordsForToday = words.filter(word => !word.nextReview || word.nextReview <= today).length;
    document.getElementById("reviewCount").textContent = `Words to review today: ${wordsForToday}`;
}

function displayReviewWord() {
    const today = new Date().toISOString().split('T')[0];
    const reviewableWords = words.filter(word => !word.nextReview || word.nextReview <= today);
    
    if (reviewableWords.length > 0) {
        if (currentSetIndex >= WORDS_PER_SET || currentSetIndex >= reviewableWords.length) {
            showSetResult();
            currentSetIndex = 0;
            correctAnswersInSet = 0;
        }
        
        currentWordIndex = words.indexOf(reviewableWords[currentSetIndex]);
        document.getElementById("reviewWord").textContent = words[currentWordIndex].word;
        document.getElementById("answerInput").value = "";
        document.getElementById("result").textContent = "";
        document.getElementById("answerInput").disabled = false;
        document.getElementById("answerInput").focus();
        
        updateProgressBar();
    } else {
        document.getElementById("reviewWord").textContent = "No words to review today";
        document.getElementById("answerInput").value = "";
        document.getElementById("answerInput").disabled = true;
    }
}

function checkAnswer() {
    let userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
    let correctAnswer = words[currentWordIndex].translation.toLowerCase();
    let lastResult = document.getElementById("lastResult");
    let result = document.getElementById("result");
    
    if (userAnswer === correctAnswer) {
        result.textContent = "Correct!";
        result.className = "correct";
        document.getElementById('correctSound').play();
        words[currentWordIndex].level = Math.min(words[currentWordIndex].level + 1, 10);
        correctAnswersInSet++;
    } else {
        result.textContent = "Incorrect. The correct answer is: " + correctAnswer;
        result.className = "incorrect";
        document.getElementById('wrongSound').play();
        words[currentWordIndex].level = 1;
    }
    if (userAnswer !== correctAnswer) {
        wrongAnswers.push({word: words[currentWordIndex].word, correct: correctAnswer, user: userAnswer});
    }


    
    words[currentWordIndex].lastReview = new Date().toISOString().split('T')[0];
    words[currentWordIndex].nextReview = calculateNextReviewDate(words[currentWordIndex].level);
    
    lastResult.innerHTML = `Last word: ${words[currentWordIndex].word} - Your answer: ${userAnswer} - Correct answer: ${correctAnswer} 
                            ${userAnswer === correctAnswer ? '✅' : '❌'}`;
    lastResult.className = userAnswer === correctAnswer ? "correct" : "incorrect";
    
    currentSetIndex++;
    updateReviewCount();
    setTimeout(displayReviewWord, 1500);
}

function showSetResult() {
    let setResult = document.getElementById("setResult");
    let message = "";
    if (correctAnswersInSet === WORDS_PER_SET) {
        message = "Perfect! You're a language master! 10/10 correct.";
    } else if (correctAnswersInSet >= 8) {
        message = `Great job! ${correctAnswersInSet}/${WORDS_PER_SET} correct. Keep it up!`;
    } else if (correctAnswersInSet >= 6) {
        message = `Good effort! ${correctAnswersInSet}/${WORDS_PER_SET} correct. You're making progress!`;
    } else if (correctAnswersInSet >= 4) {
        message = `Not bad! ${correctAnswersInSet}/${WORDS_PER_SET} correct. There's room for improvement!`;
    } else {
        message = `Keep practicing! ${correctAnswersInSet}/${WORDS_PER_SET} correct. You'll get better!`;
    }
    setResult.textContent = message;
    if (wrongAnswers.length > 0) {
        let wrongAnswersHtml = '<h3>Words to review:</h3><ul>';
        wrongAnswers.forEach(answer => {
            wrongAnswersHtml += `<li>${answer.word}: You said "${answer.user}", correct answer is "${answer.correct}"</li>`;
        });
        wrongAnswersHtml += '</ul>';
        setResult.innerHTML += wrongAnswersHtml;
    }
    wrongAnswers = [];
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progress = (currentSetIndex / WORDS_PER_SET) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentSetIndex}/${WORDS_PER_SET}`;
}

function calculateNextReviewDate(level) {
    let today = new Date();
    today.setDate(today.getDate() + Math.pow(2, level - 1));
    return today.toISOString().split('T')[0];
}

function addWord() {
    let newWord = document.getElementById("newWord").value.trim();
    let newTranslation = document.getElementById("newTranslation").value.trim();
    if (newWord && newTranslation) {
        words.push({
            word: newWord,
            translation: newTranslation,
            level: 0,
            lastReview: null,
            nextReview: null
        });
        document.getElementById("newWord").value = "";
        document.getElementById("newTranslation").value = "";
        updateLibraryTable();
        updateReviewCount();
    }
}

function modifyWord(index) {
    let word = words[index];
    let newWord = prompt("Enter new word:", word.word);
    let newTranslation = prompt("Enter new translation:", word.translation);
    if (newWord !== null && newTranslation !== null) {
        words[index] = {
            ...word,
            word: newWord.trim(),
            translation: newTranslation.trim()
        };
        updateLibraryTable();
    }
}

function removeWord(index) {
    if (confirm("Are you sure you want to remove this word?")) {
        words.splice(index, 1);
        updateLibraryTable();
        updateReviewCount();
    }
}

// Event listeners
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        openTab(this.getAttribute('data-tab'));
    });
});

document.querySelectorAll('.sort-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => sortWords(arrow.dataset.sort));
});

document.getElementById('checkAnswerBtn').addEventListener('click', checkAnswer);
document.getElementById('addWordBtn').addEventListener('click', addWord);
document.getElementById('answerInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Initial setup
updateReviewCount();
displayReviewWord();
updateLibraryTable();