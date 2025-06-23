class Quiz {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
                correct: 1
            },
            {
                question: "In which year did World War II end?",
                options: ["1943", "1944", "1945", "1946"],
                correct: 2
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            }
        ];
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.timeLeft = 30;
        this.timer = null;
        this.userAnswers = [];
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        // Screen elements
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Quiz elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.questionCounter = document.getElementById('question-counter');
        this.timerElement = document.getElementById('timer');
        this.progressFill = document.getElementById('progress');
        this.nextBtn = document.getElementById('next-btn');
        
        // Result elements
        this.finalScore = document.getElementById('final-score');
        this.scoreMessage = document.getElementById('score-message');
        this.resultsList = document.getElementById('results-list');
        
        // Button elements
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
    }
    
    startQuiz() {
        this.showScreen('quiz');
        this.loadQuestion();
        this.startTimer();
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        switch(screenName) {
            case 'start':
                this.startScreen.classList.add('active');
                break;
            case 'quiz':
                this.quizScreen.classList.add('active');
                break;
            case 'results':
                this.resultsScreen.classList.add('active');
                break;
        }
    }
    
    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question text
        this.questionText.textContent = question.question;
        
        // Update question counter
        this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Clear previous options
        this.optionsContainer.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(optionElement);
        });
        
        // Reset timer and selected answer
        this.timeLeft = 30;
        this.selectedAnswer = null;
        this.nextBtn.style.display = 'none';
        this.updateTimer();
    }
    
    selectOption(selectedIndex) {
        if (this.selectedAnswer !== null) return; // Already answered
        
        this.selectedAnswer = selectedIndex;
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        
        // Stop timer
        clearInterval(this.timer);
        
        // Store user answer
        this.userAnswers.push({
            question: question.question,
            selectedAnswer: selectedIndex,
            correctAnswer: question.correct,
            isCorrect: selectedIndex === question.correct
        });
        
        // Show correct/incorrect answers
        options.forEach((option, index) => {
            option.classList.add('disabled');
            
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        // Update score
        if (selectedIndex === question.correct) {
            this.score++;
        }
        
        // Show next button
        this.nextBtn.style.display = 'block';
        this.nextBtn.textContent = this.currentQuestionIndex === this.questions.length - 1 ? 'View Results' : 'Next Question';
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.loadQuestion();
            this.startTimer();
        } else {
            this.showResults();
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 10) {
                this.timerElement.classList.add('warning');
            }
            
            if (this.timeLeft === 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    updateTimer() {
        this.timerElement.textContent = `${this.timeLeft}s`;
        if (this.timeLeft > 10) {
            this.timerElement.classList.remove('warning');
        }
    }
    
    timeUp() {
        if (this.selectedAnswer === null) {
            // Auto-select wrong answer (or no answer)
            this.selectOption(-1); // Invalid index represents no answer
        }
    }
    
    showResults() {
        this.showScreen('results');
        
        // Update final score
        this.finalScore.textContent = `${this.score}/${this.questions.length}`;
        
        // Update score message
        const percentage = (this.score / this.questions.length) * 100;
        if (percentage >= 80) {
            this.scoreMessage.textContent = "Excellent! You're a quiz master! 🎉";
        } else if (percentage >= 60) {
            this.scoreMessage.textContent = "Good job! Keep up the great work! 👏";
        } else if (percentage >= 40) {
            this.scoreMessage.textContent = "Not bad! There's room for improvement. 📚";
        } else {
            this.scoreMessage.textContent = "Better luck next time! Practice makes perfect. 💪";
        }
        
        // Show results breakdown
        this.resultsList.innerHTML = '';
        this.userAnswers.forEach((answer, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
            
            const questionNumber = index + 1;
            const userAnswer = answer.selectedAnswer === -1 ? 'No answer' : this.questions[index].options[answer.selectedAnswer];
            const correctAnswer = this.questions[index].options[answer.correctAnswer];
            
            resultItem.innerHTML = `
                <div>
                    <strong>Q${questionNumber}:</strong> ${answer.question.substring(0, 50)}...
                    <br>
                    <small>Your answer: ${userAnswer}</small>
                    ${!answer.isCorrect ? `<br><small>Correct answer: ${correctAnswer}</small>` : ''}
                </div>
                <div class="result-status ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    ${answer.isCorrect ? '✓' : '✗'}
                </div>
            `;
            
            this.resultsList.appendChild(resultItem);
        });
        
        // Update progress bar to 100%
        this.progressFill.style.width = '100%';
    }
    
    restartQuiz() {
        // Reset all variables
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.timeLeft = 30;
        this.userAnswers = [];
        
        // Clear timer
        clearInterval(this.timer);
        
        // Show start screen
        this.showScreen('start');
        
        // Reset progress bar
        this.progressFill.style.width = '0%';
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});