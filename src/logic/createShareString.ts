export const createShareString = (day: number, board: App.boardState, expert: boolean, win: boolean) => {
  const prirdle_number = day-52;

  console.log({board, expert})

  const guesses = expert ? new Array(7).fill("00000") : [...board.boardState];

  console.log(guesses)

  const newGuesses = guesses.map((state, i) => {
    const chars = [...state];
    const newChars = chars.map((val, j) => {
      const index = i * 5 + j;
      console.log(board.colors[index])
      switch (board.colors[index]) {
        case 0:
          return '🟩'
        case 1:
          return '🟨'
        case 2:
          return '⬛';
        case 4:
          console.log("AHHH")
          if(expert) {
            console.log("AHHH2")
            return '🟥'
          }
          break
        default:
          return ''

      }
    })

    return newChars.reduce((a,b) => a+b, '');
  })

  let finalString = `Prirdle${expert ? " (Expert!)" : ""} ${prirdle_number} ${win ?[...board.boardState].length : "x"}/7 \n`
  newGuesses.forEach((val) => {
    finalString+=`${val}\n`
  })
  return finalString;
}
