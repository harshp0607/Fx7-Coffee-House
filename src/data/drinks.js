// Centralized drink inventory
// Add new drinks here to automatically include them in the menu and inventory management

export const DRINKS = [
  {
    id: "peppermint-mocha",
    image: "/peppermint-fx7.png",
    drinkName: "Peppermint Mocha Latte",
    description: "Dark chocolate with cool peppermint",
    category: "coffee"
  },
  {
    id: "gingerbread-latte",
    image: "/gingerbread-fx7.png",
    drinkName: "Chatpat(Gingerbread) Latte 🐻",
    description: "Warm spices with sweet molasses and ginger",
    category: "coffee"
  },
  {
    id: "cayenne-mocha-latte",
    image: "/cayenne-fx7.png",
    drinkName: "Cayenne Mocha Latte",
    description: "The same chocolatey goodness with a spicy kick",
    category: "coffee"
  },
  {
    id: "egg-nog-latte",
    image: "/eggnog-fx7.png",
    drinkName: "Egg Nog Latte",
    description: "Holiday classic with rich egg nog and warm spices",
    category: "coffee"
  },
  {
    id: "gingerbread-matcha",
    image: "/gingerbread-matcha-fx7.png",
    drinkName: "Gingerbread Matcha Latte",
    description: "Creamy matcha with gingerbread spices",
    category: "other"
  },
  {
    id: "hot-chocolate",
    image: "/hot-chocolate-fx7.png",
    drinkName: "Hot Chocolate",
    description: "Rich and creamy hot chocolate",
    category: "other"
  }
];

// Export drink names for easy access
export const DRINK_NAMES = DRINKS.map(drink => drink.drinkName);
