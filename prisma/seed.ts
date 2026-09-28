import { PrismaClient, UserRole, GalleryCategory, BlogPostStatus, ReservationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Élaia database seeding...");

  // 1. Clean existing records (in dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurantSettings.deleteMany();

  // 2. Users (Admin and Staff)
  const adminPassword = await bcrypt.hash("ElaiaAdmin2024!", 10);
  const staffPassword = await bcrypt.hash("ElaiaStaff2024!", 10);

  await prisma.user.create({
    data: {
      email: "admin@elaia-table.com",
      name: "Dimitri Thorne",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: "staff@elaia-table.com",
      name: "Callista Vance",
      passwordHash: staffPassword,
      role: UserRole.STAFF,
    },
  });
  console.log("✅ Seeded Admin & Staff users");

  // 3. Restaurant Settings
  await prisma.restaurantSettings.create({
    data: {
      id: "default",
      restaurantName: "Élaia Mediterranean Table",
      tagline: "Rooted in Heritage & Sun-Drenched Soil",
      address: "428 Coastal Vista Way, Marina Promenade, Waterfront District",
      phone: "+1 (800) 555-3524",
      email: "reservations@elaia-table.com",
      timezone: "America/New_York",
      slotLengthMinutes: 30,
      maxPartySize: 12,
      maxDaysAhead: 30,
      capacityPerSlot: 40,
      openingHours: JSON.stringify({
        monday: { open: "11:30", close: "22:30", isClosed: false },
        tuesday: { open: "11:30", close: "22:30", isClosed: false },
        wednesday: { open: "11:30", close: "22:30", isClosed: false },
        thursday: { open: "11:30", close: "23:00", isClosed: false },
        friday: { open: "11:30", close: "23:30", isClosed: false },
        saturday: { open: "11:00", close: "23:30", isClosed: false },
        sunday: { open: "11:00", close: "22:00", isClosed: false },
      }),
      socialLinks: JSON.stringify({
        instagram: "https://instagram.com/elaiatable",
        facebook: "https://facebook.com/elaiatable",
        tripadvisor: "https://tripadvisor.com",
      }),
    },
  });
  console.log("✅ Seeded Restaurant Settings");

  // 4. Menu Categories
  const categoriesData = [
    { name: "Mezze & Spreads", slug: "mezze", displayOrder: 1 },
    { name: "Hearth & Grills", slug: "grills", displayOrder: 2 },
    { name: "Aegean Seafood", slug: "seafood", displayOrder: 3 },
    { name: "Salads & Garden", slug: "salads", displayOrder: 4 },
    { name: "Sweet Endings", slug: "desserts", displayOrder: 5 },
    { name: "Cocktails & Cellar", slug: "wines", displayOrder: 6 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.menuCategory.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log("✅ Seeded Menu Categories");

  // 5. Menu Items (with authentic photos from Stitch designs)
  const menuItemsData = [
    {
      name: "Charred Aegean Octopus & Fava Santorinis",
      slug: "charred-aegean-octopus",
      description:
        "Hand-selected Mediterranean octopus is braised gently with bay leaves, red wine vinegar, and peppercorns for 3 hours, then seared over burning olive wood coals for caramelization. Served over velvet Santorini yellow split pea purée, pickled shallots, caper leaves, and cold-pressed Kalamata olive oil.",
      ingredients: JSON.stringify(["Wild Aegean Octopus", "Santorini Fava", "Caper Leaves", "Pickled Shallots", "Cold-Pressed Kalamata Olive Oil", "Smoked Paprika"]),
      price: 28.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATG1kgo_DXFmuq9YQqtF96zI1S36XPWMRHt7JnaeCd-mmB6odsN6nyMxXwZgW1hAanHfoQQrnJkBvDTUiJ7ZjcoMe1wv_hcQOVwnv-S0ma9Fnb7q0f8r6yChbvHB0xp8FabMkCsjDH0LacSrAKuCxid_4OUsFf1RBBHwp_Ic-mxbkacz0DuOlXqBXFQcgiDqnaNUPSdzR7RXO33cWyDhddrQ_9YMcO887DqKavS828x8g8cyBrgKLpFQ",
      categoryId: categoryMap.get("mezze")!,
      dietaryTags: JSON.stringify(["Gluten-Free", "High-Protein"]),
      allergens: JSON.stringify(["Molluscs"]),
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "Spanakopita Phyllo Triangles",
      slug: "spanakopita-triangles",
      description:
        "Wild mountain greens, barrel-aged Dodoni feta, fresh dill, and spring leeks encased in paper-thin handcrafted phyllo pastry, baked golden with toasted sesame seeds.",
      ingredients: JSON.stringify(["Wild Mountain Greens", "Barrel-Aged Feta", "Handmade Phyllo", "Fresh Dill", "Toasted Sesame"]),
      price: 14.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIyLORWfveWDjms9NRKUc8iIon7LOa03jET02tqpOKwHbqo8IrmFv6s8mgXdm45D7LXGQcd0zHh_xssI6-ITeKZMK5jM5WpoK5Z1te2iZ7Vc8-Sd8lSh7YbIbw7b_iQHzXnCNHrMsydAtjQMw7l8iUDvmtVm2a9B54jiH0EwIy_gUDv14quukgCk2dqc8jKaby9aZQ52T62RHkC-pMYSofLa8T-PvKiH7zdDzR5X6B2hreoQKDgg-g0w",
      categoryId: categoryMap.get("mezze")!,
      dietaryTags: JSON.stringify(["Vegetarian"]),
      allergens: JSON.stringify(["Gluten", "Dairy", "Sesame"]),
      isAvailable: true,
      isFeatured: false,
      displayOrder: 2,
    },
    {
      name: "Santorini Tomato Fritters (Domatokeftedes)",
      slug: "santorini-tomato-fritters",
      description:
        "Sweet sun-ripened Santorini cherry tomatoes, wild spearmint, crushed coriander, and sweet red onions, crisped in extra virgin olive oil with whipped mint tzatziki.",
      ingredients: JSON.stringify(["Santorini Cherry Tomatoes", "Wild Spearmint", "Crushed Coriander", "Sweet Onion", "Whipped Tzatziki"]),
      price: 16.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsZn0BM7rbpECPo8v-OUb5wc8FNTOlGvAxcDf0iwvIzwCc8dgxdeLAjuVAzhNKzWULq2L_Ry-g4nC-EuWR3Jcner_gT6v44vlXnUYIh3im_puxncj2BSrj-4YSwvZr-NPgODl9Ku6vcEasxd0hWrvvJ49sSoGdv6kfuTbRMeej5JL4WC7_itrU5cr9rCIx3jK4R489mmZvB19geAPrU6l8S3GXk5miByT-w9h-DGNZfOI--JFT8IfYnw",
      categoryId: categoryMap.get("mezze")!,
      dietaryTags: JSON.stringify(["Vegetarian"]),
      allergens: JSON.stringify(["Dairy", "Gluten"]),
      isAvailable: true,
      isFeatured: false,
      displayOrder: 3,
    },
    {
      name: "Cast-Iron Lamb Kebab",
      slug: "cast-iron-lamb-kebab",
      description:
        "Charcoal-skewered spiced minced pasture-raised lamb paired with sumac-dusted red onion salad, charred sweet peppers, and warm fire-blistered house pita drizzled with herb tallow.",
      ingredients: JSON.stringify(["Pasture-Raised Lamb", "Sumac", "Wood-Fired Pita", "Charred Sweet Peppers", "Herb Tallow", "Tahini"]),
      price: 26.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDsvxq0auen0G22uNREaC6la9P1XxdWO8XdbjKSiuHXfaf-h9dh9WRRi-QZWk2ABIzlGbzsu_zwyjDF4nxGXD_wbdH8XNSkNeXBbWyxJjdno5-TFUuyqa0wXt5XOpFyIZgVL8vZX_9mXvg8v3-U3UvJQPByxEeypzKTaZJPULhS3sBbMIgBHb3t48spAe8ygfYSlarMbtaUrgVnJx3DNToeWi-dye8wfX09BDAB1WCz0Ttj_saTFdtIHQ",
      categoryId: categoryMap.get("grills")!,
      dietaryTags: JSON.stringify(["Halal", "High-Protein"]),
      allergens: JSON.stringify(["Gluten", "Sesame"]),
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "Salt-Crusted Aegean Branzino",
      slug: "aegean-branzino",
      description:
        "Whole wild Mediterranean sea bass baked inside a sea salt crust with Meyer lemon and wild oregano, filleted tableside with braised wild chicory greens (horta) and ladolemono sauce.",
      ingredients: JSON.stringify(["Wild Sea Bass", "Aegean Sea Salt Crust", "Meyer Lemon", "Wild Oregano", "Braised Horta", "Extra Virgin Olive Oil"]),
      price: 36.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATG1kgo_DXFmuq9YQqtF96zI1S36XPWMRHt7JnaeCd-mmB6odsN6nyMxXwZgW1hAanHfoQQrnJkBvDTUiJ7ZjcoMe1wv_hcQOVwnv-S0ma9Fnb7q0f8r6yChbvHB0xp8FabMkCsjDH0LacSrAKuCxid_4OUsFf1RBBHwp_Ic-mxbkacz0DuOlXqBXFQcgiDqnaNUPSdzR7RXO33cWyDhddrQ_9YMcO887DqKavS828x8g8cyBrgKLpFQ",
      categoryId: categoryMap.get("seafood")!,
      dietaryTags: JSON.stringify(["Gluten-Free", "Pescatarian"]),
      allergens: JSON.stringify(["Fish"]),
      isAvailable: true,
      isFeatured: false,
      displayOrder: 1,
    },
    {
      name: "Horiatiki Village Salad",
      slug: "horiatiki-salad",
      description:
        "Heirloom vine tomatoes, Persian cucumbers, crisp pickled bell peppers, Kalamata olives, caper berries, and an unbroken slab of sheep’s milk feta drenched in single-estate Peloponnese olive oil.",
      ingredients: JSON.stringify(["Heirloom Tomatoes", "Persian Cucumbers", "Sheep's Milk Feta", "Kalamata Olives", "Wild Oregano", "Single-Estate Olive Oil"]),
      price: 15.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsZn0BM7rbpECPo8v-OUb5wc8FNTOlGvAxcDf0iwvIzwCc8dgxdeLAjuVAzhNKzWULq2L_Ry-g4nC-EuWR3Jcner_gT6v44vlXnUYIh3im_puxncj2BSrj-4YSwvZr-NPgODl9Ku6vcEasxd0hWrvvJ49sSoGdv6kfuTbRMeej5JL4WC7_itrU5cr9rCIx3jK4R489mmZvB19geAPrU6l8S3GXk5miByT-w9h-DGNZfOI--JFT8IfYnw",
      categoryId: categoryMap.get("salads")!,
      dietaryTags: JSON.stringify(["Vegetarian", "Gluten-Free"]),
      allergens: JSON.stringify(["Dairy"]),
      isAvailable: true,
      isFeatured: false,
      displayOrder: 1,
    },
    {
      name: "Wild Thyme Honey & Pistachio Baklava",
      slug: "pistachio-baklava",
      description:
        "Forty delicate layers of hand-rolled phyllo pastry filled with crushed Aegina pistachios, soaked in warm Greek mountain thyme honey syrup, served with house-spun mastic gelato.",
      ingredients: JSON.stringify(["Aegina Pistachios", "Greek Thyme Honey", "Phyllo Pastry", "Mastic Gelato", "Ceylon Cinnamon"]),
      price: 13.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIyLORWfveWDjms9NRKUc8iIon7LOa03jET02tqpOKwHbqo8IrmFv6s8mgXdm45D7LXGQcd0zHh_xssI6-ITeKZMK5jM5WpoK5Z1te2iZ7Vc8-Sd8lSh7YbIbw7b_iQHzXnCNHrMsydAtjQMw7l8iUDvmtVm2a9B54jiH0EwIy_gUDv14quukgCk2dqc8jKaby9aZQ52T62RHkC-pMYSofLa8T-PvKiH7zdDzR5X6B2hreoQKDgg-g0w",
      categoryId: categoryMap.get("desserts")!,
      dietaryTags: JSON.stringify(["Vegetarian"]),
      allergens: JSON.stringify(["Nuts", "Gluten", "Dairy"]),
      isAvailable: true,
      isFeatured: false,
      displayOrder: 1,
    },
    {
      name: "Mastic & Smoked Fig Highball",
      slug: "mastic-smoked-fig-highball",
      description:
        "Artisanal Skinos Mastiha spirit, house-clarified smoked Aegean fig cordials, wild thyme blossom honey, and sparkling mineral water with charred lemon twist.",
      ingredients: JSON.stringify(["Skinos Mastiha", "Smoked Fig Cordial", "Wild Thyme Honey", "Soda", "Charred Lemon"]),
      price: 18.0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuANG6PJnVyGwfcw2O_8okEnT_ZK5JK56hZVMLkhpNax1HLgG-oBmUgWvp_j7xy1yhcTCiD1IFnMzsr0ns28WlpUNpVZKdXRPu1rn9yYQlqTPqOtETftE3kQNmqH7xFfJ82kKNzRZDlBlHLp67Wou5iaBz455MTZS-AaM0dlXVpePuX2SE7fWBooK7nkcaJIrL8L0JwBl0DupP5HUUITrfRZr6wFoJYgfhbCJ0xFkWmE6F742uk9EdXiNA",
      categoryId: categoryMap.get("wines")!,
      dietaryTags: JSON.stringify(["Vegan", "Gluten-Free"]),
      allergens: JSON.stringify([]),
      isAvailable: true,
      isFeatured: true,
      displayOrder: 1,
    },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.create({ data: item });
  }
  console.log("✅ Seeded Menu Items");

  // 6. Chefs
  await prisma.chef.create({
    data: {
      name: "Elena Rossi",
      slug: "elena-rossi",
      roleTitle: "Executive Chef & Co-Founder",
      bio: "Rooted in Peloponnese family olive groves and wood-fired stone hearths, Elena honors timeless coastal cooking traditions where every dish begins with patient harvesting and pure intention. Having staged across Athens, San Sebastián, and Naples, she brings rustic elegance and slow-food integrity to Élaia.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAWuSgp4T-h2tk_Ab3kucaT4qn1aZ09QvycGs0hTRFlspsJH8s52ASKnOj_f0za9zLEloMHMceTGpRHLUA4kAKbEG85noiJcJwxJPgY2SZE7UAfzmDtwVd5iKFumcROCbI8sgPwSC1f2oQwrh0PMMZohzwmFBV7qhX3K7OKwDsjFRjKTtIUrHRySAs4Evgx176pN5qm21n3Anl0d4S4qBh8BNgV_fE7uU90ZQAzTb76WShtMx5eUCWx_g",
      signatureDishes: JSON.stringify([
        "Charred Aegean Octopus & Fava Santorinis",
        "Salt-Crusted Aegean Branzino",
      ]),
      displayOrder: 1,
    },
  });

  await prisma.chef.create({
    data: {
      name: "Nikos Andreadis",
      slug: "nikos-andreadis",
      roleTitle: "Master of Hearth & Fire",
      bio: "Born in Crete and trained under fire-hearth masters, Nikos champions the alchemy of open flame, charcoal embers, and fragrant Mediterranean hardwoods—olive, citrus, and vine clippings.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDN3Ff3YZ7n7vPcTUT-FtwIQ5_qxskVFvvZBHmmJpNXPa47GDe8YgAnsKcSJRPa0-P5Q604R8sq2Ze2r13hx0nHNK1ajnRd0tfStEJlRcPZ-oaPn5Y3XIo8wjfEFsNBau8dcIE2SqFNxg9AIJyHdX96Yg39dV-oA6e2cyJ5i0indLjE_R3VGUVecigqEPffD8wKgpdiTEY7c86GQ_iiME9aOqKaFtKHo-c62CD3dxaUZHvTyxv6PpJn8w",
      signatureDishes: JSON.stringify([
        "Cast-Iron Lamb Kebab",
        "Charcoal Grilled Calamari with Wild Herb Chimichurri",
      ]),
      displayOrder: 2,
    },
  });
  console.log("✅ Seeded Chefs");

  // 7. Testimonials
  const testimonialsData = [
    {
      authorName: "Sophia K.",
      diningOccasion: "Anniversary Celebration",
      quote: "The closest you will get to an authentic sunset dinner on the Cyclades. The olive oil alone is worth the visit.",
      rating: 5,
      isVerified: true,
      isPublished: true,
    },
    {
      authorName: "Marcus Vance",
      diningOccasion: "Chef's Hearth Counter Tasting",
      quote: "The charred octopus over yellow fava purée is world-class. Atmospheric dining at its absolute finest.",
      rating: 5,
      isVerified: true,
      isPublished: true,
    },
    {
      authorName: "Elena & David M.",
      diningOccasion: "Pergola Patio Sunset Dinner",
      quote: "Sensual dark botanical atmosphere, incredible service, and cocktails that taste like walking through an olive grove at dusk.",
      rating: 5,
      isVerified: true,
      isPublished: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("✅ Seeded Testimonials");

  // 8. Gallery Images
  const galleryData = [
    {
      title: "Charred Octopus Plating",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATG1kgo_DXFmuq9YQqtF96zI1S36XPWMRHt7JnaeCd-mmB6odsN6nyMxXwZgW1hAanHfoQQrnJkBvDTUiJ7ZjcoMe1wv_hcQOVwnv-S0ma9Fnb7q0f8r6yChbvHB0xp8FabMkCsjDH0LacSrAKuCxid_4OUsFf1RBBHwp_Ic-mxbkacz0DuOlXqBXFQcgiDqnaNUPSdzR7RXO33cWyDhddrQ_9YMcO887DqKavS828x8g8cyBrgKLpFQ",
      category: GalleryCategory.FOOD,
      displayOrder: 1,
    },
    {
      title: "Pergola Garden Patio at Twilight",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBaBn6-prF5Q5JFymaOjsQiu0Qpx_rtA5T1-V5EuSXIiaTr3K8a1pAk9GiaV8oG3ChvQXikVwm4KlYD8n7c2eIRz5eGb8-D1cQvfl9mWrx0y5J0j_8ZjsA1X3ZOOkAdzqxSow4CKHwU_n-3bFy2yHK_rJxOB6ns7pQPLBnL3e98TdZAekyKic22p3hfKgT2I2ja9afzrIK8XGiGINP4HEGMis-eSTFVfm6piuuNNjbc-kF1Oiynibpg2w",
      category: GalleryCategory.ATMOSPHERE,
      displayOrder: 2,
    },
    {
      title: "Main Dining Room Archways",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuANG6PJnVyGwfcw2O_8okEnT_ZK5JK56hZVMLkhpNax1HLgG-oBmUgWvp_j7xy1yhcTCiD1IFnMzsr0ns28WlpUNpVZKdXRPu1rn9yYQlqTPqOtETftE3kQNmqH7xFfJ82kKNzRZDlBlHLp67Wou5iaBz455MTZS-AaM0dlXVpePuX2SE7fWBooK7nkcaJIrL8L0JwBl0DupP5HUUITrfRZr6wFoJYgfhbCJ0xFkWmE6F742uk9EdXiNA",
      category: GalleryCategory.RESTAURANT,
      displayOrder: 3,
    },
    {
      title: "Chef Elena at the Hearth",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAWuSgp4T-h2tk_Ab3kucaT4qn1aZ09QvycGs0hTRFlspsJH8s52ASKnOj_f0za9zLEloMHMceTGpRHLUA4kAKbEG85noiJcJwxJPgY2SZE7UAfzmDtwVd5iKFumcROCbI8sgPwSC1f2oQwrh0PMMZohzwmFBV7qhX3K7OKwDsjFRjKTtIUrHRySAs4Evgx176pN5qm21n3Anl0d4S4qBh8BNgV_fE7uU90ZQAzTb76WShtMx5eUCWx_g",
      category: GalleryCategory.PEOPLE,
      displayOrder: 4,
    },
  ];

  for (const g of galleryData) {
    await prisma.galleryImage.create({ data: g });
  }
  console.log("✅ Seeded Gallery Images");

  // 9. Blog Posts
  await prisma.blogPost.create({
    data: {
      title: "The Ancient Olive Harvest: From Peloponnese to Your Plate",
      slug: "ancient-olive-harvest-peloponnese",
      summary:
        "An intimate look into our third-generation family groves in southern Greece, where hand-harvested Koroneiki olives are cold-pressed within four hours of picking.",
      content: `The rhythm of the Peloponnese autumn is dictated not by clocks, but by the subtle hue of ripening olives. In the hills surrounding our family groves, wild oregano grows between the limestone terraces, perfuming the afternoon air as nets are unfurled beneath the ancient canopies.

Every bottle of extra virgin olive oil gracing the tables at Élaia is pressed from Koroneiki olives harvested by hand. We press within four hours of harvest at strictly controlled temperatures below 24°C, preserving the polyphenols, peppery finish, and luminous green vitality that define authentic Mediterranean cooking.

When you taste our olive oil poured over warm sourdough or drizzled across our charred octopus, you are tasting the sun, sea breezes, and unhurried patience of the southern Peloponnese.`,
      coverImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA5bLyD8Obx4gTBTl0JvCdt8agowo7VSw4mvZ6lOoGcBpJZrkcAHvuJv7JuiqnWey3-v2jkLZvYfJK_jJwXSv5fe_UnRAFNpz5xL_dODphh_RCNGFDG_oxKkToH4m6Pm-OrZtBlNu49wpXgAopPAQchx-yLMSG-292rAulfPwfRMzsCBsKU93ryGmBCxuGchDZMwH_bAJ8AnmXej5_yf_oQiB2cIgeYA1Atwu1zj-2ExywipHwbbjz7_w",
      authorName: "Elena Rossi",
      status: BlogPostStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Botanical Aegean Cocktails: Mastic, Mountain Tea & Smoked Fig",
      slug: "botanical-aegean-cocktails",
      summary:
        "How our cocktail lounge fuses Greek island botanicals with charcoal-smoked fruits and antique barware for sensory nocturnal mixology.",
      content: `On the island of Chios, the mastic tree weeps tears of fragrant resin found nowhere else on earth. For centuries, Mediterranean apothecaries and tavernas have treasured this botanical treasure for its pine-scented, eucalyptus-tinged clarity.

At Élaia’s craft cocktail bar, we infuse wild mountain ironwort tea, clarified smoked fig syrups, and wild thyme honey with rare Greek distillates. Served over hand-carved crystal ice with flaming citrus peels, each cocktail is an invitation to slow down and savor the twilight hours.`,
      coverImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuANG6PJnVyGwfcw2O_8okEnT_ZK5JK56hZVMLkhpNax1HLgG-oBmUgWvp_j7xy1yhcTCiD1IFnMzsr0ns28WlpUNpVZKdXRPu1rn9yYQlqTPqOtETftE3kQNmqH7xFfJ82kKNzRZDlBlHLp67Wou5iaBz455MTZS-AaM0dlXVpePuX2SE7fWBooK7nkcaJIrL8L0JwBl0DupP5HUUITrfRZr6wFoJYgfhbCJ0xFkWmE6F742uk9EdXiNA",
      authorName: "Dimitri Thorne",
      status: BlogPostStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
  console.log("✅ Seeded Blog Posts");

  // 10. Initial Reservation (for demonstration / testing)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.reservation.create({
    data: {
      bookingRef: "ELA-84920",
      customerName: "Alexandria Morgan",
      customerEmail: "alexandria@example.com",
      customerPhone: "+1 (555) 234-5678",
      date: tomorrow,
      timeSlot: "19:30",
      partySize: 2,
      seatingArea: "PATIO",
      specialRequest: "Quiet table for an anniversary celebration, please.",
      status: ReservationStatus.CONFIRMED,
    },
  });
  console.log("✅ Seeded Initial Sample Reservation");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
