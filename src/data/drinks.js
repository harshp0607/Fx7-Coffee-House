// Centralized drink inventory
// Add new drinks here to automatically include them in the menu and inventory management

export const DRINKS = [
  {
    id: "peppermint-mocha",
    image: "/Image1@2x.JPG",
    drinkName: "Peppermint Mocha",
    description: "Dark chocolate with cool peppermint",
  },
  {
    id: "gingerbread-latte",
    image: "/Image2@2x.JPG",
    drinkName: "Gingerbread Latte",
    description: "Warm spices with sweet molasses",
  },
  {
    id: "cayenne-mocha-latte",
    image: "/IMG_1145.JPG",
    drinkName: "Cayenne Mocha Latte",
    description: "Creamy eggnog with rich espresso",
  },
  {
    id: "peppermint-mocha-latte",
    image: "/IMG_1145.JPG",
    drinkName: "Peppermint Mocha Latte",
    description: "Creamy eggnog with rich espresso",
  },
  {
    id: "graham-cracker-matcha",
    image: "/IMG_1145.JPG",
    drinkName: "Graham Cracker Matcha",
    description: "Creamy eggnog with rich espresso",
  },
];

// Export drink names for easy access
export const DRINK_NAMES = DRINKS.map(drink => drink.drinkName);
