export const createShareString = (day: number, board: App.boardState) => {
  const prirdle_number = day-52;

  const guesses = [...board.boardState];
  const newGuesses = guesses.map((state, i) => {
    const chars = [...state];
    const newChars = chars.map((val, j) => {
      const index = i * 5 + j;
      switch (board.colors[index]) {
        case 0:
          return '🟩'
        case 1:
          return '🟨'
        case 2:
          return '⬛';
      }
    })

    return newChars.reduce((a,b) => a+b, '');
  })

  let finalString = `Prirdle ${prirdle_number} ${guesses.length}/7 \n`
  newGuesses.forEach((val) => {
    finalString+=`${val}\n`
  })
  return finalString;
}
