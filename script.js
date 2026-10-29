const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Motivation"
  },
  {
    text: "Great things are done by a series of small things brought together.",
    author: "Vincent van Gogh",
    category: "Growth"
  },
  {
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    category: "Wisdom"
  },
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Motivation"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "Growth"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "Wisdom"
  },
  {
    text: "Everything you can imagine is real.",
    author: "Pablo Picasso",
    category: "Creativity"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Motivation"
  },
  {
    text: "Small progress is still progress.",
    author: "Unknown",
    category: "Growth"
  },
  {
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey",
    category: "Wisdom"
  },
  {
    text: "You can't use up creativity. The more you use, the more you have.",
    author: "Maya Angelou",
    category: "Creativity"
  }
];

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const quoteNumber = document.getElementById("quote-number");
const categorySelect = document.getElementById("category-select");
const feedback = document.getElementById("feedback");

const newQuoteButton = document.getElementById("new-quote-button");
const copyButton = document.getElementById("copy-button");
const favoriteButton = document.getElementById("favorite-button");
const shareButton = document.getElementById("share-button");
const favoriteCount = document.getElementById("favorite-count");
const favoritesList = document.getElementById("favorites-list");
const clearFavoritesButton = document.getElementById("clear-favorites-button");

let currentQuote = quotes[0];
let previousQuoteText = "";
let favorites = JSON.parse(localStorage.getItem("quotespace-favorites") || "[]");

function getFilteredQuotes() {
  const category = categorySelect.value;

  if (category === "All") {
    return quotes;
  }

  return quotes.filter(quote => quote.category === category);
}

function displayQuote(quote) {
  currentQuote = quote;
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = "— " + quote.author;

  const filteredQuotes = getFilteredQuotes();
  const position = filteredQuotes.findIndex(item => item.text === quote.text);

  quoteNumber.textContent =
    String(position + 1).padStart(2, "0") +
    " / " +
    String(filteredQuotes.length).padStart(2, "0");

  updateFavoriteButton();
  feedback.textContent = "";
}

function generateQuote() {
  const filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) return;

  let availableQuotes = filteredQuotes.filter(
    quote => quote.text !== previousQuoteText
  );

  if (availableQuotes.length === 0) {
    availableQuotes = filteredQuotes;
  }

  const nextQuote =
    availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

  previousQuoteText = currentQuote.text;
  displayQuote(nextQuote);
}

function updateFavoriteButton() {
  const isSaved = favorites.some(item => item.text === currentQuote.text);
  favoriteButton.textContent = isSaved ? "♥" : "♡";
  favoriteButton.setAttribute(
    "aria-label",
    isSaved ? "Remove from favorites" : "Save quote to favorites"
  );
}

function saveFavorites() {
  localStorage.setItem("quotespace-favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  favoriteCount.textContent = favorites.length;
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "Your favorite quotes will appear here. Tap ♡ to save one.";
    favoritesList.appendChild(emptyMessage);
    return;
  }

  favorites.forEach(quote => {
    const item = document.createElement("article");
    item.className = "favorite-item";

    const text = document.createElement("p");
    text.textContent = "“" + quote.text + "”";

    const author = document.createElement("span");
    author.textContent = "— " + quote.author;

    const removeButton = document.createElement("button");
    removeButton.className = "text-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      favorites = favorites.filter(saved => saved.text !== quote.text);
      saveFavorites();
      renderFavorites();
      updateFavoriteButton();
    });

    item.append(text, author, removeButton);
    favoritesList.appendChild(item);
  });
}

newQuoteButton.addEventListener("click", generateQuote);

categorySelect.addEventListener("change", () => {
  const filteredQuotes = getFilteredQuotes();
  previousQuoteText = "";
  displayQuote(filteredQuotes[0]);
});

favoriteButton.addEventListener("click", () => {
  const index = favorites.findIndex(item => item.text === currentQuote.text);

  if (index >= 0) {
    favorites.splice(index, 1);
    feedback.textContent = "Removed from your favorites.";
  } else {
    favorites.push(currentQuote);
    feedback.textContent = "Quote saved to your favorites.";
  }

  saveFavorites();
  renderFavorites();
  updateFavoriteButton();
});

copyButton.addEventListener("click", async () => {
  const text = `“${currentQuote.text}” — ${currentQuote.author}`;

  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = "Quote copied to clipboard!";
  } catch {
    feedback.textContent = "Copy isn't available in this browser.";
  }
});

shareButton.addEventListener("click", async () => {
  const text = `“${currentQuote.text}” — ${currentQuote.author}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "QuoteSpace", text });
    } catch (error) {
      if (error.name !== "AbortError") {
        feedback.textContent = "Unable to share this quote right now.";
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      feedback.textContent = "Quote copied! You can paste it to share.";
    } catch {
      feedback.textContent = text;
    }
  }
});

clearFavoritesButton.addEventListener("click", () => {
  if (favorites.length === 0) {
    feedback.textContent = "You haven't saved any favorites yet.";
    return;
  }

  if (confirm("Clear all saved favorite quotes?")) {
    favorites = [];
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
    feedback.textContent = "All favorites cleared.";
  }
});

displayQuote(currentQuote);
renderFavorites();