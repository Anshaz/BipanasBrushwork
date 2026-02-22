// src/data/etsyReviews.js
// Replace these sample reviews with your real Etsy reviews.
// Format:
// { id: 'r1', rating: 5, text: '...', name: 'First name', date: 'YYYY-MM-DD', listingTitle?: '...', listingUrl?: '...' }
//
// Tip (optional): If you later build a small backend or script to pull Etsy reviews,
// just output an array in this shape and import it here.

const ETSY_REVIEWS = [
  {
    id: 'r1',
    rating: 5,
    text: 'Amazing artwork of Everest. I wanted to customize the art little bit and the seller was kind enough to do it. It was also quickly shipped.',
    name: 'Lara',
    date: '2024-05-02',
    listingTitle: 'Textured Mount Everest Painting: Original Acrylic Sherpa Art',
    listingUrl: 'https://bipanaart.etsy.com/listing/1659158225'
  },
  {
    id: 'r2',
    rating: 5,
    text: 'A beautiful and excellent quality painting and received very quickly.',
    name: 'Matt',
    date: '2025-12-22',
    listingTitle: 'Mount Everest Acrylic Painting: Himalayan Landscape Art',
    listingUrl: 'https://bipanaart.etsy.com/listing/1659202939'
  },
  {
    id: 'r3',
    rating: 5,
    text: 'I ordered a custom-made piece, and it turned out absolutely fantastic! It even arrived a day before the agreed delivery date and looks fantastic! I am more than satisfied!',
    name: 'Peter',
    date: '2025-07-17',
    listingTitle: 'Custom Order: Mount Kilimanjaro Painting with Personal Touch',
    listingUrl: 'https://bipanaart.etsy.com/listing/1659202939'
  },
  {
    id: 'r4',
    rating: 5,
    text: 'Thank you for the beautiful painting of Mount Everest. The order was completed quickly and shipped on time.',
    name: 'Nischal',
    date: '2024-04-06',
    listingTitle: 'Textured Mount Everest Painting: Original Acrylic Sherpa Art',
    listingUrl: 'https://bipanaart.etsy.com/listing/1659158225'
  }
];

export default ETSY_REVIEWS;
