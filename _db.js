// const games = [
//   { id: "1", title: "Zelda, Tears of the Kingdom", platform: ["Switch"] },
//   { id: "2", title: "Final Fantasy 7 Remake", platform: ["PS5", "Xbox"] },
//   { id: "3", title: "Elden Ring", platform: ["PS5", "Xbox", "PC"] },
//   { id: "4", title: "Mario Kart", platform: ["Switch"] },
//   { id: "5", title: "Pokemon Scarlet", platform: ["PS5", "Xbox", "PC"] }
// ];
//
// const authors = [
//   { id: "1", name: "mario", verified: true },
//   { id: "2", name: "yoshi", verified: false },
//   { id: "3", name: "peach", verified: true }
// ];
//
// const reviews = [
//   { id: "1", rating: 9, content: "lorem ipsum", author_id: "1", game_id: "2" },
//   { id: "2", rating: 10, content: "lorem ipsum", author_id: "2", game_id: "1" },
//   { id: "3", rating: 7, content: "lorem ipsum", author_id: "3", game_id: "3" },
//   { id: "4", rating: 5, content: "lorem ipsum", author_id: "2", game_id: "4" },
//   { id: "5", rating: 8, content: "lorem ipsum", author_id: "2", game_id: "5" },
//   { id: "6", rating: 7, content: "lorem ipsum", author_id: "1", game_id: "2" },
//   { id: "7", rating: 10, content: "lorem ipsum", author_id: "3", game_id: "1" }
// ];
//
// module.exports = { games, authors, reviews };

// INSERT INTO authors (id, name, verified, "createdAt", "updatedAt")
// VALUES
// (1, 'mario', true, '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (2, 'yoshi', false, '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (3, 'peach', true, '2023-10-15 15:30:00', '2023-10-15 15:30:00');
//
// INSERT INTO games (id, title, platform, "createdAt", "updatedAt")
// VALUES
// (1, 'Zelda, Tears of the Kingdom', ARRAY['Switch'], '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (2, 'Final Fantasy 7 Remake', ARRAY['PS5', 'Xbox'], '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (3, 'Elden Ring', ARRAY['PS5', 'Xbox', 'PC'], '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (4, 'Mario Kart', ARRAY['Switch'], '2023-10-15 15:30:00', '2023-10-15 15:30:00'),
//   (5, 'Pokemon Scarlet', ARRAY['PS5', 'Xbox', 'PC'], '2023-10-15 15:30:00', '2023-10-15 15:30:00');
//
// INSERT INTO reviews (id, rating, content,  "createdAt", "updatedAt", "authorId", "gameId")
// VALUES
// (1, 9, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 1, 2),
//   (2, 10, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 2, 1),
//   (3, 7, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 3, 3),
//   (4, 5, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 2, 4),
//   (5, 8, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 2, 5),
//   (6, 7, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 1, 2),
//   (7, 10, 'lorem ipsum', '2023-10-15 15:30:00', '2023-10-15 15:30:00', 3, 1);



// // Create Authors
// CREATE (:Author {id: 1, name: 'mario', verified: true, createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Author {id: 2, name: 'yoshi', verified: false, createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Author {id: 3, name: 'peach', verified: true, createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Author {id: 3, name: 'peach', verified: true, createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
//
// // Create Games
// CREATE (:Game {id: 1, title: 'Zelda, Tears of the Kingdom', platform: ['Switch'], createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Game {id: 2, title: 'Final Fantasy 7 Remake', platform: ['PS5', 'Xbox'], createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Game {id: 3, title: 'Elden Ring', platform: ['PS5', 'Xbox', 'PC'], createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Game {id: 4, title: 'Mario Kart', platform: ['Switch'], createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
// CREATE (:Game {id: 5, title: 'Pokemon Scarlet', platform: ['PS5', 'Xbox', 'PC'], createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})
//
// // Create Reviews and Relationships
// MATCH (a:Author), (g:Game)
// WHERE a.id = 1 AND g.id = 2
// CREATE (a)-[:WROTE]->(r1:Review {id: 1, rating: 9, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 2 AND g.id = 1
// CREATE (a)-[:WROTE]->(r2:Review {id: 2, rating: 10, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 3 AND g.id = 3
// CREATE (a)-[:WROTE]->(r3:Review {id: 3, rating: 7, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 2 AND g.id = 4
// CREATE (a)-[:WROTE]->(r4:Review {id: 4, rating: 5, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 2 AND g.id = 5
// CREATE (a)-[:WROTE]->(r5:Review {id: 5, rating: 8, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 1 AND g.id = 2
// CREATE (a)-[:WROTE]->(r6:Review {id: 6, rating: 7, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
//
// MATCH (a:Author), (g:Game)
// WHERE a.id = 3 AND g.id = 1
// CREATE (a)-[:WROTE]->(r7:Review {id: 7, rating: 10, content: 'lorem ipsum', createdAt: '2023-10-15 15:30:00', updatedAt: '2023-10-15 15:30:00'})-[:REVIEWS]->(g)
