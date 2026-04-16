import prisma from "../src/libs/prisma.js";

async function main() {
  console.log("Début du seed...");

  // Genres
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { name: "Roman" }, update: {}, create: { name: "Roman" } }),
    prisma.genre.upsert({ where: { name: "Science-Fiction" }, update: {}, create: { name: "Science-Fiction" } }),
    prisma.genre.upsert({ where: { name: "Thriller" }, update: {}, create: { name: "Thriller" } }),
    prisma.genre.upsert({ where: { name: "Philosophie" }, update: {}, create: { name: "Philosophie" } }),
    prisma.genre.upsert({ where: { name: "Poésie" }, update: {}, create: { name: "Poésie" } }),
  ]);
  console.log(`✅ ${genres.length} genres créés`);

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: "Classique" }, update: {}, create: { name: "Classique" } }),
    prisma.tag.upsert({ where: { name: "Dystopie" }, update: {}, create: { name: "Dystopie" } }),
    prisma.tag.upsert({ where: { name: "Aventure" }, update: {}, create: { name: "Aventure" } }),
    prisma.tag.upsert({ where: { name: "Romance" }, update: {}, create: { name: "Romance" } }),
  ]);
  console.log(`✅ ${tags.length} tags créés`);

  // Badges
  const badges = await Promise.all([
    prisma.badge.upsert({ where: { name: "Premier avis" }, update: {}, create: { name: "Premier avis", description: "A publié sa première critique" } }),
    prisma.badge.upsert({ where: { name: "Lecteur assidu" }, update: {}, create: { name: "Lecteur assidu", description: "A lu 10 livres" } }),
    prisma.badge.upsert({ where: { name: "Critique expert" }, update: {}, create: { name: "Critique expert", description: "A publié 10 critiques" } }),
  ]);
  console.log(`✅ ${badges.length} badges créés`);

  // Auteurs
  const authors = await Promise.all([
    prisma.author.create({ data: { name: "Victor Hugo", biography: "Écrivain français du XIXe siècle" } }),
    prisma.author.create({ data: { name: "Albert Camus", biography: "Écrivain et philosophe français" } }),
    prisma.author.create({ data: { name: "George Orwell", biography: "Romancier et essayiste britannique" } }),
  ]);
  console.log(`✅ ${authors.length} auteurs créés`);

  // Livres
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "Les Misérables",
        description: "L'histoire de Jean Valjean dans la France du XIXe siècle",
        publication_date: new Date("1862-01-01"),
        authors: { create: { authorId: authors[0].id } },
        categorisations: { create: { genreId: genres[0].id } },
      }
    }),
    prisma.book.create({
      data: {
        title: "L'Étranger",
        description: "Roman existentialiste d'Albert Camus",
        publication_date: new Date("1942-01-01"),
        authors: { create: { authorId: authors[1].id } },
        categorisations: { create: { genreId: genres[0].id } },
      }
    }),
    prisma.book.create({
      data: {
        title: "1984",
        description: "Roman dystopique de George Orwell",
        publication_date: new Date("1949-01-01"),
        authors: { create: { authorId: authors[2].id } },
        categorisations: { create: { genreId: genres[1].id } },
        thematisations: { create: { tagId: tags[1].id } },
      }
    }),
  ]);
  console.log(`✅ ${books.length} livres créés`);

  // Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "alice",
        email: "alice@cercle.fr",
        password_hash: "hashed_password_placeholder",
      }
    }),
    prisma.user.create({
      data: {
        username: "bob",
        email: "bob@cercle.fr",
        password_hash: "hashed_password_placeholder",
      }
    }),
  ]);
  console.log(`✅ ${users.length} utilisateurs créés`);

  // Reviews
  await prisma.review.create({
    data: {
      content: "Un chef d'œuvre absolu !",
      note: 5,
      bookId: books[0].id,
      userId: users[0].id,
    }
  });
  await prisma.review.create({
    data: {
      content: "Lecture fascinante et dérangeante",
      note: 4,
      bookId: books[2].id,
      userId: users[1].id,
    }
  });
  console.log("✅ Reviews créées");

  // Groupe
  const group = await prisma.group.create({
    data: {
      name: "Les Classiques",
      description: "Club dédié à la littérature classique",
      access_club: true,
      members: {
        create: [
          { userId: users[0].id, role: "admin" },
          { userId: users[1].id, role: "member" },
        ]
      }
    }
  });
  console.log(`✅ Groupe "${group.name}" créé`);

  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });