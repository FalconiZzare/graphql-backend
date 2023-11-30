CREATE (:Game {id: 45, title: "FC255", platform: ['PS5', 'Xbox', 'PC']})
MATCH (n) return n
MATCH p=()-[:REVIEWS]->() RETURN p
