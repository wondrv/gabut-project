class AdvancedRecipeFinder {
  constructor() {
    this.recipes = [];
    this.filteredRecipes = [];
    this.favorites =
      JSON.parse(localStorage.getItem("recipeFinderFavorites")) || [];
    this.mealPlan =
      JSON.parse(localStorage.getItem("recipeFinderMealPlan")) || {};
    this.groceryList =
      JSON.parse(localStorage.getItem("recipeFinderGroceryList")) || [];
    this.currentPage = 1;
    this.recipesPerPage = 12;
    this.currentQuery = "";
    this.currentFilters = {};
    this.isDarkTheme = localStorage.getItem("recipeFinderTheme") === "dark";

    this.init();
  }

  async init() {
    this.showLoadingScreen();
    await this.loadSampleRecipes();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.applyTheme();
    this.renderFavorites();
    this.renderMealPlan();
    this.renderGroceryList();
    this.hideLoadingScreen();
  }

  showLoadingScreen() {
    document.getElementById("loadingScreen").style.display = "flex";
  }

  hideLoadingScreen() {
    setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("app").style.display = "flex";
    }, 2000);
  }

  async loadSampleRecipes() {
    // Sample recipe data - In production, this would come from an API
    this.recipes = [
      {
        id: 1,
        title: "Creamy Garlic Parmesan Pasta",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc6d2c5f7?w=400",
        cookingTime: 25,
        servings: 4,
        difficulty: "easy",
        cuisine: "italian",
        diet: ["vegetarian"],
        mealType: ["lunch", "dinner"],
        rating: 4.8,
        ingredients: [
          "400g pasta",
          "300ml heavy cream",
          "100g parmesan cheese",
          "4 cloves garlic",
          "2 tbsp olive oil",
          "Salt and pepper to taste",
          "Fresh parsley",
        ],
        instructions: [
          "Cook pasta according to package instructions until al dente.",
          "In a large pan, heat olive oil and sauté minced garlic until fragrant.",
          "Add heavy cream and bring to a gentle simmer.",
          "Stir in grated parmesan cheese until melted and smooth.",
          "Toss with cooked pasta and season with salt and pepper.",
          "Garnish with fresh parsley and serve immediately.",
        ],
        tags: ["pasta", "creamy", "quick", "comfort food"],
      },
      {
        id: 2,
        title: "Grilled Chicken with Herbs",
        image:
          "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400",
        cookingTime: 30,
        servings: 4,
        difficulty: "medium",
        cuisine: "american",
        diet: ["keto", "low-carb"],
        mealType: ["lunch", "dinner"],
        rating: 4.6,
        ingredients: [
          "4 chicken breasts",
          "2 tbsp olive oil",
          "2 tsp dried oregano",
          "1 tsp dried thyme",
          "2 cloves garlic, minced",
          "1 lemon, juiced",
          "Salt and pepper",
        ],
        instructions: [
          "Marinate chicken in olive oil, herbs, garlic, and lemon juice for 30 minutes.",
          "Preheat grill to medium-high heat.",
          "Season chicken with salt and pepper.",
          "Grill chicken for 6-7 minutes per side until cooked through.",
          "Let rest for 5 minutes before serving.",
          "Serve with your favorite sides.",
        ],
        tags: ["chicken", "grilled", "healthy", "protein"],
      },
      {
        id: 3,
        title: "Vegan Buddha Bowl",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        cookingTime: 45,
        servings: 2,
        difficulty: "medium",
        cuisine: "asian",
        diet: ["vegan", "vegetarian", "gluten-free"],
        mealType: ["lunch", "dinner"],
        rating: 4.7,
        ingredients: [
          "1 cup quinoa",
          "200g tofu",
          "1 sweet potato",
          "100g kale",
          "1 avocado",
          "2 tbsp tahini",
          "1 tbsp soy sauce",
          "1 tsp sesame oil",
          "Seeds and nuts for topping",
        ],
        instructions: [
          "Cook quinoa according to package instructions.",
          "Roast cubed sweet potato at 400°F for 25 minutes.",
          "Pan-fry tofu until golden and crispy.",
          "Massage kale with a bit of oil and lemon juice.",
          "Prepare tahini dressing with tahini, soy sauce, and sesame oil.",
          "Assemble bowl with all ingredients and drizzle with dressing.",
        ],
        tags: ["vegan", "healthy", "bowl", "quinoa"],
      },
      {
        id: 4,
        title: "Classic Chocolate Chip Cookies",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
        cookingTime: 25,
        servings: 24,
        difficulty: "easy",
        cuisine: "american",
        diet: ["vegetarian"],
        mealType: ["snack", "dessert"],
        rating: 4.9,
        ingredients: [
          "2¼ cups all-purpose flour",
          "1 tsp baking soda",
          "1 tsp salt",
          "1 cup butter, softened",
          "¾ cup granulated sugar",
          "¾ cup brown sugar",
          "2 large eggs",
          "2 tsp vanilla extract",
          "2 cups chocolate chips",
        ],
        instructions: [
          "Preheat oven to 375°F (190°C).",
          "Mix flour, baking soda, and salt in a bowl.",
          "Cream butter and sugars until light and fluffy.",
          "Beat in eggs and vanilla extract.",
          "Gradually blend in flour mixture.",
          "Stir in chocolate chips.",
          "Drop rounded tablespoons onto ungreased cookie sheets.",
          "Bake 9-11 minutes until golden brown.",
        ],
        tags: ["cookies", "chocolate", "dessert", "baking"],
      },
      {
        id: 5,
        title: "Mediterranean Quinoa Salad",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        cookingTime: 20,
        servings: 6,
        difficulty: "easy",
        cuisine: "mediterranean",
        diet: ["vegetarian", "vegan", "gluten-free"],
        mealType: ["lunch", "dinner"],
        rating: 4.5,
        ingredients: [
          "2 cups quinoa",
          "1 cucumber, diced",
          "2 tomatoes, diced",
          "1 red onion, diced",
          "100g olives",
          "200g feta cheese",
          "¼ cup olive oil",
          "2 tbsp lemon juice",
          "Fresh herbs",
        ],
        instructions: [
          "Cook quinoa and let it cool completely.",
          "Dice all vegetables into small, uniform pieces.",
          "Crumble feta cheese into bite-sized pieces.",
          "Whisk together olive oil, lemon juice, salt, and pepper.",
          "Combine all ingredients in a large bowl.",
          "Toss with dressing and let marinate for 30 minutes.",
          "Garnish with fresh herbs before serving.",
        ],
        tags: ["salad", "quinoa", "mediterranean", "healthy"],
      },
      {
        id: 6,
        title: "Beef Stir Fry with Vegetables",
        image:
          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        cookingTime: 20,
        servings: 4,
        difficulty: "medium",
        cuisine: "chinese",
        diet: ["keto", "low-carb"],
        mealType: ["lunch", "dinner"],
        rating: 4.4,
        ingredients: [
          "500g beef strips",
          "2 bell peppers",
          "1 broccoli head",
          "2 carrots",
          "3 tbsp soy sauce",
          "2 tbsp oyster sauce",
          "1 tbsp cornstarch",
          "2 tbsp vegetable oil",
          "3 cloves garlic",
          "1 tsp ginger",
        ],
        instructions: [
          "Marinate beef in soy sauce and cornstarch for 15 minutes.",
          "Cut all vegetables into uniform pieces.",
          "Heat oil in a wok or large pan over high heat.",
          "Stir-fry beef until browned, then remove.",
          "Stir-fry vegetables starting with hardest ones first.",
          "Return beef to pan and add sauces.",
          "Toss everything together and serve immediately.",
        ],
        tags: ["stir-fry", "beef", "vegetables", "quick"],
      },
    ];

    // Add more sample recipes for demonstration
    this.addMoreSampleRecipes();
  }

  addMoreSampleRecipes() {
    const additionalRecipes = [
      {
        id: 7,
        title: "Homemade Pizza Margherita",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        cookingTime: 60,
        servings: 4,
        difficulty: "medium",
        cuisine: "italian",
        diet: ["vegetarian"],
        mealType: ["lunch", "dinner"],
        rating: 4.8,
        ingredients: [
          "Pizza dough",
          "Tomato sauce",
          "Fresh mozzarella",
          "Fresh basil",
          "Olive oil",
        ],
        instructions: [
          "Preheat oven to 500°F",
          "Roll out pizza dough",
          "Spread sauce and cheese",
          "Bake for 10-12 minutes",
        ],
        tags: ["pizza", "italian", "homemade"],
      },
      {
        id: 8,
        title: "Green Smoothie Bowl",
        image:
          "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
        cookingTime: 10,
        servings: 1,
        difficulty: "easy",
        cuisine: "american",
        diet: ["vegan", "vegetarian", "gluten-free"],
        mealType: ["breakfast"],
        rating: 4.6,
        ingredients: [
          "Spinach",
          "Banana",
          "Mango",
          "Coconut milk",
          "Chia seeds",
          "Berries",
        ],
        instructions: [
          "Blend spinach, banana, and coconut milk",
          "Pour into bowl",
          "Top with fruits and seeds",
        ],
        tags: ["smoothie", "healthy", "breakfast"],
      },
    ];

    this.recipes = [...this.recipes, ...additionalRecipes];
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchSection(e.target.dataset.section);
      });
    });

    // Search
    document
      .getElementById("searchBtn")
      .addEventListener("click", () => this.searchRecipes());
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.searchRecipes();
    });

    // Filters
    document.getElementById("filtersToggle").addEventListener("click", () => {
      const panel = document.getElementById("filtersPanel");
      panel.classList.toggle("show");
    });

    document
      .getElementById("clearFilters")
      .addEventListener("click", () => this.clearFilters());

    // Filter change events
    [
      "cuisineFilter",
      "dietFilter",
      "mealFilter",
      "timeFilter",
      "difficultyFilter",
    ].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("change", () => this.applyFilters());
    });

    // Categories
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const category = e.currentTarget.dataset.category;
        this.searchByCategory(category);
      });
    });

    // Sort
    document.getElementById("sortBy").addEventListener("change", (e) => {
      this.sortRecipes(e.target.value);
    });

    // Theme toggle
    document
      .getElementById("themeToggle")
      .addEventListener("click", () => this.toggleTheme());

    // Modal
    document
      .querySelector(".modal-close")
      .addEventListener("click", () => this.closeModal());
    document.getElementById("recipeModal").addEventListener("click", (e) => {
      if (e.target.id === "recipeModal") this.closeModal();
    });

    // Meal plan actions
    document
      .getElementById("generateMealPlan")
      .addEventListener("click", () => this.generateMealPlan());
    document
      .getElementById("clearMealPlan")
      .addEventListener("click", () => this.clearMealPlan());

    // Grocery list actions
    document
      .getElementById("addGroceryItem")
      .addEventListener("click", () => this.addGroceryItem());
    document
      .getElementById("newGroceryItem")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addGroceryItem();
      });
    document
      .getElementById("generateGroceryList")
      .addEventListener("click", () => this.generateGroceryListFromMealPlan());
    document
      .getElementById("clearGroceryList")
      .addEventListener("click", () => this.clearGroceryList());

    // Favorites
    document
      .getElementById("clearFavorites")
      .addEventListener("click", () => this.clearFavorites());

    // Load more
    document
      .getElementById("loadMoreBtn")
      .addEventListener("click", () => this.loadMoreRecipes());
  }

  setupDragAndDrop() {
    // Enable drag on recipe cards
    document.addEventListener("dragstart", (e) => {
      if (e.target.closest(".recipe-card")) {
        const recipeId = e.target.closest(".recipe-card").dataset.recipeId;
        e.dataTransfer.setData("text/plain", recipeId);
        e.target.closest(".recipe-card").classList.add("dragging");
      }
    });

    document.addEventListener("dragend", (e) => {
      if (e.target.closest(".recipe-card")) {
        e.target.closest(".recipe-card").classList.remove("dragging");
      }
    });

    // Handle drop on meal slots
    document.addEventListener("dragover", (e) => {
      if (e.target.closest(".meal-slot")) {
        e.preventDefault();
        e.target.closest(".meal-slot").classList.add("drag-over");
      }
    });

    document.addEventListener("dragleave", (e) => {
      if (e.target.closest(".meal-slot")) {
        e.target.closest(".meal-slot").classList.remove("drag-over");
      }
    });

    document.addEventListener("drop", (e) => {
      if (e.target.closest(".meal-slot")) {
        e.preventDefault();
        const mealSlot = e.target.closest(".meal-slot");
        mealSlot.classList.remove("drag-over");

        const recipeId = parseInt(e.dataTransfer.getData("text/plain"));
        const recipe = this.recipes.find((r) => r.id === recipeId);

        if (recipe) {
          const day = mealSlot.closest(".day-column").dataset.day;
          const meal = mealSlot.dataset.meal;
          this.addToMealPlan(day, meal, recipe);
        }
      }
    });
  }

  switchSection(section) {
    // Update navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${section}"]`)
      .classList.add("active");

    // Show section
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.remove("active");
    });
    document.getElementById(section).classList.add("active");
  }

  async searchRecipes() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    this.currentQuery = query;
    this.currentPage = 1;

    this.showLoading();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.filteredRecipes = this.recipes.filter((recipe) => {
      const searchText = `${recipe.title} ${recipe.tags.join(" ")} ${
        recipe.cuisine
      } ${recipe.diet.join(" ")}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    this.applyFilters();
    this.renderSearchResults();
    this.hideLoading();
  }

  searchByCategory(category) {
    document.getElementById("searchInput").value = category;
    this.searchRecipes();
  }

  applyFilters() {
    let filtered =
      this.filteredRecipes.length > 0 ? this.filteredRecipes : this.recipes;

    const cuisine = document.getElementById("cuisineFilter").value;
    const diet = document.getElementById("dietFilter").value;
    const meal = document.getElementById("mealFilter").value;
    const time = document.getElementById("timeFilter").value;
    const difficulty = document.getElementById("difficultyFilter").value;

    if (cuisine) {
      filtered = filtered.filter((recipe) => recipe.cuisine === cuisine);
    }

    if (diet) {
      filtered = filtered.filter((recipe) => recipe.diet.includes(diet));
    }

    if (meal) {
      filtered = filtered.filter((recipe) => recipe.mealType.includes(meal));
    }

    if (time) {
      filtered = filtered.filter(
        (recipe) => recipe.cookingTime <= parseInt(time)
      );
    }

    if (difficulty) {
      filtered = filtered.filter((recipe) => recipe.difficulty === difficulty);
    }

    this.filteredRecipes = filtered;
    this.renderSearchResults();
  }

  clearFilters() {
    document.getElementById("cuisineFilter").value = "";
    document.getElementById("dietFilter").value = "";
    document.getElementById("mealFilter").value = "";
    document.getElementById("timeFilter").value = "";
    document.getElementById("difficultyFilter").value = "";

    this.applyFilters();
    this.showNotification("Filters cleared");
  }

  sortRecipes(sortBy) {
    const sortFunctions = {
      relevance: () => 0, // Keep original order
      time: (a, b) => a.cookingTime - b.cookingTime,
      rating: (a, b) => b.rating - a.rating,
      popularity: (a, b) => b.rating * b.servings - a.rating * a.servings,
    };

    if (sortFunctions[sortBy]) {
      this.filteredRecipes.sort(sortFunctions[sortBy]);
      this.renderSearchResults();
    }
  }

  renderSearchResults() {
    const grid = document.getElementById("recipeGrid");
    const resultsHeader = document.querySelector(".results-header");
    const resultsCount = document.getElementById("resultsCount");

    if (this.filteredRecipes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-search"></i>
          <h3>No recipes found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      `;
      resultsHeader.style.display = "none";
      return;
    }

    resultsHeader.style.display = "flex";
    resultsCount.textContent = `Found ${this.filteredRecipes.length} recipes`;

    const recipesToShow = this.filteredRecipes.slice(
      0,
      this.currentPage * this.recipesPerPage
    );

    grid.innerHTML = recipesToShow
      .map((recipe) => this.createRecipeCard(recipe))
      .join("");

    // Show/hide load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (recipesToShow.length < this.filteredRecipes.length) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }

    this.attachRecipeCardEvents();
  }

  createRecipeCard(recipe) {
    const isFavorited = this.favorites.includes(recipe.id);

    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}" draggable="true">
        <div class="recipe-image">
          ${
            recipe.image
              ? `<img src="${recipe.image}" alt="${recipe.title}" onerror="this.style.display='none'">`
              : ""
          }
          <div class="fallback-image">
            <i class="fas fa-utensils"></i>
          </div>
        </div>
        <div class="recipe-info">
          <h3 class="recipe-title">${recipe.title}</h3>
          <div class="recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.cookingTime} min</span>
            <span><i class="fas fa-users"></i> ${recipe.servings}</span>
            <span><i class="fas fa-star"></i> ${recipe.rating}</span>
          </div>
          <div class="recipe-tags">
            ${recipe.tags
              .slice(0, 3)
              .map((tag) => `<span class="recipe-tag">${tag}</span>`)
              .join("")}
          </div>
          <div class="recipe-actions">
            <button class="btn-favorite ${
              isFavorited ? "favorited" : ""
            }" data-recipe-id="${recipe.id}">
              <i class="fas fa-heart"></i>
              ${isFavorited ? "Favorited" : "Favorite"}
            </button>
            <button class="btn-add-plan" data-recipe-id="${recipe.id}">
              <i class="fas fa-calendar-plus"></i>
              Add to Plan
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachRecipeCardEvents() {
    // Recipe card clicks
    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".recipe-actions")) {
          const recipeId = parseInt(card.dataset.recipeId);
          this.showRecipeDetails(recipeId);
        }
      });
    });

    // Favorite buttons
    document.querySelectorAll(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const recipeId = parseInt(btn.dataset.recipeId);
        this.toggleFavorite(recipeId);
      });
    });

    // Add to plan buttons
    document.querySelectorAll(".btn-add-plan").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const recipeId = parseInt(btn.dataset.recipeId);
        this.showMealPlanSelector(recipeId);
      });
    });
  }

  showRecipeDetails(recipeId) {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const modal = document.getElementById("recipeModal");
    const details = document.getElementById("recipeDetails");

    details.innerHTML = `
      <div class="recipe-header">
        ${
          recipe.image
            ? `<img src="${recipe.image}" alt="${recipe.title}">`
            : ""
        }
        <h2>${recipe.title}</h2>
        <div class="recipe-stats">
          <span><i class="fas fa-clock"></i> ${
            recipe.cookingTime
          } minutes</span>
          <span><i class="fas fa-users"></i> Serves ${recipe.servings}</span>
          <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
          <span><i class="fas fa-star"></i> ${recipe.rating}/5</span>
        </div>
      </div>
      <div class="recipe-content">
        <div class="ingredients-section">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${recipe.ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
          </ul>
        </div>
        <div class="instructions-section">
          <h3>Instructions</h3>
          <ol class="instructions-list">
            ${recipe.instructions
              .map((instruction) => `<li>${instruction}</li>`)
              .join("")}
          </ol>
        </div>
      </div>
    `;

    modal.classList.add("show");
  }

  closeModal() {
    document.getElementById("recipeModal").classList.remove("show");
  }

  toggleFavorite(recipeId) {
    const index = this.favorites.indexOf(recipeId);

    if (index > -1) {
      this.favorites.splice(index, 1);
      this.showNotification("Removed from favorites");
    } else {
      this.favorites.push(recipeId);
      this.showNotification("Added to favorites");
    }

    localStorage.setItem(
      "recipeFinderFavorites",
      JSON.stringify(this.favorites)
    );
    this.renderSearchResults();
    this.renderFavorites();
  }

  renderFavorites() {
    const grid = document.getElementById("favoritesGrid");
    const noFavorites = document.getElementById("noFavorites");

    if (this.favorites.length === 0) {
      grid.style.display = "none";
      noFavorites.style.display = "block";
      return;
    }

    grid.style.display = "grid";
    noFavorites.style.display = "none";

    const favoriteRecipes = this.recipes.filter((recipe) =>
      this.favorites.includes(recipe.id)
    );
    grid.innerHTML = favoriteRecipes
      .map((recipe) => this.createRecipeCard(recipe))
      .join("");

    this.attachRecipeCardEvents();
  }

  clearFavorites() {
    if (confirm("Are you sure you want to clear all favorites?")) {
      this.favorites = [];
      localStorage.setItem(
        "recipeFinderFavorites",
        JSON.stringify(this.favorites)
      );
      this.renderFavorites();
      this.showNotification("Favorites cleared");
    }
  }

  showMealPlanSelector(recipeId) {
    // Switch to meal plan section
    this.switchSection("meal-plan");

    // Highlight empty slots
    document.querySelectorAll(".meal-slot").forEach((slot) => {
      if (!slot.classList.contains("has-recipe")) {
        slot.style.animation = "pulse 1s infinite";
        setTimeout(() => {
          slot.style.animation = "";
        }, 3000);
      }
    });

    this.showNotification(
      "Drag the recipe to a meal slot or click on an empty slot"
    );
  }

  addToMealPlan(day, meal, recipe) {
    if (!this.mealPlan[day]) {
      this.mealPlan[day] = {};
    }

    this.mealPlan[day][meal] = recipe;
    localStorage.setItem("recipeFinderMealPlan", JSON.stringify(this.mealPlan));
    this.renderMealPlan();
    this.showNotification(`Added ${recipe.title} to ${day} ${meal}`);
  }

  renderMealPlan() {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const meals = ["breakfast", "lunch", "dinner"];

    days.forEach((day) => {
      meals.forEach((meal) => {
        const slot = document.querySelector(
          `[data-day="${day}"] [data-meal="${meal}"]`
        );
        const content = slot.querySelector(".meal-content");

        if (this.mealPlan[day] && this.mealPlan[day][meal]) {
          const recipe = this.mealPlan[day][meal];
          slot.classList.add("has-recipe");
          content.innerHTML = `
            <div class="meal-recipe">
              <div class="meal-recipe-title">${recipe.title}</div>
              <div class="meal-recipe-meta">${recipe.cookingTime} min • ${recipe.servings} servings</div>
              <button class="meal-recipe-remove" onclick="recipeFinder.removeFromMealPlan('${day}', '${meal}')">
                Remove
              </button>
            </div>
          `;
        } else {
          slot.classList.remove("has-recipe");
          content.innerHTML = "Drop recipe here";
        }
      });
    });
  }

  removeFromMealPlan(day, meal) {
    if (this.mealPlan[day] && this.mealPlan[day][meal]) {
      delete this.mealPlan[day][meal];
      if (Object.keys(this.mealPlan[day]).length === 0) {
        delete this.mealPlan[day];
      }
      localStorage.setItem(
        "recipeFinderMealPlan",
        JSON.stringify(this.mealPlan)
      );
      this.renderMealPlan();
      this.showNotification("Recipe removed from meal plan");
    }
  }

  generateMealPlan() {
    if (!confirm("This will replace your current meal plan. Continue?")) return;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const meals = ["breakfast", "lunch", "dinner"];

    // Filter recipes by meal type
    const breakfastRecipes = this.recipes.filter((r) =>
      r.mealType.includes("breakfast")
    );
    const lunchRecipes = this.recipes.filter((r) =>
      r.mealType.includes("lunch")
    );
    const dinnerRecipes = this.recipes.filter((r) =>
      r.mealType.includes("dinner")
    );

    this.mealPlan = {};

    days.forEach((day) => {
      this.mealPlan[day] = {
        breakfast: this.getRandomRecipe(
          breakfastRecipes.length > 0 ? breakfastRecipes : this.recipes
        ),
        lunch: this.getRandomRecipe(
          lunchRecipes.length > 0 ? lunchRecipes : this.recipes
        ),
        dinner: this.getRandomRecipe(
          dinnerRecipes.length > 0 ? dinnerRecipes : this.recipes
        ),
      };
    });

    localStorage.setItem("recipeFinderMealPlan", JSON.stringify(this.mealPlan));
    this.renderMealPlan();
    this.showNotification("Meal plan generated!");
  }

  getRandomRecipe(recipes) {
    return recipes[Math.floor(Math.random() * recipes.length)];
  }

  clearMealPlan() {
    if (confirm("Are you sure you want to clear the entire meal plan?")) {
      this.mealPlan = {};
      localStorage.setItem(
        "recipeFinderMealPlan",
        JSON.stringify(this.mealPlan)
      );
      this.renderMealPlan();
      this.showNotification("Meal plan cleared");
    }
  }

  addGroceryItem() {
    const input = document.getElementById("newGroceryItem");
    const item = input.value.trim();

    if (item) {
      this.groceryList.push({
        id: Date.now(),
        text: item,
        completed: false,
      });

      localStorage.setItem(
        "recipeFinderGroceryList",
        JSON.stringify(this.groceryList)
      );
      this.renderGroceryList();
      input.value = "";
      this.showNotification("Item added to grocery list");
    }
  }

  renderGroceryList() {
    const container = document.getElementById("groceryItems");
    const noItems = document.getElementById("noGroceryItems");

    if (this.groceryList.length === 0) {
      container.style.display = "none";
      noItems.style.display = "block";
      return;
    }

    container.style.display = "block";
    noItems.style.display = "none";

    container.innerHTML = this.groceryList
      .map(
        (item) => `
      <div class="grocery-item ${item.completed ? "completed" : ""}">
        <input type="checkbox" class="grocery-checkbox" ${
          item.completed ? "checked" : ""
        } 
               onchange="recipeFinder.toggleGroceryItem(${item.id})">
        <span class="grocery-text">${item.text}</span>
        <button class="grocery-remove" onclick="recipeFinder.removeGroceryItem(${
          item.id
        })">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
      )
      .join("");
  }

  toggleGroceryItem(id) {
    const item = this.groceryList.find((item) => item.id === id);
    if (item) {
      item.completed = !item.completed;
      localStorage.setItem(
        "recipeFinderGroceryList",
        JSON.stringify(this.groceryList)
      );
      this.renderGroceryList();
    }
  }

  removeGroceryItem(id) {
    this.groceryList = this.groceryList.filter((item) => item.id !== id);
    localStorage.setItem(
      "recipeFinderGroceryList",
      JSON.stringify(this.groceryList)
    );
    this.renderGroceryList();
    this.showNotification("Item removed");
  }

  generateGroceryListFromMealPlan() {
    const ingredients = new Set();

    Object.values(this.mealPlan).forEach((day) => {
      Object.values(day).forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          ingredients.add(ingredient);
        });
      });
    });

    if (ingredients.size === 0) {
      this.showNotification("No meal plan found to generate grocery list");
      return;
    }

    // Add unique ingredients to grocery list
    ingredients.forEach((ingredient) => {
      if (
        !this.groceryList.some(
          (item) => item.text.toLowerCase() === ingredient.toLowerCase()
        )
      ) {
        this.groceryList.push({
          id: Date.now() + Math.random(),
          text: ingredient,
          completed: false,
        });
      }
    });

    localStorage.setItem(
      "recipeFinderGroceryList",
      JSON.stringify(this.groceryList)
    );
    this.renderGroceryList();
    this.showNotification(
      `Added ${ingredients.size} ingredients to grocery list`
    );
  }

  clearGroceryList() {
    if (confirm("Are you sure you want to clear the grocery list?")) {
      this.groceryList = [];
      localStorage.setItem(
        "recipeFinderGroceryList",
        JSON.stringify(this.groceryList)
      );
      this.renderGroceryList();
      this.showNotification("Grocery list cleared");
    }
  }

  loadMoreRecipes() {
    this.currentPage++;
    this.renderSearchResults();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem(
      "recipeFinderTheme",
      this.isDarkTheme ? "dark" : "light"
    );
  }

  applyTheme() {
    const themeBtn = document.getElementById("themeToggle");

    if (this.isDarkTheme) {
      document.body.setAttribute("data-theme", "dark");
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.removeAttribute("data-theme");
      themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const text = document.getElementById("notificationText");

    text.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  showLoading() {
    // Could add a loading spinner here
    document.getElementById("searchBtn").innerHTML =
      '<i class="fas fa-spinner fa-spin"></i>';
  }

  hideLoading() {
    document.getElementById("searchBtn").innerHTML =
      '<i class="fas fa-search"></i>';
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.recipeFinder = new AdvancedRecipeFinder();
});

// Additional utility functions
function formatCookingTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export functions for external use
window.recipeFinder = null;

// Service Worker registration for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
