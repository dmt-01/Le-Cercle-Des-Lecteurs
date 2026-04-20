import prisma from "../src/libs/prisma.js";

async function main() {
  console.log("Début du seed...");

  // ===== GENRES =====
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { name: "Roman" }, update: {}, create: { name: "Roman" } }),
    prisma.genre.upsert({ where: { name: "Science-Fiction" }, update: {}, create: { name: "Science-Fiction" } }),
    prisma.genre.upsert({ where: { name: "Thriller" }, update: {}, create: { name: "Thriller" } }),
    prisma.genre.upsert({ where: { name: "Philosophie" }, update: {}, create: { name: "Philosophie" } }),
    prisma.genre.upsert({ where: { name: "Poésie" }, update: {}, create: { name: "Poésie" } }),
    prisma.genre.upsert({ where: { name: "Biographie" }, update: {}, create: { name: "Biographie" } }),
    prisma.genre.upsert({ where: { name: "Fantasy" }, update: {}, create: { name: "Fantasy" } }),
    prisma.genre.upsert({ where: { name: "Historique" }, update: {}, create: { name: "Historique" } }),
    prisma.genre.upsert({ where: { name: "Policier" }, update: {}, create: { name: "Policier" } }),
    prisma.genre.upsert({ where: { name: "Essai" }, update: {}, create: { name: "Essai" } }),
  ]);
  console.log(`✅ ${genres.length} genres créés`);

  // ===== TAGS =====
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: "Classique" }, update: {}, create: { name: "Classique" } }),
    prisma.tag.upsert({ where: { name: "Dystopie" }, update: {}, create: { name: "Dystopie" } }),
    prisma.tag.upsert({ where: { name: "Aventure" }, update: {}, create: { name: "Aventure" } }),
    prisma.tag.upsert({ where: { name: "Romance" }, update: {}, create: { name: "Romance" } }),
    prisma.tag.upsert({ where: { name: "Guerre" }, update: {}, create: { name: "Guerre" } }),
    prisma.tag.upsert({ where: { name: "Existentialisme" }, update: {}, create: { name: "Existentialisme" } }),
    prisma.tag.upsert({ where: { name: "Politique" }, update: {}, create: { name: "Politique" } }),
    prisma.tag.upsert({ where: { name: "Psychologie" }, update: {}, create: { name: "Psychologie" } }),
    prisma.tag.upsert({ where: { name: "Uchronie" }, update: {}, create: { name: "Uchronie" } }),
    prisma.tag.upsert({ where: { name: "Mystère" }, update: {}, create: { name: "Mystère" } }),
  ]);
  console.log(`✅ ${tags.length} tags créés`);

  // ===== BADGES =====
  const badges = await Promise.all([
    prisma.badge.upsert({ where: { name: "Premier avis" }, update: {}, create: { name: "Premier avis", description: "A publié sa première critique" } }),
    prisma.badge.upsert({ where: { name: "Lecteur assidu" }, update: {}, create: { name: "Lecteur assidu", description: "A lu 10 livres" } }),
    prisma.badge.upsert({ where: { name: "Critique expert" }, update: {}, create: { name: "Critique expert", description: "A publié 10 critiques" } }),
    prisma.badge.upsert({ where: { name: "Explorateur" }, update: {}, create: { name: "Explorateur", description: "A lu dans 5 genres différents" } }),
    prisma.badge.upsert({ where: { name: "Fondateur" }, update: {}, create: { name: "Fondateur", description: "A créé un club de lecture" } }),
    prisma.badge.upsert({ where: { name: "Ambassadeur" }, update: {}, create: { name: "Ambassadeur", description: "A parrainé 5 membres" } }),
  ]);
  console.log(`✅ ${badges.length} badges créés`);

  // ===== AUTEURS =====
  const authors = await Promise.all([
    prisma.author.create({ data: { name: "Victor Hugo", biography: "Écrivain français du XIXe siècle, auteur des Misérables et Notre-Dame de Paris." } }),
    prisma.author.create({ data: { name: "Albert Camus", biography: "Écrivain et philosophe français, prix Nobel de littérature en 1957." } }),
    prisma.author.create({ data: { name: "George Orwell", biography: "Romancier et essayiste britannique, auteur de 1984 et La Ferme des animaux." } }),
    prisma.author.create({ data: { name: "Gustave Flaubert", biography: "Romancier français du XIXe siècle, maître du réalisme." } }),
    prisma.author.create({ data: { name: "Franz Kafka", biography: "Écrivain austro-hongrois, auteur de La Métamorphose et Le Procès." } }),
    prisma.author.create({ data: { name: "Simone de Beauvoir", biography: "Philosophe et romancière française, figure majeure du féminisme." } }),
    prisma.author.create({ data: { name: "Marcel Proust", biography: "Romancier français, auteur de la monumentale À la recherche du temps perdu." } }),
    prisma.author.create({ data: { name: "Dostoïevski", biography: "Romancier russe du XIXe siècle, auteur de Crime et Châtiment." } }),
  ]);
  console.log(`✅ ${authors.length} auteurs créés`);

  // ===== LIVRES =====
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "Les Misérables",
        description: "L'histoire de Jean Valjean, ancien forçat, dans la France du XIXe siècle. Un chef-d'œuvre de la littérature mondiale.",
        publication_date: new Date("1862-01-01"),
        authors: { create: { authorId: authors[0].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[0].id }, { tagId: tags[4].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Notre-Dame de Paris",
        description: "Le destin tragique de Quasimodo et Esmeralda dans le Paris médiéval.",
        publication_date: new Date("1831-01-01"),
        authors: { create: { authorId: authors[0].id } },
        categorisations: { create: { genreId: genres[7].id } },
        thematisations: { create: [{ tagId: tags[0].id }, { tagId: tags[2].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "L'Étranger",
        description: "Meursault, un homme indifférent au monde, commet un meurtre absurde sous le soleil d'Alger.",
        publication_date: new Date("1942-01-01"),
        authors: { create: { authorId: authors[1].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[5].id }, { tagId: tags[0].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "La Peste",
        description: "Une ville algérienne frappée par une épidémie de peste. Une allégorie de la résistance face au mal.",
        publication_date: new Date("1947-01-01"),
        authors: { create: { authorId: authors[1].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[5].id }, { tagId: tags[7].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "1984",
        description: "Dans un État totalitaire, Winston Smith tente de résister au régime du Grand Frère.",
        publication_date: new Date("1949-01-01"),
        authors: { create: { authorId: authors[2].id } },
        categorisations: { create: { genreId: genres[1].id } },
        thematisations: { create: [{ tagId: tags[1].id }, { tagId: tags[6].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "La Ferme des animaux",
        description: "Une fable politique où des animaux renversent leurs maîtres humains pour créer leur propre société.",
        publication_date: new Date("1945-01-01"),
        authors: { create: { authorId: authors[2].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[6].id }, { tagId: tags[0].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Madame Bovary",
        description: "Emma Bovary, épouse d'un médecin de campagne, rêve d'une vie plus romanesque.",
        publication_date: new Date("1857-01-01"),
        authors: { create: { authorId: authors[3].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[3].id }, { tagId: tags[0].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "La Métamorphose",
        description: "Gregor Samsa se réveille un matin transformé en insecte géant.",
        publication_date: new Date("1915-01-01"),
        authors: { create: { authorId: authors[4].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[7].id }, { tagId: tags[5].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Le Deuxième Sexe",
        description: "Analyse fondatrice du féminisme moderne par Simone de Beauvoir.",
        publication_date: new Date("1949-01-01"),
        authors: { create: { authorId: authors[5].id } },
        categorisations: { create: { genreId: genres[9].id } },
        thematisations: { create: [{ tagId: tags[6].id }, { tagId: tags[7].id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Crime et Châtiment",
        description: "Raskolnikov, étudiant pauvre, commet un meurtre et doit vivre avec sa culpabilité.",
        publication_date: new Date("1866-01-01"),
        authors: { create: { authorId: authors[7].id } },
        categorisations: { create: { genreId: genres[0].id } },
        thematisations: { create: [{ tagId: tags[7].id }, { tagId: tags[9].id }] },
      }
    }),
  ]);
  console.log(`✅ ${books.length} livres créés`);

  // ===== USERS =====
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "alice_lit",
        email: "alice@cercle.fr",
        // @ts-ignore
        passwordHash: "hashed_password_placeholder",
        bio: "Passionnée de littérature classique et de philosophie. Lectrice compulsive depuis l'âge de 8 ans.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      }
    }),
    prisma.user.create({
      data: {
        username: "bob_pages",
        email: "bob@cercle.fr",
         // @ts-ignore
        passwordHash: "hashed_password_placeholder",
        bio: "Fan de dystopies et de science-fiction. Je lis un livre par semaine.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      }
    }),
    prisma.user.create({
      data: {
        username: "claire_bouquin",
        email: "claire@cercle.fr",
        // @ts-ignore
        passwordHash: "hashed_password_placeholder",
        bio: "Libraire de profession, lectrice par passion. Spécialiste de la littérature russe.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=claire",
      }
    }),
    prisma.user.create({
      data: {
        username: "david_roman",
        email: "david@cercle.fr",        
        // @ts-ignore
        passwordHash: "hashed_password_placeholder",
        bio: "Étudiant en lettres modernes. J'aime les romans qui font réfléchir.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      }
    }),
    prisma.user.create({
      data: {
        username: "emma_verso",
        email: "emma@cercle.fr",        
        // @ts-ignore
        passwordHash: "hashed_password_placeholder",
        bio: "Amatrice de poésie et de romans historiques. Collectionneuse de livres anciens.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      }
    }),
  ]);
  console.log(`✅ ${users.length} utilisateurs créés`);

  // ===== FOLLOWS =====
  await Promise.all([
    prisma.follow.create({ data: { userId: users[0].id, userFollowedId: users[1].id } }),
    prisma.follow.create({ data: { userId: users[0].id, userFollowedId: users[2].id } }),
    prisma.follow.create({ data: { userId: users[1].id, userFollowedId: users[0].id } }),
    prisma.follow.create({ data: { userId: users[2].id, userFollowedId: users[0].id } }),
    prisma.follow.create({ data: { userId: users[3].id, userFollowedId: users[0].id } }),
    prisma.follow.create({ data: { userId: users[4].id, userFollowedId: users[2].id } }),
  ]);
  console.log("✅ Follows créés");

  // ===== REVIEWS =====
  await Promise.all([
    prisma.review.create({ data: { content: "Un chef-d'œuvre absolu, une fresque humaine bouleversante.", note: 5, bookId: books[0].id, userId: users[0].id } }),
    prisma.review.create({ data: { content: "Lecture fascinante et dérangeante, Orwell avait tout prévu.", note: 5, bookId: books[4].id, userId: users[1].id } }),
    prisma.review.create({ data: { content: "Camus à son meilleur. Court mais d'une profondeur rare.", note: 4, bookId: books[2].id, userId: users[2].id } }),
    prisma.review.create({ data: { content: "La Métamorphose m'a profondément marqué. Kafka est un génie.", note: 5, bookId: books[7].id, userId: users[3].id } }),
    prisma.review.create({ data: { content: "Un livre essentiel pour comprendre le féminisme.", note: 5, bookId: books[8].id, userId: users[4].id } }),
    prisma.review.create({ data: { content: "Crime et Châtiment est une plongée vertigineuse dans la psyché humaine.", note: 5, bookId: books[9].id, userId: users[2].id } }),
    prisma.review.create({ data: { content: "Madame Bovary est un portrait saisissant de la condition féminine.", note: 4, bookId: books[6].id, userId: users[0].id } }),
    prisma.review.create({ data: { content: "La Ferme des animaux est une fable brillante et terrifiante.", note: 4, bookId: books[5].id, userId: users[3].id } }),
  ]);
  console.log("✅ Reviews créées");

  // ===== LIKES =====
  await Promise.all([
    prisma.like.create({ data: { bookId: books[0].id, userId: users[0].id } }),
    prisma.like.create({ data: { bookId: books[4].id, userId: users[1].id } }),
    prisma.like.create({ data: { bookId: books[2].id, userId: users[2].id } }),
    prisma.like.create({ data: { bookId: books[7].id, userId: users[3].id } }),
    prisma.like.create({ data: { bookId: books[9].id, userId: users[4].id } }),
    prisma.like.create({ data: { bookId: books[0].id, userId: users[3].id } }),
    prisma.like.create({ data: { bookId: books[4].id, userId: users[4].id } }),
  ]);
  console.log("✅ Likes créés");

  // ===== READS =====
  await Promise.all([
    prisma.read.create({ data: { bookId: books[0].id, userId: users[0].id } }),
    prisma.read.create({ data: { bookId: books[6].id, userId: users[0].id } }),
    prisma.read.create({ data: { bookId: books[4].id, userId: users[1].id } }),
    prisma.read.create({ data: { bookId: books[5].id, userId: users[1].id } }),
    prisma.read.create({ data: { bookId: books[2].id, userId: users[2].id } }),
    prisma.read.create({ data: { bookId: books[9].id, userId: users[2].id } }),
    prisma.read.create({ data: { bookId: books[7].id, userId: users[3].id } }),
    prisma.read.create({ data: { bookId: books[8].id, userId: users[4].id } }),
  ]);
  console.log("✅ Reads créés");

  // ===== WISHLISTS =====
  await Promise.all([
    prisma.wishlist.create({ data: { bookId: books[3].id, userId: users[0].id, status: "À lire" } }),
    prisma.wishlist.create({ data: { bookId: books[7].id, userId: users[0].id, status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[9].id, userId: users[1].id, status: "À lire" } }),
    prisma.wishlist.create({ data: { bookId: books[1].id, userId: users[2].id, status: "À lire" } }),
    prisma.wishlist.create({ data: { bookId: books[6].id, userId: users[3].id, status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[8].id, userId: users[3].id, status: "À lire" } }),
  ]);
  console.log("✅ Wishlists créées");

  // ===== GROUPES =====
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Les Classiques",
        description: "Club dédié à la littérature classique française et mondiale.",
        accessClub: true,
        members: {
          create: [
            { userId: users[0].id, role: "member" },
            { userId: users[2].id, role: "member" },
            { userId: users[4].id, role: "member" },
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: "Dystopies & SF",
        description: "Pour les amateurs de science-fiction et de romans dystopiques.",
        accessClub: true,
        members: {
          create: [
            { userId: users[1].id, role: "member" },
            { userId: users[3].id, role: "member" },
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: "Philosophie & Essais",
        description: "Club privé pour les passionnés de philosophie et d'essais littéraires.",
        accessClub: false,
        members: {
          create: [
            { userId: users[2].id, role: "admin" },
            { userId: users[4].id, role: "admin" },
          ]
        }
      }
    }),
  ]);
  console.log(`✅ ${groups.length} groupes créés`);

  // ===== MESSAGES DE GROUPE =====
  await Promise.all([
    prisma.groupMessage.create({ data: { content: "Bienvenue dans le club Les Classiques !", groupId: groups[0].id, userId: users[0].id } }),
    prisma.groupMessage.create({ data: { content: "Je propose qu'on commence par Les Misérables ce mois-ci.", groupId: groups[0].id, userId: users[2].id } }),
    prisma.groupMessage.create({ data: { content: "Super idée ! J'ai déjà commencé ma relecture.", groupId: groups[0].id, userId: users[4].id } }),
    prisma.groupMessage.create({ data: { content: "Prochaine lecture : 1984 !", groupId: groups[1].id, userId: users[1].id } }),
    prisma.groupMessage.create({ data: { content: "J'ai adoré la relecture de 1984, très actuel.", groupId: groups[1].id, userId: users[3].id } }),
  ]);
  console.log("✅ Messages de groupe créés");

  // ===== MESSAGES PRIVÉS =====
  await Promise.all([
    prisma.message.create({ data: { content: "Salut Alice ! Tu as lu Crime et Châtiment ?", senderId: users[2].id, receiverId: users[0].id } }),
    prisma.message.create({ data: { content: "Oui ! Un chef-d'œuvre. Je te le recommande vivement.", senderId: users[0].id, receiverId: users[2].id, read: true } }),
    prisma.message.create({ data: { content: "Tu rejoins le club Classiques ?", senderId: users[0].id, receiverId: users[3].id } }),
    prisma.message.create({ data: { content: "Avec plaisir, j'adore la littérature classique !", senderId: users[3].id, receiverId: users[0].id, read: true } }),
  ]);
  console.log("✅ Messages privés créés");

  // ===== ÉVÉNEMENTS =====
  await Promise.all([
    prisma.event.create({
      data: {
        title: "Rencontre autour des Misérables",
        description: "Discussion approfondie sur l'œuvre de Victor Hugo. Venez partager vos impressions !",
        // @ts-ignore
        eventDate: new Date("2026-05-15T19:00:00"),
        link: "https://zoom.us/j/example1",
        groupId: groups[0].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "1984 : toujours d'actualité ?",        
        description: "Analyse du roman d'Orwell à la lumière du monde contemporain.",
        // @ts-ignore
        eventDate: new Date("2026-05-22T20:00:00"),
        link: "https://zoom.us/j/example2",
        groupId: groups[1].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "Beauvoir & le féminisme aujourd'hui",        
        description: "Lecture et discussion du Deuxième Sexe.",
        // @ts-ignore
        eventDate: new Date("2026-06-01T18:30:00"),
        link: "https://zoom.us/j/example3",
        groupId: groups[2].id,
      }
    }),
  ]);
  console.log("✅ Événements créés");

  // ===== ARTICLES =====
  await Promise.all([
    prisma.blog.create({
      data: {
        title: "Pourquoi lire Dostoïevski en 2026 ?",
        content: "Dans un monde en crise, les romans de Dostoïevski résonnent avec une force particulière. Crime et Châtiment, Le Joueur, Les Frères Karamazov... autant d'œuvres qui explorent les profondeurs de l'âme humaine.",
        category: "Critique",
        userId: users[2].id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Top 5 des dystopies incontournables",
        content: "1984, Le Meilleur des Mondes, Fahrenheit 451, La Servante Écarlate, Nous Autres... Découvrez les œuvres fondatrices du genre dystopique.",
        category: "Sélection",
        userId: users[1].id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Interview : rencontre avec une libraire passionnée",
        content: "Claire, libraire depuis 10 ans, nous parle de ses coups de cœur, de l'évolution du marché du livre et de l'importance des clubs de lecture.",
        category: "Interview",
        userId: users[0].id,
      }
    }),
  ]);
  console.log("✅ Articles créés");

  // ===== BADGES UTILISATEURS =====
  await Promise.all([
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: users[0].id } }),
    prisma.userBadge.create({ data: { badgeId: badges[2].id, userId: users[0].id } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: users[1].id } }),
    prisma.userBadge.create({ data: { badgeId: badges[3].id, userId: users[2].id } }),
    prisma.userBadge.create({ data: { badgeId: badges[4].id, userId: users[0].id } }),
    prisma.userBadge.create({ data: { badgeId: badges[1].id, userId: users[2].id } }),
  ]);
  console.log("✅ Badges utilisateurs créés");

  // ===== RECOMMANDATIONS =====
  await Promise.all([
    prisma.bookRecommendation.create({ data: { score: 95, bookId: books[2].id, userId: users[0].id } }),
    prisma.bookRecommendation.create({ data: { score: 88, bookId: books[4].id, userId: users[0].id } }),
    prisma.bookRecommendation.create({ data: { score: 92, bookId: books[9].id, userId: users[1].id } }),
    prisma.bookRecommendation.create({ data: { score: 85, bookId: books[7].id, userId: users[2].id } }),
    prisma.bookRecommendation.create({ data: { score: 90, bookId: books[8].id, userId: users[3].id } }),
  ]);
  console.log("✅ Recommandations créées");

  console.log("\n🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });