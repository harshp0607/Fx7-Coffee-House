// Centralized drink inventory
// Add new drinks here to automatically include them in the menu and inventory management

export const DRINKS = [
  {
    id: "pumpkin-masala-chai",
    image: "/coffee-spiced.png",
    drinkName: "Pumpkin Masala Chai",
    description: "The warmth of pumpkin spice meets the depth of masala chai — cinnamon, ginger, cardamom, and a rich pumpkin base",
    category: "other"
  },
  {
    id: "maple-butter-pecan",
    image: "/coffee-latte.png",
    drinkName: "Maple Butter Pecan",
    description: "A classic butter pecan elevated with a bold maple twist — toasted, buttery, and just sweet enough",
    category: "coffee"
  },
  {
    id: "smoky-smores",
    image: "/coffee-cocoa.png",
    drinkName: "Smoky S'mores",
    description: "Chocolate, toasted marshmallow, and graham — like s'mores around a campfire, with a subtle cayenne kick for heat",
    category: "coffee"
  },
  {
    id: "vanilla-cardamom-fig",
    image: "/coffee-latte.png",
    drinkName: "Vanilla Cardamom Fig",
    description: "Sweet fig and smooth vanilla with an aromatic Indian cardamom finish — a fall flavor with a distinctive twist",
    category: "other"
  }
];

// Export drink names for easy access
export const DRINK_NAMES = DRINKS.map(drink => drink.drinkName);
