export interface Tip {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  category: string;
  image?: string;
}

export const tips: Tip[] = [
  {
    id: "1",
    title: "Always Use a Primer",
    content:
      "Primer creates a smooth base for your makeup, helps it last longer, and minimizes the appearance of pores. Apply it after moisturizer and before foundation for best results.",
    excerpt: "Primer creates a smooth base for your makeup and helps it last longer.",
    source: "Beauty Experts",
    category: "Makeup",
  },
  {
    id: "2",
    title: "The 10-Second Rule for Brushing",
    content:
      "Brush your hair for at least 10 seconds in each section to distribute natural oils from scalp to ends, promoting shine and health.",
    excerpt: "Brush each section for 10 seconds to distribute natural oils.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "3",
    title: "Drink Water Before Coffee",
    content:
      "Start your morning with a glass of water before your coffee to hydrate your skin. Hydration from within is the most effective skincare routine.",
    excerpt: "Hydrate with water before coffee for better skin.",
    source: "Skincare Science",
    category: "Skincare",
  },
  {
    id: "4",
    title: "Clean Your Makeup Brushes Weekly",
    content:
      "Dirty brushes harbor bacteria that can cause breakouts and skin irritation. Clean them weekly with mild soap and warm water.",
    excerpt: "Weekly brush cleaning prevents breakouts and irritation.",
    source: "Professional Makeup Artists",
    category: "Makeup",
  },
  {
    id: "5",
    title: "Sleep on a Silk Pillowcase",
    content:
      "Silk pillowcases reduce friction on your hair and skin, preventing wrinkles and hair breakage while you sleep.",
    excerpt: "Silk pillowcases prevent wrinkles and hair breakage.",
    source: "Beauty Sleep Institute",
    category: "Skincare",
  },
  {
    id: "6",
    title: "Exfoliate Gently, Not Aggressively",
    content:
      "Over-exfoliating damages your skin barrier. Limit physical exfoliation to 1-2 times per week and opt for gentle chemical exfoliants like lactic acid.",
    excerpt: "Limit exfoliation to 1-2 times per week to protect your skin barrier.",
    source: "Dermatology Today",
    category: "Skincare",
  },
  {
    id: "7",
    title: "Use Heat Protectant Every Time",
    content:
      "Always apply a heat protectant spray or serum before using hot tools. This prevents heat damage and keeps your hair healthy.",
    excerpt: "Always protect your hair from heat damage with a protectant spray.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "8",
    title: "Apply Sunscreen to Your Neck and Chest",
    content:
      "The neck and chest area often shows age faster than the face. Extend your sunscreen application down to your décolletage every day.",
    excerpt: "Don't forget sunscreen on your neck and chest to prevent aging.",
    source: "Skincare Science",
    category: "Skincare",
  },
  {
    id: "9",
    title: "Layer Skincare from Thinnest to Thickest",
    content:
      "Apply your skincare products in order of consistency: toner first, then serums, moisturizer, and finally oils. This ensures proper absorption.",
    excerpt: "Apply skincare from thinnest to thickest consistency for best absorption.",
    source: "Professional Estheticians",
    category: "Skincare",
  },
  {
    id: "10",
    title: "Curl Lashes Before Mascara",
    content:
      "Use an eyelash curler before applying mascara to open up your eyes. Hold for 10 seconds at the base, then squeeze gently toward the tips.",
    excerpt: "Curl lashes before mascara to make your eyes look bigger and brighter.",
    source: "Beauty Experts",
    category: "Makeup",
  },
  {
    id: "11",
    title: "Trim Your Hair Every 6-8 Weeks",
    content:
      "Regular trims prevent split ends from traveling up the hair shaft, keeping your hair looking healthy and promoting growth.",
    excerpt: "Regular trims every 6-8 weeks prevent split ends and promote growth.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "12",
    title: "Use Toner to Balance pH",
    content:
      "Toner restores your skin's pH balance after cleansing and preps it to absorb serums and moisturizers more effectively.",
    excerpt: "Toner restores pH balance and preps skin for better product absorption.",
    source: "Skincare Science",
    category: "Skincare",
  },
  {
    id: "13",
    title: "Apply Blush to the Apples of Your Cheeks",
    content:
      "Smile and apply blush to the apples of your cheeks, blending upward toward your temples for a natural, youthful glow.",
    excerpt: "Smile and apply blush to the apples of your cheeks for a natural glow.",
    source: "Professional Makeup Artists",
    category: "Makeup",
  },
  {
    id: "14",
    title: "Don't Pop Pimples",
    content:
      "Popping pimples can lead to scarring and spread bacteria. Instead, apply a spot treatment with salicylic acid or benzoyl peroxide.",
    excerpt: "Avoid popping pimples to prevent scarring and further breakouts.",
    source: "Dermatology Today",
    category: "Skincare",
  },
  {
    id: "15",
    title: "Deep Condition Once a Week",
    content:
      "Use a deep conditioning mask once a week to restore moisture, repair damage, and keep your hair soft and manageable.",
    excerpt: "Weekly deep conditioning restores moisture and repairs damage.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "16",
    title: "Set Your Makeup with Setting Spray",
    content:
      "A setting spray locks in your makeup look, prevents smudging, and keeps everything in place for hours. Mist evenly from about 8 inches away.",
    excerpt: "Setting spray locks in makeup and prevents smudging all day.",
    source: "Beauty Experts",
    category: "Makeup",
  },
  {
    id: "17",
    title: "Use Vitamin C Serum in the Morning",
    content:
      "Vitamin C serum protects your skin from environmental damage and brightens your complexion. Apply it after cleansing and before moisturizer.",
    excerpt: "Morning Vitamin C serum protects from environmental damage.",
    source: "Skincare Science",
    category: "Skincare",
  },
  {
    id: "18",
    title: "Massage Your Scalp Regularly",
    content:
      "Scalp massage stimulates blood flow, promotes hair growth, and helps distribute natural oils. Do it for 2-3 minutes while shampooing.",
    excerpt: "Scalp massage stimulates blood flow and promotes hair growth.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "19",
    title: "Choose the Right Foundation Shade",
    content:
      "Test foundation shades on your jawline rather than your hand. The right shade should disappear into your skin seamlessly.",
    excerpt: "Test foundation on your jawline for the perfect shade match.",
    source: "Professional Makeup Artists",
    category: "Makeup",
  },
  {
    id: "20",
    title: "Apply Eye Cream with Your Ring Finger",
    content:
      "Your ring finger applies the least pressure, making it ideal for the delicate eye area. Gently tap eye cream along the orbital bone.",
    excerpt: "Use your ring finger to gently apply eye cream without pulling skin.",
    source: "Skincare Science",
    category: "Skincare",
  },
  {
    id: "21",
    title: "Wash Your Face Before Bed",
    content:
      "Never sleep with makeup on. Sleeping in makeup clogs pores, causes breakouts, and accelerates skin aging.",
    excerpt: "Always remove makeup before bed to prevent breakouts and aging.",
    source: "Beauty Experts",
    category: "Skincare",
  },
  {
    id: "22",
    title: "Use Purple Shampoo for Blonde Hair",
    content:
      "Purple shampoo neutralizes brassy tones in blonde, silver, and gray hair. Use it once a week to keep your color fresh.",
    excerpt: "Purple shampoo neutralizes brassy tones in blonde and gray hair.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "23",
    title: "Bake Your Concealer",
    content:
      "Set concealer with a thick layer of translucent powder, let it sit for 5-10 minutes, then dust off. This brightens the under-eye area.",
    excerpt: "Baking concealer brightens the under-eye area for a flawless finish.",
    source: "Professional Makeup Artists",
    category: "Makeup",
  },
  {
    id: "24",
    title: "Change Your Pillowcase Every Week",
    content:
      "Pillowcases collect oil, dirt, and bacteria that transfer to your skin and hair. Change them weekly for clearer skin.",
    excerpt: "Weekly pillowcase changes reduce breakouts and keep skin clean.",
    source: "Dermatology Today",
    category: "Skincare",
  },
  {
    id: "25",
    title: "Apply Hair Mask Before Shampooing",
    content:
      "Apply a hair mask to dry hair 15-20 minutes before showering, then shampoo and condition as usual. This delivers deeper penetration.",
    excerpt: "Applying a hair mask before shampooing allows deeper moisture penetration.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "26",
    title: "Use a Damp Beauty Sponge for Foundation",
    content:
      "A damp beauty sponge creates a streak-free, airbrushed finish. Wet it, squeeze out excess water, then bounce it across your skin.",
    excerpt: "A damp beauty sponge gives foundation a streak-free, airbrushed finish.",
    source: "Beauty Experts",
    category: "Makeup",
  },
  {
    id: "27",
    title: "Add a Drop of Facial Oil to Foundation",
    content:
      "Mix a drop of facial oil into your foundation for a dewy, luminous finish. This works especially well for dry skin types.",
    excerpt: "Mixing facial oil into foundation creates a dewy, luminous finish.",
    source: "Professional Makeup Artists",
    category: "Makeup",
  },
  {
    id: "28",
    title: "Use Cold Water for Final Hair Rinse",
    content:
      "Rinsing your hair with cold water seals the hair cuticle, locking in moisture and adding shine. Do it after conditioning.",
    excerpt: "A cold water final rinse seals the hair cuticle for extra shine.",
    source: "Hair Care Weekly",
    category: "Hair",
  },
  {
    id: "29",
    title: "Apply Retinol Only at Night",
    content:
      "Retinol makes skin sensitive to sunlight. Apply it only in your nighttime routine and always wear sunscreen the next day.",
    excerpt: "Use retinol only at night and always wear sunscreen the next day.",
    source: "Dermatology Today",
    category: "Skincare",
  },
  {
    id: "30",
    title: "Keep Your Lip Balm Handy",
    content:
      "Hydrated lips are the foundation of any great lip look. Exfoliate gently and apply balm throughout the day to prevent chapping.",
    excerpt: "Keep lips hydrated with balm throughout the day to prevent chapping.",
    source: "Beauty Experts",
    category: "Makeup",
  },
];
