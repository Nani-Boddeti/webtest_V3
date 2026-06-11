export interface Tip {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  category: string;
  image?: string;
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
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
    id: 1,
    title: "The 10-Step Korean Skincare Routine Explained",
    excerpt: "Discover the famous Korean skincare routine that has taken the beauty world by storm.",
    content:
      "The Korean skincare routine involves ten steps: oil cleanser, foam cleanser, exfoliator, toner, essence, serum, sheet mask, eye cream, moisturizer, and sunscreen. Each step builds upon the last to create a flawless complexion.",
    category: "Skincare",
  },
  {
    id: 2,
    title: "How to Find Your Perfect Foundation Shade",
    excerpt: "Stop guessing and start matching with these professional tips for foundation selection.",
    content:
      "Finding your perfect foundation shade requires matching to your jawline rather than your wrist. Test shades in natural light and consider your undertone: warm, cool, or neutral.",
    category: "Makeup",
  },
  {
    id: 3,
    title: "Natural Hairstyles for Every Face Shape",
    excerpt: "Enhance your natural beauty with these flattering hairstyles tailored to your face shape.",
    content:
      "Different face shapes suit different hairstyles. Round faces benefit from long layers, square faces look great with soft waves, heart-shaped faces suit side-swept bangs, and oval faces can pull off almost any style.",
    category: "Hair",
  },
  {
    id: 4,
    title: "The Benefits of Vitamin C for Your Skin",
    excerpt: "Learn why Vitamin C is a powerhouse ingredient for brightening and protecting your skin.",
    content:
      "Vitamin C is a potent antioxidant that brightens skin, reduces hyperpigmentation, boosts collagen production, and protects against environmental damage. Use it in the morning under sunscreen for best results.",
    category: "Skincare",
  },
  {
    id: 5,
    title: "5-Minute Makeup Routine for Busy Mornings",
    excerpt: "Looking polished doesn't have to take hours. Try this quick routine for busy days.",
    content:
      "Focus on three key areas: brows (fill and set), lashes (curl and mascara), and lips (tinted balm). Add concealer only where needed and a cream blush for a fresh look. Done in five minutes flat.",
    category: "Makeup",
  },
  {
    id: 6,
    title: "How to Grow Long, Healthy Hair Naturally",
    excerpt: "Simple lifestyle changes that promote hair growth and strength.",
    content:
      "Healthy hair growth starts from within. Eat a protein-rich diet, take biotin supplements, avoid heat styling, trim regularly, and use a silk pillowcase to reduce breakage while you sleep.",
    category: "Hair",
  },
  {
    id: 7,
    title: "The Ultimate Guide to Face Serums",
    excerpt: "Everything you need to know about incorporating serums into your skincare routine.",
    content:
      "Serums deliver concentrated active ingredients deep into the skin. Choose based on your concern: hyaluronic acid for hydration, niacinamide for pores, retinol for anti-aging, and vitamin C for brightness.",
    category: "Skincare",
  },
  {
    id: 8,
    title: "Contouring & Highlighting for Beginners",
    excerpt: "Master the art of sculpting your face with this beginner-friendly guide.",
    content:
      "Contour creates shadows while highlight brings features forward. Use a shade 2-3 tones darker than your skin for contour and a luminous shade for highlight. Blend thoroughly for a natural look.",
    category: "Makeup",
  },
  {
    id: 9,
    title: "How to Style Curly Hair Without Heat",
    excerpt: "Embrace your natural curls with these no-heat styling techniques.",
    content:
      "Apply a leave-in conditioner and curl cream to damp hair, then scrunch upwards. Use a microfiber towel to reduce frizz and let hair air-dry or use a diffuser on low heat for defined curls.",
    category: "Hair",
  },
  {
    id: 10,
    title: "Nighttime Skincare Rituals for Glowing Skin",
    excerpt: "Wake up to radiant skin with these essential nighttime skincare steps.",
    content:
      "Your skin repairs itself at night. Double cleanse, apply treatments (retinol or peptides), use a rich night cream, sleep on a silk pillowcase, and never skip your eye cream for morning brightness.",
    category: "Skincare",
  },
  {
    id: 11,
    title: "Best Lip Colors for Your Skin Tone",
    excerpt: "Find your perfect lip shade with this comprehensive guide to lip color selection.",
    content:
      "Fair skin: pink and peach tones. Medium skin: rose and berry shades. Olive skin: mauve and wine colors. Dark skin: deep reds, plums, and bright fuchsias. Always consider your undertone.",
    category: "Makeup",
  },
  {
    id: 12,
    title: "How to Prevent Hair Breakage and Split Ends",
    excerpt: "Stop breakage in its tracks with these essential hair care tips.",
    content:
      "Regular trims every 6-8 weeks, deep conditioning treatments weekly, avoiding tight hairstyles, using a wide-tooth comb on wet hair, and sleeping with a loose braid can significantly reduce breakage.",
    category: "Hair",
  },
  {
    id: 13,
    title: "The Complete Guide to Sunscreen for Face",
    excerpt: "Protect your skin from aging and damage with the right sunscreen routine.",
    content:
      "Use a broad-spectrum SPF 30+ daily, even indoors. Apply as the last step of your skincare routine and reapply every two hours when outdoors. Mineral sunscreens are great for sensitive skin.",
    category: "Skincare",
  },
  {
    id: 14,
    title: "Eye Makeup Tips for Hooded Eyes",
    excerpt: "Enhance your hooded eyes with these specially designed makeup techniques.",
    content:
      "Apply deeper shades slightly above the crease to create the illusion of more lid space. Use matte shadows on the crease and shimmer on the center of the lid. Curl lashes and use waterproof mascara.",
    category: "Makeup",
  },
  {
    id: 15,
    title: "How to Choose the Right Hairbrush for Your Hair Type",
    excerpt: "The right brush can transform your hair care routine. Here's how to choose.",
    content:
      "Fine hair: boar bristle brush. Thick hair: paddle brush with cushioned base. Curly hair: wide-tooth comb or Denman brush. Wet hair: detangling brush with flexible bristles.",
    category: "Hair",
  },
  {
    id: 16,
    title: "Understanding Your Skin Type: A Practical Guide",
    excerpt: "Know your skin type to choose the right products and routine for your needs.",
    content:
      "The four main skin types are normal, oily, dry, and combination. Oily skin benefits from gel cleansers, dry skin needs cream-based products, combination skin requires balancing formulas.",
    category: "Skincare",
  },
  {
    id: 17,
    title: "How to Make Your Makeup Last All Day",
    excerpt: "Keep your makeup looking fresh from morning to night with these pro tips.",
    content:
      "Start with a primer suited to your skin type, use setting spray between layers, apply powder only to oily areas, and carry blotting papers for midday touch-ups without disturbing your makeup.",
    category: "Makeup",
  },
  {
    id: 18,
    title: "DIY Hair Masks for Damaged Hair",
    excerpt: "Restore your hair's health with these simple homemade treatments.",
    content:
      "A coconut oil and honey mask provides deep moisture. Avocado and egg mask adds protein strength. Aloe vera and yogurt mask soothes the scalp. Apply weekly for best results.",
    category: "Hair",
  },
  {
    id: 19,
    title: "Retinol 101: How to Start Using Retinol Safely",
    excerpt: "Everything beginners need to know about incorporating retinol into their routine.",
    content:
      "Start with a low concentration (0.25%-0.5%) twice a week, gradually increasing frequency. Apply at night on clean, dry skin. Always use sunscreen in the morning as retinol increases sun sensitivity.",
    category: "Skincare",
  },
  {
    id: 20,
    title: "The Art of Eyebrow Shaping",
    excerpt: "Perfect your brows with these professional shaping techniques.",
    content:
      "The arch should peak at the outer edge of your iris. Use tweezers for precise removal, following the natural shape. Fill with light strokes using a brow pencil that matches your hair color.",
    category: "Makeup",
  },
  {
    id: 21,
    title: "How to Add Volume to Fine Hair",
    excerpt: "Transform limp locks into voluminous hair with these expert tips.",
    content:
      "Use a volumizing shampoo and conditioner, apply mousse at the roots, blow-dry upside down, use velcro rollers, and finish with a texturizing spray for long-lasting volume.",
    category: "Hair",
  },
  {
    id: 22,
    title: "Morning vs. Evening Skincare: What's the Difference?",
    excerpt: "Optimize your routine by understanding what your skin needs at different times.",
    content:
      "Morning skincare focuses on protection: cleanse, vitamin C, moisturize, SPF. Evening focuses on repair: double cleanse, treatments (retinol/acids), rich moisturizer. Never use retinol in the morning.",
    category: "Skincare",
  },
  {
    id: 23,
    title: "How to Apply False Lashes Like a Pro",
    excerpt: "Master the tricky art of false lash application with these step-by-step tips.",
    content:
      "Measure and trim lashes to fit your eye shape. Apply thin glue along the band, wait 30 seconds for it to become tacky, then place as close to your natural lash line as possible.",
    category: "Makeup",
  },
  {
    id: 24,
    title: "Best Hair Colors for Your Skin Tone",
    excerpt: "Find the most flattering hair color to complement your complexion.",
    content:
      "Cool skin tones: ash blonde, cool brown, burgundy. Warm skin tones: golden blonde, chestnut, copper. Neutral skin tones: beige blonde, chocolate brown, rose gold.",
    category: "Hair",
  },
  {
    id: 25,
    title: "How to Build a Capsule Makeup Collection",
    excerpt: "Streamline your makeup bag with these versatile essentials.",
    content:
      "A capsule collection includes: tinted moisturizer or foundation, concealer, cream blush, brow pencil, mascara, a neutral eyeshadow palette, and a versatile lip color. Quality over quantity.",
    category: "Makeup",
  },
  {
    id: 26,
    title: "The Benefits of Facial Massage for Glowing Skin",
    excerpt: "Improve circulation and reduce puffiness with simple facial massage techniques.",
    content:
      "Facial massage boosts lymphatic drainage, reduces tension, improves product absorption, and promotes a natural glow. Use gentle upward motions with a jade roller or gua sha tool daily.",
    category: "Skincare",
  },
  {
    id: 27,
    title: "How to Prevent Makeup from Creasing",
    excerpt: "Say goodbye to creased eyeshadow and foundation with these simple tricks.",
    content:
      "Use an eye primer before shadow, set concealer with powder immediately, avoid heavy creams around eyes, and use setting spray to lock everything in place for crease-free wear.",
    category: "Makeup",
  },
  {
    id: 28,
    title: "Heat Protection Tips for Healthy Hair",
    excerpt: "Protect your hair from heat damage while still using your favorite styling tools.",
    content:
      "Always apply a heat protectant spray before any heat styling. Keep tools below 400°F, use ceramic or tourmaline tools, and limit heat styling to 2-3 times per week at most.",
    category: "Hair",
  },
  {
    id: 29,
    title: "Hydrating Skincare Ingredients You Need to Know",
    excerpt: "Discover the best ingredients for keeping your skin plump and hydrated.",
    content:
      "Key hydrating ingredients: hyaluronic acid (holds 1000x its weight in water), glycerin, ceramides (barrier repair), squalane (lightweight moisture), and panthenol (soothing hydration).",
    category: "Skincare",
  },
  {
    id: 30,
    title: "Transitioning Your Makeup from Day to Night",
    excerpt: "Take your look from office to evening with these quick transformation tips.",
    content:
      "Intensify your eye look by adding a darker shadow to the outer corner, apply a bold lip, add highlighter to cheekbones, and set with a dewy setting spray for an instant evening upgrade.",
    category: "Makeup",
  },
];
import { Tip } from "@/types/tip";
import tipsData from "./tips.json";

export const tips: Tip[] = tipsData as Tip[];

export function getTipById(id: string): Tip | undefined {
  return tips.find((tip) => tip.id === id);
}

export function getTipsByCategory(category: string): Tip[] {
  return tips.filter(
    (tip) => tip.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(): string[] {
  const categorySet = new Set(tips.map((tip) => tip.category));
  return Array.from(categorySet).sort();
}

export function getFeaturedTips(): Tip[] {
  return tips.slice(0, 6);
}
