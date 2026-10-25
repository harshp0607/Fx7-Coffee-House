// Centralized drink inventory
// Add new drinks here to automatically include them in the menu and inventory management

export const DRINKS = [
  {
    id: "vanilla-cardamom-fig",
    image: "/coffee-latte.png",
    drinkName: "Vanilla Cardamom Fig",
    description: "Sweet fig and smooth vanilla with an aromatic Indian cardamom finish. A fall flavor with a distinctive twist.",
    category: "coffee"
  },
  {
    id: "maple-butter-pecan",
    image: "/coffee-latte.png",
    drinkName: "Maple Butter Pecan",
    description: "A classic butter pecan elevated with a bold maple twist. Toasted, buttery, and just sweet enough.",
    category: "coffee"
  },
  {
    id: "smoky-smores",
    image: "/coffee-cocoa.png",
    drinkName: "Smoky S'mores",
    description: "Chocolate, toasted marshmallow, and graham. Like s'mores around a campfire, with a subtle cayenne kick for heat.",
    category: "coffee"
  },
  {
    id: "pumpkin-masala-chai",
    image: "/coffee-spiced.png",
    drinkName: "Pumpkin Masala Chai",
    description: "The warmth of pumpkin spice meets the depth of masala chai. Cinnamon, ginger, cardamom, and a rich pumpkin base. Add a note to make it with espresso for a chai latte.",
    category: "other"
  }
];

// Export drink names for easy access
export const DRINK_NAMES = DRINKS.map(drink => drink.drinkName);
