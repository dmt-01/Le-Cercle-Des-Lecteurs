import prisma from "../src/libs/prisma.js";
import argon2 from "argon2";

async function main() {
  console.log("Début du seed...");

  // Mot de passe commun à tous les utilisateurs de test : "password123456"
  const passwordHash = await argon2.hash("password123456");

  // ===== GENRES =====
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { name: "Roman" },          update: {}, create: { name: "Roman" } }),
    prisma.genre.upsert({ where: { name: "Science-Fiction" },update: {}, create: { name: "Science-Fiction" } }),
    prisma.genre.upsert({ where: { name: "Thriller" },       update: {}, create: { name: "Thriller" } }),
    prisma.genre.upsert({ where: { name: "Philosophie" },    update: {}, create: { name: "Philosophie" } }),
    prisma.genre.upsert({ where: { name: "Poésie" },         update: {}, create: { name: "Poésie" } }),
    prisma.genre.upsert({ where: { name: "Biographie" },     update: {}, create: { name: "Biographie" } }),
    prisma.genre.upsert({ where: { name: "Fantasy" },        update: {}, create: { name: "Fantasy" } }),
    prisma.genre.upsert({ where: { name: "Historique" },     update: {}, create: { name: "Historique" } }),
    prisma.genre.upsert({ where: { name: "Policier" },       update: {}, create: { name: "Policier" } }),
    prisma.genre.upsert({ where: { name: "Essai" },          update: {}, create: { name: "Essai" } }),
    prisma.genre.upsert({ where: { name: "Conte" },          update: {}, create: { name: "Conte" } }),
    prisma.genre.upsert({ where: { name: "Drame" },          update: {}, create: { name: "Drame" } }),
  ]);
  console.log(`✅ ${genres.length} genres créés`);

  const [ROMAN, SF, _THRILLER, _PHILO, _POESIE, _BIO, _FANTASY, HISTORIQUE, _POLICIER, ESSAI, CONTE, _DRAME] = genres;

  // ===== TAGS =====
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: "Classique" },       update: {}, create: { name: "Classique" } }),
    prisma.tag.upsert({ where: { name: "Dystopie" },        update: {}, create: { name: "Dystopie" } }),
    prisma.tag.upsert({ where: { name: "Aventure" },        update: {}, create: { name: "Aventure" } }),
    prisma.tag.upsert({ where: { name: "Romance" },         update: {}, create: { name: "Romance" } }),
    prisma.tag.upsert({ where: { name: "Guerre" },          update: {}, create: { name: "Guerre" } }),
    prisma.tag.upsert({ where: { name: "Existentialisme" }, update: {}, create: { name: "Existentialisme" } }),
    prisma.tag.upsert({ where: { name: "Politique" },       update: {}, create: { name: "Politique" } }),
    prisma.tag.upsert({ where: { name: "Psychologie" },     update: {}, create: { name: "Psychologie" } }),
    prisma.tag.upsert({ where: { name: "Uchronie" },        update: {}, create: { name: "Uchronie" } }),
    prisma.tag.upsert({ where: { name: "Mystère" },         update: {}, create: { name: "Mystère" } }),
    prisma.tag.upsert({ where: { name: "Famille" },         update: {}, create: { name: "Famille" } }),
    prisma.tag.upsert({ where: { name: "Humour noir" },     update: {}, create: { name: "Humour noir" } }),
    prisma.tag.upsert({ where: { name: "Enfance" },         update: {}, create: { name: "Enfance" } }),
    prisma.tag.upsert({ where: { name: "Voyage" },          update: {}, create: { name: "Voyage" } }),
    prisma.tag.upsert({ where: { name: "Identité" },        update: {}, create: { name: "Identité" } }),
  ]);
  console.log(`✅ ${tags.length} tags créés`);

  const [CLASSIQUE, DYSTOPIE, AVENTURE, ROMANCE, GUERRE, EXISTENTIALISME, POLITIQUE, PSYCHOLOGIE, _UCHRONIE, MYSTERE, FAMILLE, HUMOUR_NOIR, ENFANCE, VOYAGE, IDENTITE] = tags;

  // ===== BADGES =====
  const badges = await Promise.all([
    prisma.badge.upsert({ where: { name: "Premier avis" },   update: {}, create: { name: "Premier avis",   description: "A publié sa première critique" } }),
    prisma.badge.upsert({ where: { name: "Lecteur assidu" }, update: {}, create: { name: "Lecteur assidu", description: "A lu 10 livres" } }),
    prisma.badge.upsert({ where: { name: "Critique expert" },update: {}, create: { name: "Critique expert",description: "A publié 10 critiques" } }),
    prisma.badge.upsert({ where: { name: "Explorateur" },    update: {}, create: { name: "Explorateur",    description: "A lu dans 5 genres différents" } }),
    prisma.badge.upsert({ where: { name: "Fondateur" },      update: {}, create: { name: "Fondateur",      description: "A créé un club de lecture" } }),
    prisma.badge.upsert({ where: { name: "Ambassadeur" },    update: {}, create: { name: "Ambassadeur",    description: "A parrainé 5 membres" } }),
    prisma.badge.upsert({ where: { name: "Bibliophile" },    update: {}, create: { name: "Bibliophile",    description: "A ajouté 20 livres à sa wishlist" } }),
    prisma.badge.upsert({ where: { name: "Grand voyageur" }, update: {}, create: { name: "Grand voyageur", description: "A lu des auteurs de 5 pays différents" } }),
  ]);
  console.log(`✅ ${badges.length} badges créés`);

  // ===== AUTEURS =====
  const authors = await Promise.all([
    prisma.author.create({ data: { name: "Victor Hugo",             biography: "Écrivain français du XIXe siècle, auteur des Misérables et Notre-Dame de Paris." } }),
    prisma.author.create({ data: { name: "Albert Camus",            biography: "Écrivain et philosophe français, prix Nobel de littérature en 1957." } }),
    prisma.author.create({ data: { name: "George Orwell",           biography: "Romancier et essayiste britannique, auteur de 1984 et La Ferme des animaux." } }),
    prisma.author.create({ data: { name: "Gustave Flaubert",        biography: "Romancier français du XIXe siècle, maître du réalisme." } }),
    prisma.author.create({ data: { name: "Franz Kafka",             biography: "Écrivain austro-hongrois, auteur de La Métamorphose et Le Procès." } }),
    prisma.author.create({ data: { name: "Simone de Beauvoir",      biography: "Philosophe et romancière française, figure majeure du féminisme." } }),
    prisma.author.create({ data: { name: "Marcel Proust",           biography: "Romancier français, auteur de la monumentale À la recherche du temps perdu." } }),
    prisma.author.create({ data: { name: "Fiodor Dostoïevski",      biography: "Romancier russe du XIXe siècle, auteur de Crime et Châtiment et Les Frères Karamazov." } }),
    prisma.author.create({ data: { name: "Antoine de Saint-Exupéry",biography: "Écrivain et aviateur français, auteur du Petit Prince." } }),
    prisma.author.create({ data: { name: "Stendhal",                biography: "Romancier français du XIXe siècle, auteur du Rouge et le Noir." } }),
    prisma.author.create({ data: { name: "Émile Zola",              biography: "Romancier français, chef de file du naturalisme, auteur des Rougon-Macquart." } }),
    prisma.author.create({ data: { name: "Léo Tolstoï",             biography: "Écrivain russe, auteur de Guerre et Paix et Anna Karénine." } }),
  ]);
  console.log(`✅ ${authors.length} auteurs créés`);

  const [HUGO, CAMUS, ORWELL, FLAUBERT, KAFKA, BEAUVOIR, PROUST, DOSTOIEVSKI, SAINT_EX, STENDHAL, ZOLA, TOLSTOI] = authors;

  // ===== LIVRES =====
  // Index final : [0]=Les Misérables [1]=Notre-Dame [2]=L'Étranger [3]=La Peste [4]=1984
  // [5]=La Ferme [6]=Mme Bovary [7]=La Métamorphose [8]=Le Procès [9]=Le Deuxième Sexe
  // [10]=Crime et Châtiment [11]=Les Frères Karamazov [12]=Le Petit Prince
  // [13]=Le Rouge et le Noir [14]=Germinal [15]=Anna Karénine [16]=Guerre et Paix
  const books = await Promise.all([

    // Victor Hugo
    prisma.book.create({
      data: {
        title: "Les Misérables",
        description: "L'histoire de Jean Valjean, ancien forçat devenu maire, dans la France tourmentée du XIXe siècle. Une fresque sociale et humaniste qui explore la rédemption, la justice et l'amour filial à travers des personnages inoubliables comme Fantine, Cosette et l'inspecteur Javert.",
        publication_date: new Date("1862-01-01"),
        authors:         { create: { authorId: HUGO.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: CLASSIQUE.id }, { tagId: GUERRE.id }, { tagId: POLITIQUE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Notre-Dame de Paris",
        description: "Le destin tragique de Quasimodo, sonneur de cloches difforme, et d'Esmeralda, belle danseuse bohémienne, dans le Paris médiéval du XVe siècle. Un hymne à l'architecture gothique et une réflexion sur la fatalité.",
        publication_date: new Date("1831-01-01"),
        authors:         { create: { authorId: HUGO.id } },
        categorisations: { create: { genreId: HISTORIQUE.id } },
        thematisations:  { create: [{ tagId: CLASSIQUE.id }, { tagId: AVENTURE.id }, { tagId: IDENTITE.id }] },
      }
    }),

    // Albert Camus
    prisma.book.create({
      data: {
        title: "L'Étranger",
        description: "Meursault, employé de bureau à Alger, vit dans une indifférence totale au monde qui l'entoure. Après avoir tué un Arabe sous le soleil brûlant, il affronte la justice d'une société qui le condamne davantage pour son insensibilité que pour son crime.",
        publication_date: new Date("1942-01-01"),
        authors:         { create: { authorId: CAMUS.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: EXISTENTIALISME.id }, { tagId: CLASSIQUE.id }, { tagId: PSYCHOLOGIE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "La Peste",
        description: "La ville d'Oran est frappée par une épidémie de peste bubonique. Le docteur Rieux et ses compagnons luttent contre le fléau avec courage et solidarité. Une puissante allégorie de la résistance face au mal absolu, écrite dans l'ombre de la Seconde Guerre mondiale.",
        publication_date: new Date("1947-01-01"),
        authors:         { create: { authorId: CAMUS.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: EXISTENTIALISME.id }, { tagId: PSYCHOLOGIE.id }, { tagId: POLITIQUE.id }] },
      }
    }),

    // George Orwell
    prisma.book.create({
      data: {
        title: "1984",
        description: "Dans l'Océania totalitaire, Winston Smith travaille au Ministère de la Vérité où il réécrit l'histoire selon les ordres du Parti. Sa rencontre avec Julia et un mystérieux rebelle l'entraîne dans une dangereuse résistance contre le Grand Frère omniscient.",
        publication_date: new Date("1949-06-08"),
        authors:         { create: { authorId: ORWELL.id } },
        categorisations: { create: { genreId: SF.id } },
        thematisations:  { create: [{ tagId: DYSTOPIE.id }, { tagId: POLITIQUE.id }, { tagId: PSYCHOLOGIE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "La Ferme des animaux",
        description: "Les animaux de la Ferme du Manoir se révoltent contre leur maître humain. Sous la direction des cochons Napoléon et Boule de Neige, ils fondent une société égalitaire. Mais le pouvoir corrompt, et les slogans révolutionnaires se transforment insidieusement.",
        publication_date: new Date("1945-08-17"),
        authors:         { create: { authorId: ORWELL.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: POLITIQUE.id }, { tagId: HUMOUR_NOIR.id }, { tagId: CLASSIQUE.id }] },
      }
    }),

    // Gustave Flaubert
    prisma.book.create({
      data: {
        title: "Madame Bovary",
        description: "Emma Bovary, épouse d'un médecin de campagne ennuyeux, rêve d'une vie romanesque nourrie de lectures sentimentales. Ses aventures avec des amants décevants et ses dépenses inconsidérées la mènent à la ruine. Chef-d'œuvre du réalisme français.",
        publication_date: new Date("1857-04-01"),
        authors:         { create: { authorId: FLAUBERT.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: ROMANCE.id }, { tagId: CLASSIQUE.id }, { tagId: PSYCHOLOGIE.id }] },
      }
    }),

    // Franz Kafka
    prisma.book.create({
      data: {
        title: "La Métamorphose",
        description: "Gregor Samsa se réveille un matin transformé en insecte monstrueux. Sa famille, d'abord atterrée, finit par le rejeter. Kafka explore avec une précision clinique et glaçante l'aliénation, la culpabilité et l'absurdité de l'existence moderne.",
        publication_date: new Date("1915-01-01"),
        authors:         { create: { authorId: KAFKA.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: PSYCHOLOGIE.id }, { tagId: EXISTENTIALISME.id }, { tagId: FAMILLE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Le Procès",
        description: "Josef K. est arrêté un matin sans savoir pourquoi ni de quoi il est accusé. Il tente de naviguer dans un système judiciaire kafkaïen, absurde et impénétrable, qui finit par l'engloutir. Une métaphore terrifiante de la bureaucratie et du pouvoir arbitraire.",
        publication_date: new Date("1925-01-01"),
        authors:         { create: { authorId: KAFKA.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: POLITIQUE.id }, { tagId: PSYCHOLOGIE.id }, { tagId: MYSTERE.id }] },
      }
    }),

    // Simone de Beauvoir
    prisma.book.create({
      data: {
        title: "Le Deuxième Sexe",
        description: "Œuvre fondatrice du féminisme moderne, Beauvoir analyse la condition féminine à travers la biologie, l'histoire, les mythes et la vie quotidienne. \"On ne naît pas femme, on le devient\" : une phrase qui a changé le monde.",
        publication_date: new Date("1949-06-01"),
        authors:         { create: { authorId: BEAUVOIR.id } },
        categorisations: { create: { genreId: ESSAI.id } },
        thematisations:  { create: [{ tagId: POLITIQUE.id }, { tagId: PSYCHOLOGIE.id }, { tagId: IDENTITE.id }] },
      }
    }),

    // Fiodor Dostoïevski
    prisma.book.create({
      data: {
        title: "Crime et Châtiment",
        description: "Raskolnikov, étudiant pauvre de Saint-Pétersbourg, théorise qu'un homme supérieur peut s'affranchir de la morale commune. Il assassine une vieille usurière, mais son esprit ne résiste pas au poids de la culpabilité. Un roman magistral sur le crime, la punition et la rédemption.",
        publication_date: new Date("1866-01-01"),
        authors:         { create: { authorId: DOSTOIEVSKI.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: PSYCHOLOGIE.id }, { tagId: MYSTERE.id }, { tagId: CLASSIQUE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Les Frères Karamazov",
        description: "Dernier roman de Dostoïevski, considéré comme son chef-d'œuvre. La mort du père Fiodor Karamazov réunit ses trois fils aux tempéraments opposés : le fougueux Dmitri, l'intellectuel Ivan et le doux Aliocha. Une plongée dans les abîmes de l'âme humaine, la foi et la liberté.",
        publication_date: new Date("1880-01-01"),
        authors:         { create: { authorId: DOSTOIEVSKI.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: FAMILLE.id }, { tagId: PSYCHOLOGIE.id }, { tagId: CLASSIQUE.id }] },
      }
    }),

    // Antoine de Saint-Exupéry
    prisma.book.create({
      data: {
        title: "Le Petit Prince",
        description: "Un aviateur en panne dans le désert rencontre un petit prince venu d'une autre planète. À travers ce voyage poétique, Saint-Exupéry parle des adultes qui ont perdu leur âme d'enfant, de l'amitié, de l'amour et de ce qui compte vraiment dans la vie.",
        publication_date: new Date("1943-04-06"),
        authors:         { create: { authorId: SAINT_EX.id } },
        categorisations: { create: { genreId: CONTE.id } },
        thematisations:  { create: [{ tagId: ENFANCE.id }, { tagId: VOYAGE.id }, { tagId: EXISTENTIALISME.id }] },
      }
    }),

    // Stendhal
    prisma.book.create({
      data: {
        title: "Le Rouge et le Noir",
        description: "Julien Sorel, fils d'un charpentier ambitieux, gravit les échelons de la société française de la Restauration grâce à son intelligence et ses conquêtes amoureuses. Un roman sur l'ambition sociale, l'hypocrisie et la passion dévorante.",
        publication_date: new Date("1830-01-01"),
        authors:         { create: { authorId: STENDHAL.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: ROMANCE.id }, { tagId: POLITIQUE.id }, { tagId: CLASSIQUE.id }] },
      }
    }),

    // Émile Zola
    prisma.book.create({
      data: {
        title: "Germinal",
        description: "Étienne Lantier arrive dans le bassin minier du Nord et découvre la misère des mineurs. Il organise une grève qui tourne à la tragédie. Zola dresse un tableau saisissant de la lutte des classes et de la condition ouvrière au XIXe siècle.",
        publication_date: new Date("1885-01-01"),
        authors:         { create: { authorId: ZOLA.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: POLITIQUE.id }, { tagId: GUERRE.id }, { tagId: CLASSIQUE.id }] },
      }
    }),

    // Léo Tolstoï
    prisma.book.create({
      data: {
        title: "Anna Karénine",
        description: "Anna Karénine, femme de la haute société russe, abandonne son mari et son fils pour vivre sa passion avec le comte Vronski. Tolstoï dépeint avec une profondeur incomparable la jalousie, la culpabilité et la destruction d'une âme par la société.",
        publication_date: new Date("1877-01-01"),
        authors:         { create: { authorId: TOLSTOI.id } },
        categorisations: { create: { genreId: ROMAN.id } },
        thematisations:  { create: [{ tagId: ROMANCE.id }, { tagId: FAMILLE.id }, { tagId: PSYCHOLOGIE.id }] },
      }
    }),
    prisma.book.create({
      data: {
        title: "Guerre et Paix",
        description: "Fresque monumentale de la société russe pendant les guerres napoléoniennes, suivant le destin de plusieurs familles nobles. Tolstoï entremêle amour, mort, gloire et philosophie dans ce roman considéré comme l'un des plus grands de tous les temps.",
        publication_date: new Date("1869-01-01"),
        authors:         { create: { authorId: TOLSTOI.id } },
        categorisations: { create: { genreId: HISTORIQUE.id } },
        thematisations:  { create: [{ tagId: GUERRE.id }, { tagId: FAMILLE.id }, { tagId: CLASSIQUE.id }] },
      }
    }),
  ]);
  console.log(`✅ ${books.length} livres créés`);

  // ===== UTILISATEURS =====
  // Mot de passe commun : "password123456"
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "alice_lit",
        email: "alice@cercle.fr",
        passwordHash,
        bio: "Passionnée de littérature classique et de philosophie. Lectrice compulsive depuis l'âge de 8 ans. Mon livre préféré : Les Misérables.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      }
    }),
    prisma.user.create({
      data: {
        username: "bob_pages",
        email: "bob@cercle.fr",
        passwordHash,
        bio: "Fan de dystopies et de science-fiction. Je lis un livre par semaine. Convaincu qu'Orwell était prophète.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      }
    }),
    prisma.user.create({
      data: {
        username: "claire_bouquin",
        email: "claire@cercle.fr",
        passwordHash,
        bio: "Libraire de profession, lectrice par passion. Spécialiste de la littérature russe et des romans du XIXe siècle.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=claire",
      }
    }),
    prisma.user.create({
      data: {
        username: "david_roman",
        email: "david@cercle.fr",
        passwordHash,
        bio: "Étudiant en lettres modernes. J'aime les romans qui font réfléchir. Kafka me fascine et m'angoisse en même temps.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      }
    }),
    prisma.user.create({
      data: {
        username: "emma_verso",
        email: "emma@cercle.fr",
        passwordHash,
        bio: "Amatrice de poésie et de romans historiques. Collectionneuse de livres anciens. Mon libraire me connaît par cœur.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      }
    }),
    prisma.user.create({
      data: {
        username: "felix_biblio",
        email: "felix@cercle.fr",
        passwordHash,
        bio: "Professeur de français au lycée. Je lis tout : classiques, contemporains, essais, poésie. La lecture est ma respiration.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=felix",
      }
    }),
    prisma.user.create({
      data: {
        username: "grace_page",
        email: "grace@cercle.fr",
        passwordHash,
        bio: "Traductrice littéraire français-anglais. Je lis toujours dans la langue originale quand c'est possible. Tolstoï en russe, c'est une autre dimension.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
      }
    }),
    prisma.user.create({
      data: {
        username: "hugo_ecrit",
        email: "hugo@cercle.fr",
        passwordHash,
        bio: "Auteur en herbe et lecteur vorace. J'écris des nouvelles le week-end. Le Petit Prince m'a donné envie d'écrire.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=hugo",
      }
    }),
  ]);
  console.log(`✅ ${users.length} utilisateurs créés (mot de passe : "password123456")`);

  const [ALICE, BOB, CLAIRE, DAVID, EMMA, FELIX, GRACE, HUGO_U] = users;

  // ===== FOLLOWS =====
  await Promise.all([
    prisma.follow.create({ data: { userId: ALICE.id,  userFollowedId: BOB.id    } }),
    prisma.follow.create({ data: { userId: ALICE.id,  userFollowedId: CLAIRE.id } }),
    prisma.follow.create({ data: { userId: ALICE.id,  userFollowedId: FELIX.id  } }),
    prisma.follow.create({ data: { userId: BOB.id,    userFollowedId: ALICE.id  } }),
    prisma.follow.create({ data: { userId: BOB.id,    userFollowedId: DAVID.id  } }),
    prisma.follow.create({ data: { userId: CLAIRE.id, userFollowedId: ALICE.id  } }),
    prisma.follow.create({ data: { userId: CLAIRE.id, userFollowedId: GRACE.id  } }),
    prisma.follow.create({ data: { userId: DAVID.id,  userFollowedId: CLAIRE.id } }),
    prisma.follow.create({ data: { userId: EMMA.id,   userFollowedId: ALICE.id  } }),
    prisma.follow.create({ data: { userId: EMMA.id,   userFollowedId: FELIX.id  } }),
    prisma.follow.create({ data: { userId: FELIX.id,  userFollowedId: ALICE.id  } }),
    prisma.follow.create({ data: { userId: FELIX.id,  userFollowedId: CLAIRE.id } }),
    prisma.follow.create({ data: { userId: GRACE.id,  userFollowedId: FELIX.id  } }),
    prisma.follow.create({ data: { userId: HUGO_U.id, userFollowedId: ALICE.id  } }),
    prisma.follow.create({ data: { userId: HUGO_U.id, userFollowedId: EMMA.id   } }),
  ]);
  console.log("✅ Follows créés");

  // ===== REVIEWS =====
  await Promise.all([
    prisma.review.create({ data: { bookId: books[0].id,  userId: ALICE.id,  note: 5, content: "Un chef-d'œuvre absolu. La fresque humaine de Hugo est d'une richesse incomparable. Jean Valjean reste l'un des personnages les plus touchants de toute la littérature." } }),
    prisma.review.create({ data: { bookId: books[0].id,  userId: FELIX.id,  note: 5, content: "Je le fais lire à mes élèves chaque année et je le redécouvre à chaque lecture. Victor Hugo était visionnaire sur les inégalités sociales." } }),
    prisma.review.create({ data: { bookId: books[0].id,  userId: EMMA.id,   note: 4, content: "Magnifique mais certaines digressions historiques ralentissent le rythme. Le fond reste absolument bouleversant." } }),

    prisma.review.create({ data: { bookId: books[2].id,  userId: CLAIRE.id, note: 4, content: "Camus à son meilleur. Court mais d'une profondeur rare. Le style dépouillé colle parfaitement au personnage de Meursault." } }),
    prisma.review.create({ data: { bookId: books[2].id,  userId: DAVID.id,  note: 5, content: "L'absurde rendu avec une précision chirurgicale. Meursault est un personnage qui dérange profondément car il nous renvoie à nos propres conventions." } }),
    prisma.review.create({ data: { bookId: books[2].id,  userId: HUGO_U.id, note: 3, content: "Je comprends pourquoi c'est un classique mais je n'ai pas accroché au personnage. L'écriture est belle cependant." } }),

    prisma.review.create({ data: { bookId: books[3].id,  userId: FELIX.id,  note: 5, content: "La Peste est le roman le plus actuel de Camus. Relu pendant le confinement, il prend une dimension terriblement prémonitoire." } }),
    prisma.review.create({ data: { bookId: books[3].id,  userId: GRACE.id,  note: 5, content: "La solidarité face à l'absurde. Camus montre que même sans Dieu, l'homme peut choisir de se battre pour les autres. Magnifique." } }),

    prisma.review.create({ data: { bookId: books[4].id,  userId: BOB.id,    note: 5, content: "Orwell avait tout prévu. Big Brother, la novlangue, la réécriture de l'histoire... Glaçant de réalisme avec notre monde actuel." } }),
    prisma.review.create({ data: { bookId: books[4].id,  userId: FELIX.id,  note: 5, content: "Essentiel. À lire et relire. La scène de la chambre 101 est parmi les plus terrifiantes de toute la littérature." } }),
    prisma.review.create({ data: { bookId: books[4].id,  userId: GRACE.id,  note: 4, content: "Brillant mais parfois difficile à lire tellement c'est oppressant. C'est voulu, bien sûr, mais il faut s'y préparer." } }),
    prisma.review.create({ data: { bookId: books[4].id,  userId: DAVID.id,  note: 5, content: "Un roman qui vous change. Après 1984, on ne regarde plus les médias ni le langage politique de la même façon." } }),

    prisma.review.create({ data: { bookId: books[6].id,  userId: ALICE.id,  note: 4, content: "Madame Bovary est un portrait saisissant de la condition féminine au XIXe. Flaubert écrit avec une précision et une cruauté qui laissent sans voix." } }),
    prisma.review.create({ data: { bookId: books[6].id,  userId: CLAIRE.id, note: 5, content: "Le style de Flaubert est inégalable. Chaque phrase est ciselée comme un bijou. Emma Bovary est tragique et attachante malgré tout." } }),

    prisma.review.create({ data: { bookId: books[7].id,  userId: DAVID.id,  note: 5, content: "La Métamorphose m'a profondément marqué. Kafka traite l'absurde avec un sérieux qui rend tout encore plus angoissant. Génial." } }),
    prisma.review.create({ data: { bookId: books[7].id,  userId: BOB.id,    note: 4, content: "Perturbant et fascinant. Le fait que la famille s'adapte à cette situation grotesque dit tout sur les mécanismes familiaux." } }),

    prisma.review.create({ data: { bookId: books[9].id,  userId: EMMA.id,   note: 5, content: "Un livre essentiel pour comprendre le féminisme. Beauvoir déconstruit avec rigueur les mythes qui enfermaient les femmes. Toujours d'actualité." } }),
    prisma.review.create({ data: { bookId: books[9].id,  userId: ALICE.id,  note: 5, content: "\"On ne naît pas femme, on le devient.\" Une phrase qui a tout changé. Ce livre devrait être lu par tout le monde." } }),
    prisma.review.create({ data: { bookId: books[9].id,  userId: GRACE.id,  note: 5, content: "En tant que traductrice, j'admire aussi le style. Beauvoir argumente comme un philosophe mais écrit comme une romancière." } }),

    prisma.review.create({ data: { bookId: books[10].id, userId: CLAIRE.id, note: 5, content: "Crime et Châtiment est une plongée vertigineuse dans la psyché humaine. Dostoïevski sonde l'âme avec une précision qui fait frémir." } }),
    prisma.review.create({ data: { bookId: books[10].id, userId: FELIX.id,  note: 5, content: "La scène du meurtre et ses conséquences psychologiques sont parmi les plus intenses que j'aie lues. Dostoïevski est un géant." } }),

    prisma.review.create({ data: { bookId: books[11].id, userId: CLAIRE.id, note: 5, content: "Le testament de Dostoïevski. Les trois frères incarnent trois rapports à la foi et à la liberté. Une œuvre totale, épuisante et sublime." } }),
    prisma.review.create({ data: { bookId: books[11].id, userId: GRACE.id,  note: 5, content: "Lu en traduction anglaise puis en français. Le génie de Dostoïevski transcende les langues. Le chapitre du Grand Inquisiteur est bouleversant." } }),

    prisma.review.create({ data: { bookId: books[12].id, userId: HUGO_U.id, note: 5, content: "Le livre qui m'a donné envie d'écrire. \"On ne voit bien qu'avec le cœur.\" Une sagesse infinie dans un format minuscule." } }),
    prisma.review.create({ data: { bookId: books[12].id, userId: EMMA.id,   note: 5, content: "Je le relis chaque année. À chaque lecture, je le comprends différemment selon ma vie du moment. Un chef-d'œuvre universel." } }),
    prisma.review.create({ data: { bookId: books[12].id, userId: ALICE.id,  note: 4, content: "Poétique et nostalgique. Parfois un peu convenu dans ses messages mais la beauté de l'écriture emporte tout." } }),

    prisma.review.create({ data: { bookId: books[15].id, userId: GRACE.id,  note: 5, content: "Anna Karénine est le roman le plus humain que je connaisse. Tolstoï comprend ses personnages avec une empathie extraordinaire." } }),
    prisma.review.create({ data: { bookId: books[15].id, userId: ALICE.id,  note: 5, content: "La tragédie d'Anna est d'une modernité stupéfiante. Une femme détruite par une société qui lui refuse toute liberté." } }),

    prisma.review.create({ data: { bookId: books[16].id, userId: FELIX.id,  note: 5, content: "Guerre et Paix est intimidant mais chaque page vaut la peine. Tolstoï réfléchit à la guerre, au destin, à la grandeur humaine avec une profondeur unique." } }),
    prisma.review.create({ data: { bookId: books[14].id, userId: FELIX.id,  note: 5, content: "Germinal est Zola au sommet. La descente dans la mine, la grève, la misère... On ressort de ce livre épuisé et révolté. Indispensable." } }),
  ]);
  console.log("✅ Reviews créées");

  // ===== LIKES =====
  await Promise.all([
    prisma.like.create({ data: { bookId: books[0].id,  userId: ALICE.id  } }),
    prisma.like.create({ data: { bookId: books[0].id,  userId: FELIX.id  } }),
    prisma.like.create({ data: { bookId: books[0].id,  userId: DAVID.id  } }),
    prisma.like.create({ data: { bookId: books[2].id,  userId: CLAIRE.id } }),
    prisma.like.create({ data: { bookId: books[2].id,  userId: DAVID.id  } }),
    prisma.like.create({ data: { bookId: books[4].id,  userId: BOB.id    } }),
    prisma.like.create({ data: { bookId: books[4].id,  userId: FELIX.id  } }),
    prisma.like.create({ data: { bookId: books[4].id,  userId: GRACE.id  } }),
    prisma.like.create({ data: { bookId: books[7].id,  userId: DAVID.id  } }),
    prisma.like.create({ data: { bookId: books[9].id,  userId: EMMA.id   } }),
    prisma.like.create({ data: { bookId: books[9].id,  userId: ALICE.id  } }),
    prisma.like.create({ data: { bookId: books[9].id,  userId: GRACE.id  } }),
    prisma.like.create({ data: { bookId: books[10].id, userId: CLAIRE.id } }),
    prisma.like.create({ data: { bookId: books[12].id, userId: HUGO_U.id } }),
    prisma.like.create({ data: { bookId: books[12].id, userId: EMMA.id   } }),
    prisma.like.create({ data: { bookId: books[15].id, userId: GRACE.id  } }),
    prisma.like.create({ data: { bookId: books[16].id, userId: FELIX.id  } }),
  ]);
  console.log("✅ Likes créés");

  // ===== READS =====
  await Promise.all([
    prisma.read.create({ data: { bookId: books[0].id,  userId: ALICE.id  } }),
    prisma.read.create({ data: { bookId: books[6].id,  userId: ALICE.id  } }),
    prisma.read.create({ data: { bookId: books[9].id,  userId: ALICE.id  } }),
    prisma.read.create({ data: { bookId: books[15].id, userId: ALICE.id  } }),
    prisma.read.create({ data: { bookId: books[4].id,  userId: BOB.id    } }),
    prisma.read.create({ data: { bookId: books[5].id,  userId: BOB.id    } }),
    prisma.read.create({ data: { bookId: books[8].id,  userId: BOB.id    } }),
    prisma.read.create({ data: { bookId: books[2].id,  userId: CLAIRE.id } }),
    prisma.read.create({ data: { bookId: books[10].id, userId: CLAIRE.id } }),
    prisma.read.create({ data: { bookId: books[11].id, userId: CLAIRE.id } }),
    prisma.read.create({ data: { bookId: books[7].id,  userId: DAVID.id  } }),
    prisma.read.create({ data: { bookId: books[8].id,  userId: DAVID.id  } }),
    prisma.read.create({ data: { bookId: books[2].id,  userId: DAVID.id  } }),
    prisma.read.create({ data: { bookId: books[9].id,  userId: EMMA.id   } }),
    prisma.read.create({ data: { bookId: books[12].id, userId: EMMA.id   } }),
    prisma.read.create({ data: { bookId: books[1].id,  userId: EMMA.id   } }),
    prisma.read.create({ data: { bookId: books[0].id,  userId: FELIX.id  } }),
    prisma.read.create({ data: { bookId: books[4].id,  userId: FELIX.id  } }),
    prisma.read.create({ data: { bookId: books[14].id, userId: FELIX.id  } }),
    prisma.read.create({ data: { bookId: books[16].id, userId: FELIX.id  } }),
    prisma.read.create({ data: { bookId: books[15].id, userId: GRACE.id  } }),
    prisma.read.create({ data: { bookId: books[11].id, userId: GRACE.id  } }),
    prisma.read.create({ data: { bookId: books[3].id,  userId: GRACE.id  } }),
    prisma.read.create({ data: { bookId: books[12].id, userId: HUGO_U.id } }),
    prisma.read.create({ data: { bookId: books[5].id,  userId: HUGO_U.id } }),
  ]);
  console.log("✅ Reads créés");

  // ===== WISHLISTS =====
  await Promise.all([
    prisma.wishlist.create({ data: { bookId: books[3].id,  userId: ALICE.id,  status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[11].id, userId: ALICE.id,  status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[16].id, userId: ALICE.id,  status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[9].id,  userId: BOB.id,    status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[14].id, userId: BOB.id,    status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[1].id,  userId: CLAIRE.id, status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[13].id, userId: CLAIRE.id, status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[6].id,  userId: DAVID.id,  status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[15].id, userId: DAVID.id,  status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[0].id,  userId: HUGO_U.id, status: "En cours" } }),
    prisma.wishlist.create({ data: { bookId: books[10].id, userId: HUGO_U.id, status: "À lire"   } }),
    prisma.wishlist.create({ data: { bookId: books[13].id, userId: EMMA.id,   status: "À lire"   } }),
  ]);
  console.log("✅ Wishlists créées");

  // ===== GROUPES =====
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Les Classiques",
        description: "Club dédié à la littérature classique française et mondiale. On lit un classique par mois et on en débat ensemble.",
        accessClub: true,
        members: {
          create: [
            { userId: ALICE.id,  role: "admin"     },
            { userId: CLAIRE.id, role: "moderator" },
            { userId: EMMA.id,   role: "member"    },
            { userId: FELIX.id,  role: "member"    },
            { userId: HUGO_U.id, role: "member"    },
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: "Dystopies & SF",
        description: "Pour les amateurs de science-fiction et de romans dystopiques. Parce qu'imaginer le pire est parfois le meilleur moyen d'éviter le pire.",
        accessClub: true,
        members: {
          create: [
            { userId: BOB.id,   role: "admin"  },
            { userId: DAVID.id, role: "member" },
            { userId: GRACE.id, role: "member" },
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: "Philosophie & Essais",
        description: "Club privé pour les passionnés de philosophie et d'essais littéraires. Beauvoir, Sartre, Camus... les grandes idées nous font vivre.",
        accessClub: false,
        members: {
          create: [
            { userId: CLAIRE.id, role: "admin"     },
            { userId: ALICE.id,  role: "moderator" },
            { userId: GRACE.id,  role: "member"    },
            { userId: FELIX.id,  role: "member"    },
          ]
        }
      }
    }),
    prisma.group.create({
      data: {
        name: "Littérature Russe",
        description: "Dostoïevski, Tolstoï, Tchekhov... La littérature russe est un continent à part entière. Venez explorer ces âmes tourmentées avec nous.",
        accessClub: true,
        members: {
          create: [
            { userId: CLAIRE.id, role: "admin"  },
            { userId: GRACE.id,  role: "member" },
            { userId: FELIX.id,  role: "member" },
            { userId: EMMA.id,   role: "member" },
          ]
        }
      }
    }),
  ]);
  console.log(`✅ ${groups.length} groupes créés`);

  // ===== MESSAGES DE GROUPE =====
  await Promise.all([
    prisma.groupMessage.create({ data: { content: "Bienvenue dans le club Les Classiques ! Ce mois-ci on attaque Les Misérables.", groupId: groups[0].id, userId: ALICE.id   } }),
    prisma.groupMessage.create({ data: { content: "Je propose qu'on commence par la partie Fantine pour la semaine prochaine.", groupId: groups[0].id, userId: CLAIRE.id  } }),
    prisma.groupMessage.create({ data: { content: "J'ai déjà commencé ma relecture. La scène des chandeliers de l'évêque est toujours aussi forte.", groupId: groups[0].id, userId: FELIX.id   } }),
    prisma.groupMessage.create({ data: { content: "C'est mon premier Hugo, j'espère être à la hauteur !", groupId: groups[0].id, userId: HUGO_U.id  } }),
    prisma.groupMessage.create({ data: { content: "N'hésite pas à poser des questions, on est là pour ça.", groupId: groups[0].id, userId: ALICE.id   } }),
    prisma.groupMessage.create({ data: { content: "Prochaine lecture : 1984 d'Orwell. Indétrônable.", groupId: groups[1].id, userId: BOB.id    } }),
    prisma.groupMessage.create({ data: { content: "J'ai adoré la relecture de 1984. Le concept de novlangue est terriblement d'actualité.", groupId: groups[1].id, userId: DAVID.id  } }),
    prisma.groupMessage.create({ data: { content: "On enchaîne avec La Ferme des animaux le mois prochain ?", groupId: groups[1].id, userId: GRACE.id  } }),
    prisma.groupMessage.create({ data: { content: "Parfait ! Orwell en deux tomes c'est le programme idéal.", groupId: groups[1].id, userId: BOB.id    } }),
    prisma.groupMessage.create({ data: { content: "On commence par Le Deuxième Sexe de Beauvoir. 70 ans après, c'est toujours révolutionnaire.", groupId: groups[2].id, userId: CLAIRE.id } }),
    prisma.groupMessage.create({ data: { content: "Je l'ai relu récemment. La partie sur les mythes de la féminité est particulièrement brillante.", groupId: groups[2].id, userId: GRACE.id  } }),
    prisma.groupMessage.create({ data: { content: "Est-ce qu'on peut aussi lire L'Existentialisme est un humanisme de Sartre pour compléter ?", groupId: groups[2].id, userId: FELIX.id  } }),
    prisma.groupMessage.create({ data: { content: "Premier livre du club : Crime et Châtiment. Préparez-vous à une lecture intense.", groupId: groups[3].id, userId: CLAIRE.id } }),
    prisma.groupMessage.create({ data: { content: "La psychologie de Raskolnikov est d'une profondeur incroyable. Dostoïevski était un visionnaire.", groupId: groups[3].id, userId: GRACE.id  } }),
    prisma.groupMessage.create({ data: { content: "J'enchaîne direct avec Les Frères Karamazov, je ne peux pas m'arrêter.", groupId: groups[3].id, userId: FELIX.id  } }),
  ]);
  console.log("✅ Messages de groupe créés");

  // ===== MESSAGES PRIVÉS =====
  await Promise.all([
    prisma.message.create({ data: { content: "Salut Alice ! Tu as lu Crime et Châtiment ? Je viens de terminer et je suis bouleversée.", senderId: CLAIRE.id, receiverId: ALICE.id,  read: true  } }),
    prisma.message.create({ data: { content: "Oui ! Un chef-d'œuvre. La descente psychologique de Raskolnikov est terrifiante. Tu as lu Les Frères Karamazov aussi ?", senderId: ALICE.id,  receiverId: CLAIRE.id, read: true  } }),
    prisma.message.create({ data: { content: "Pas encore, c'est sur ma liste. Tu rejoins le club Littérature Russe ?", senderId: CLAIRE.id, receiverId: ALICE.id,  read: false } }),
    prisma.message.create({ data: { content: "Bob, tu as une bonne intro à la SF à me conseiller pour quelqu'un qui débute ?", senderId: DAVID.id,  receiverId: BOB.id,    read: true  } }),
    prisma.message.create({ data: { content: "Commence par 1984 d'Orwell, c'est le meilleur point d'entrée. Court, puissant, universel.", senderId: BOB.id,    receiverId: DAVID.id,  read: true  } }),
    prisma.message.create({ data: { content: "Félix, je cherche des conseils pour faire lire Kafka à des lycéens sans les traumatiser !", senderId: ALICE.id,  receiverId: FELIX.id,  read: true  } }),
    prisma.message.create({ data: { content: "La Métamorphose est parfaite pour ça. Courte, intrigante, et elle ouvre des débats passionnants sur la famille et l'identité.", senderId: FELIX.id,  receiverId: ALICE.id,  read: false } }),
    prisma.message.create({ data: { content: "Grace, tu as lu Guerre et Paix en russe ? Comment c'était ?", senderId: CLAIRE.id, receiverId: GRACE.id,  read: true  } }),
    prisma.message.create({ data: { content: "Une expérience unique. La traduction française est très bonne, mais en russe le rythme est différent. Je te conseille la traduction de Sylvie Luneau.", senderId: GRACE.id,  receiverId: CLAIRE.id, read: true  } }),
  ]);
  console.log("✅ Messages privés créés");

  // ===== ÉVÉNEMENTS =====
  await Promise.all([
    prisma.event.create({
      data: {
        title: "Rencontre autour des Misérables",
        description: "Discussion approfondie sur l'œuvre de Victor Hugo. On parlera de Jean Valjean, Javert et la question de la rédemption.",
        eventDate: new Date("2026-05-15T19:00:00"),
        link: "https://meet.google.com/example1",
        groupId: groups[0].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "1984 : toujours d'actualité ?",
        description: "Analyse du roman d'Orwell à la lumière du monde contemporain. Surveillance numérique, fake news, novlangue politique...",
        eventDate: new Date("2026-05-22T20:00:00"),
        link: "https://meet.google.com/example2",
        groupId: groups[1].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "Beauvoir & le féminisme aujourd'hui",
        description: "Lecture collective du Deuxième Sexe. On discutera des avancées depuis 1949 et des combats qui restent à mener.",
        eventDate: new Date("2026-06-01T18:30:00"),
        link: "https://meet.google.com/example3",
        groupId: groups[2].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "L'âme russe selon Dostoïevski",
        description: "Soirée spéciale consacrée à Dostoïevski. On comparera Crime et Châtiment avec Les Frères Karamazov. Intervenante : Grace, traductrice littéraire.",
        eventDate: new Date("2026-06-10T19:30:00"),
        link: "https://meet.google.com/example4",
        groupId: groups[3].id,
      }
    }),
    prisma.event.create({
      data: {
        title: "Les classiques du XIXe : pourquoi les lire encore ?",
        description: "Table ronde autour des classiques français. Hugo, Flaubert, Zola, Stendhal... Qu'est-ce qui fait qu'un livre traverse les siècles ?",
        eventDate: new Date("2026-06-20T18:00:00"),
        link: "https://meet.google.com/example5",
        groupId: groups[0].id,
      }
    }),
  ]);
  console.log("✅ Événements créés");

  // ===== ARTICLES DE BLOG =====
  await Promise.all([
    prisma.blog.create({
      data: {
        title: "Pourquoi lire Dostoïevski en 2026 ?",
        content: "Dans un monde en crise, les romans de Dostoïevski résonnent avec une force particulière. Crime et Châtiment, Le Joueur, Les Frères Karamazov... autant d'œuvres qui plongent dans les abîmes de l'âme humaine avec une acuité que peu d'auteurs ont égalée. Dostoïevski ne juge pas ses personnages, il les comprend. Et c'est cette compréhension totale, presque christique, qui rend ses romans si bouleversants.",
        category: "Critique",
        userId: CLAIRE.id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Top 5 des dystopies incontournables",
        content: "1984 (Orwell), Le Meilleur des Mondes (Huxley), Fahrenheit 451 (Bradbury), La Servante Écarlate (Atwood), Nous Autres (Zamiatine)... Ces cinq œuvres ont inventé un genre et continuent d'irriguer l'imaginaire collectif. Elles nous posent toutes la même question : jusqu'où sommes-nous prêts à sacrifier notre liberté pour notre sécurité ?",
        category: "Sélection",
        userId: BOB.id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Interview : rencontre avec une libraire passionnée",
        content: "Claire tient la librairie 'Le Cercle' depuis dix ans. Elle nous parle de ses coups de cœur, de l'évolution du marché du livre et de l'importance des clubs de lecture pour recréer du lien social autour des œuvres littéraires.",
        category: "Interview",
        userId: ALICE.id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Le Petit Prince : un livre pour enfants ?",
        content: "On a souvent tort de ranger Le Petit Prince dans la littérature jeunesse. Ce récit de Saint-Exupéry est une méditation d'adulte sur ce que les adultes ont perdu. L'apprivoisement, la responsabilité, la beauté fragile des choses... Des thèmes qui parlent d'autant plus fort qu'on a vieilli.",
        category: "Critique",
        userId: HUGO_U.id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Traduire Tolstoï : entre fidélité et trahison",
        content: "Travailler sur Anna Karénine m'a appris que traduire, c'est toujours choisir. La langue de Tolstoï est d'une fluidité naturelle en russe qui devient parfois lourde en français. Comment rendre la légèreté d'un dialogue tout en conservant la densité philosophique ? C'est l'impossible équation du traducteur.",
        category: "Réflexion",
        userId: GRACE.id,
      }
    }),
    prisma.blog.create({
      data: {
        title: "Kafka en classe de terminale : retour d'expérience",
        content: "Faire lire La Métamorphose à des élèves de 17 ans est un pari risqué mais extraordinairement fructueux. La confusion initiale laisse place à des discussions profondes sur la famille, l'utilité sociale et l'identité. Kafka parle à la jeunesse mieux qu'on ne le croit.",
        category: "Pédagogie",
        userId: FELIX.id,
      }
    }),
  ]);
  console.log("✅ Articles de blog créés");

  // ===== BADGES UTILISATEURS =====
  await Promise.all([
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: ALICE.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[2].id, userId: ALICE.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[4].id, userId: ALICE.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: BOB.id    } }),
    prisma.userBadge.create({ data: { badgeId: badges[1].id, userId: BOB.id    } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: CLAIRE.id } }),
    prisma.userBadge.create({ data: { badgeId: badges[1].id, userId: CLAIRE.id } }),
    prisma.userBadge.create({ data: { badgeId: badges[2].id, userId: CLAIRE.id } }),
    prisma.userBadge.create({ data: { badgeId: badges[3].id, userId: CLAIRE.id } }),
    prisma.userBadge.create({ data: { badgeId: badges[7].id, userId: CLAIRE.id } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: DAVID.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: EMMA.id   } }),
    prisma.userBadge.create({ data: { badgeId: badges[6].id, userId: EMMA.id   } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: FELIX.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[1].id, userId: FELIX.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[3].id, userId: FELIX.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[5].id, userId: FELIX.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: GRACE.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[7].id, userId: GRACE.id  } }),
    prisma.userBadge.create({ data: { badgeId: badges[0].id, userId: HUGO_U.id } }),
  ]);
  console.log("✅ Badges utilisateurs créés");

  // ===== RECOMMANDATIONS =====
  await Promise.all([
    prisma.bookRecommendation.create({ data: { score: 98, bookId: books[0].id,  userId: ALICE.id  } }),
    prisma.bookRecommendation.create({ data: { score: 95, bookId: books[2].id,  userId: ALICE.id  } }),
    prisma.bookRecommendation.create({ data: { score: 92, bookId: books[4].id,  userId: BOB.id    } }),
    prisma.bookRecommendation.create({ data: { score: 88, bookId: books[5].id,  userId: BOB.id    } }),
    prisma.bookRecommendation.create({ data: { score: 97, bookId: books[10].id, userId: CLAIRE.id } }),
    prisma.bookRecommendation.create({ data: { score: 94, bookId: books[11].id, userId: CLAIRE.id } }),
    prisma.bookRecommendation.create({ data: { score: 85, bookId: books[7].id,  userId: DAVID.id  } }),
    prisma.bookRecommendation.create({ data: { score: 91, bookId: books[9].id,  userId: EMMA.id   } }),
    prisma.bookRecommendation.create({ data: { score: 96, bookId: books[16].id, userId: FELIX.id  } }),
    prisma.bookRecommendation.create({ data: { score: 99, bookId: books[15].id, userId: GRACE.id  } }),
    prisma.bookRecommendation.create({ data: { score: 90, bookId: books[12].id, userId: HUGO_U.id } }),
  ]);
  console.log("✅ Recommandations créées");

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("📧 Comptes disponibles (mot de passe : password123456) :");
  console.log("   alice@cercle.fr | bob@cercle.fr | claire@cercle.fr | david@cercle.fr");
  console.log("   emma@cercle.fr  | felix@cercle.fr | grace@cercle.fr | hugo@cercle.fr");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
