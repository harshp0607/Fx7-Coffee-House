// Centralized drink inventory
// Add new drinks here to automatically include them in the menu and inventory management

export const DRINKS = [
  {
    id: "pumpkin-spice-latte",
    image: "/pumpkin-spice-fx7.png",
    drinkName: "Pumpkin Spice Latte",
    description: "Warm pumpkin with cinnamon, nutmeg, and a hint of clove",
    category: "coffee"
  },
  {
    id: "apple-cider-latte",
    image: "/apple-cider-fx7.png",
    drinkName: "Apple Cider Latte",
    description: "Crisp apple cider blended with espresso and fall spices",
    category: "coffee"
  },
  {
    id: "maple-brown-sugar-latte",
    image: "/maple-fx7.png",
    drinkName: "Maple Brown Sugar Latte",
    description: "Rich maple syrup with toasted brown sugar and espresso",
    category: "coffee"
  },
  {
    id: "salted-caramel-latte",
    image: "/caramel-fx7.png",
    drinkName: "Salted Caramel Latte",
    description: "Buttery caramel with a touch of sea salt and espresso",
    category: "coffee"
  },
  {
    id: "chai-latte",
    image: "/chai-fx7.png",
    drinkName: "Harvest Chai Latte",
    description: "Bold chai spices with cardamom, ginger, and steamed milk",
    category: "other"
  },
  {
    id: "apple-cider",
    image: "/cider-fx7.png",
    drinkName: "Warm Apple Cider",
    description: "Classic warm cider with cinnamon sticks and orange zest",
    category: "other"
  }
];

// Export drink names for easy access
export const DRINK_NAMES = DRINKS.map(drink => drink.drinkName);
