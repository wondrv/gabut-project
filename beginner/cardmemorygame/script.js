// This event listener ensures the script runs only after the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    // Getting references to the DOM elements we'll need to interact with.
    const gameBoard = document.getElementById('game-board');
    const movesCountEl = document.getElementById('moves-count');
    const timerEl = document.getElementById('timer');
    const restartButton = document.getElementById('restart-button');
    const playAgainButton = document.getElementById('play-again-button');
    const winModal = document.getElementById('win-modal');

    // --- Game State Variables ---
    let cards = []; // Array to hold all card elements
    let firstCard = null; // Stores the first flipped card in a turn
    let secondCard = null; // Stores the second flipped card in a turn
    let lockBoard = false; // Prevents clicking more than two cards at once
    let moves = 0; // Counts the number of moves (pairs flipped)
    let matchedPairs = 0; // Counts the number of successfully matched pairs
    let timerInterval; // Will hold the interval ID for the game timer
    let seconds = 0; // Counts the seconds elapsed in the game

    // The set of emojis used for the cards. Each will be duplicated.
    const emojis = ['🚀', '🌟', '🤖', '👾', '👽', '🪐', '☄️', '🔭'];
    const cardValues = [...emojis, ...emojis]; // Creates pairs of each emoji

    // --- Functions ---

    /**
     * Shuffles an array in place using the Fisher-Yates (aka Knuth) algorithm.
     * @param {Array} array The array to be shuffled.
     * @returns {Array} The shuffled array.
     */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Creates the game board by shuffling the cards and generating the HTML for each one.
     */
    function createBoard() {
        // Prepare for a new game by resetting all state
        resetGame();
        const shuffledCards = shuffle(cardValues);

        // Create and append each card element to the game board
        shuffledCards.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card', 'relative', 'rounded-lg', 'shadow-md', 'w-full', 'h-full');
            card.dataset.value = value; // Store the emoji value in a data attribute
            
            // Create the front face of the card (the question mark)
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front', 'flex', 'items-center', 'justify-center', 'bg-gray-700', 'rounded-lg', 'text-4xl', 'md:text-5xl', 'text-cyan-400');
            cardFront.textContent = '?';

            // Create the back face of the card (the emoji)
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back', 'flex', 'items-center', 'justify-center', 'bg-gray-600', 'rounded-lg', 'text-4xl', 'md:text-5xl');
            cardBack.textContent = value;
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);

            gameBoard.appendChild(card);
            card.addEventListener('click', handleCardClick);
            cards.push(card);
        });
    }
    
    /**
     * Handles the logic when a card is clicked.
     */
    function handleCardClick() {
        // Ignore clicks if the board is locked or if the same card is clicked twice
        if (lockBoard) return;
        if (this === firstCard) return;

        // Start the timer on the very first move of the game
        if (moves === 0 && !timerInterval) { 
            startTimer();
        }

        this.classList.add('is-flipped');

        // Logic for the first and second card of a turn
        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true; // Lock the board to prevent more clicks
        
        incrementMoves();
        checkForMatch();
    }

    /**
     * Checks if the two flipped cards have the same emoji.
     */
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? disableCards() : unflipCards();
    }

    /**
     * If cards match, disable them from being clicked again and check for a win.
     */
    function disableCards() {
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
        
        matchedPairs++;
        if (matchedPairs === emojis.length) {
            // If all pairs are found, the game is won
            winGame();
        }

        resetBoard();
    }

    /**
     * If cards do not match, flip them back over after a short delay.
     */
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('is-flipped');
            secondCard.classList.remove('is-flipped');
            resetBoard();
        }, 1000);
    }

    /**
     * Resets the turn variables (firstCard, secondCard, lockBoard).
     */
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    /**
     * Increments the moves counter and updates the display.
     */
    function incrementMoves() {
        moves++;
        movesCountEl.textContent = moves;
    }

    /**
     * Starts the game timer.
     */
    function startTimer() {
        clearInterval(timerInterval); // Clear any existing timer just in case
        seconds = 0;
        timerEl.textContent = formatTime(seconds);
        timerInterval = setInterval(() => {
            seconds++;
            timerEl.textContent = formatTime(seconds);
        }, 1000);
    }
    
    /**
     * Stops the game timer.
     */
    function stopTimer() {
        clearInterval(timerInterval);
    }

    /**
     * Formats the total seconds into a MM:SS string.
     * @param {number} sec - The total seconds.
     * @returns {string} The formatted time string.
     */
    function formatTime(sec) {
        const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
        const seconds = (sec % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    /**
     * Handles the win condition, stopping the timer and showing the win modal.
     */
    function winGame() {
        stopTimer();
        const modalContent = winModal.querySelector('div');

        // Update the final stats in the modal
        document.getElementById('final-time').textContent = formatTime(seconds);
        document.getElementById('final-moves').textContent = moves;
        
        // Display the modal with a smooth transition
        winModal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.add('scale-100', 'opacity-100');
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 100);
    }

    /**
     * Resets all game state variables and UI elements to their initial state.
     */
    function resetGame() {
        gameBoard.innerHTML = '';
        cards = [];
        [firstCard, secondCard, lockBoard] = [null, null, false];
        [moves, matchedPairs, seconds] = [0, 0, 0];
        
        movesCountEl.textContent = '0';
        stopTimer();
        timerEl.textContent = '00:00';
        timerInterval = null;

        // Hide the win modal
        const modalContent = winModal.querySelector('div');
        winModal.classList.add('hidden');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
    }
    
    /**
     * Sets up a new game.
     */
    function startGame() {
        createBoard();
    }

    // --- Event Listeners ---
    // Wire up the buttons to the startGame function.
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);

    // --- Initial Game Start ---
    // Kicks everything off when the page loads.
    startGame();
});
