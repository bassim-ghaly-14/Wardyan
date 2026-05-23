export const products = [
  {
    id: "rose-deluxe",
    name: "Rose Deluxe Bouquet",
    price: 450,
    image: "images/rose1.JPEG",
    // image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600",
    description: "Premium red roses arranged with baby's breath"
  },
  {
    id: "tulip-mix",
    name: "Tulip Mix",
    price: 320,
    image: "images/rose2.JPEG",
    // image: "https://images.unsplash.com/photo-1563241527-3004b7be0e8c?w=600",
    description: "Colorful tulips perfect for spring occasions"
  },
  {
    id: "lilies-elegant",
    name: "Elegant Lilies",
    price: 520,
    image: "images/rose3.JPEG",
    // image: "https://images.unsplash.com/photo-1591886817229-0c3c373d8413?w=600",
    description: "White lilies symbolizing purity and elegance"
  },
  {
    id: "sunflower-bright",
    name: "Sunflower Bright",
    price: 280,
    image: "images/rose4.JPEG",
    // image: "https://images.unsplash.com/photo-1470509037661-253afd7f4a56?w=600",
    description: "Cheerful sunflowers to brighten any day"
  }
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}