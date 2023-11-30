// const Query = {
//   Query: {
//     games() {
//       console.log("GAME!");
//     }
//   }
// };
//
// const Games = {
//   Games: {
//     reviews() {
//       console.log("REVIEWS!");
//     }
//   }
// };
//
// const resolvers = {
//   ...Query,
//   ...Games
// };
//
// console.log(resolvers);
//
// const sentence = "hello world";
//
// const print = (string) => {
//   let temp = "";
//
//   for (let index = 0; index <= string.length; index++) {
//     if (string.charAt(index) === " ") {
//       temp += string.charAt(index);
//     } else {
//       for (let letter = "a".charCodeAt(0); letter <= string.charAt(index).toLowerCase().charCodeAt(0); letter++) {
//         console.log(temp + String.fromCharCode(letter));
//         if (letter === string.charAt(index).toLowerCase().charCodeAt(0))
//           temp += String.fromCharCode(letter);
//       }
//     }
//   }
// };
//
// print(sentence);

const dt = {
  Games: {
    reviews() {
      console.log("REVIEWS!");
    }
  }
};

console.log(typeof JSON.stringify(dt));