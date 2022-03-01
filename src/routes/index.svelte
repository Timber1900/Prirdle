<script lang="ts">
  import { DAY_SKIP, primes, shuffled_primes } from '../constants';
  import { show, curBoard, stats, infos, expertMode, win } from '../store';
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';

  let rightGuess;
  let guessed;
  let lines: number;
  let expertStrikes: number;
  let revealed = new Array(5).fill(false);
  let states: string[] = new Array(35).fill('idle');
  let colorStates: number[] = new Array(35).fill(undefined);

  let keypadColors = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  let animate: boolean[] = new Array(7).fill(false);
  let _animate: boolean[] = new Array(7).fill(false);
  let initialGuesses: string[] = [];
  let initialLines: number;

  let x_s = new Array(7);
  const y_s = new Array(5);
  let curGuess = '';
  let pastGuesses: string[] = [];

  $: values = getValues(pastGuesses, curGuess);
  $: colors = getColors(pastGuesses, curGuess, true);
  $: {
    updateCurBoard(pastGuesses, curGuess, guessed);
    updateExpert($expertMode);
  }

  onMount(() => {
    let local_stats: App.Stats | null = JSON.parse(
      localStorage.getItem('board-stats')
    );
    if (!local_stats) {
      const blankStats: App.Stats = {
        guesses: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          '6': 0,
          '7': 0,
          fail: 0,
        },
        maxStreak: 0,
        played: 0,
        streak: 0,
        wins: 0,
        lastDayAdded: 0,
      };

      localStorage.setItem('board-stats', JSON.stringify(blankStats));
      $stats = blankStats;
    } else {
      $stats = local_stats;
    }

    let _curBoard: App.boardState | null = JSON.parse(
      localStorage.getItem('cur-board')
    );

    console.log(_curBoard);

    const days = daysIntoYear(new Date());

    if (!_curBoard) {
      const blankBoard: App.boardState = {
        boardState: [],
        date: days,
        hasGuessed: false,
        solution: shuffled_primes[days + DAY_SKIP],
        //DEV LINE
        // |
        // v
        // solution:
        //   shuffled_primes[Math.floor(Math.random() * shuffled_primes.length)],
        colors,
        expertStrikes: 0,
        lines: 7,
      };
      localStorage.setItem('cur-board', JSON.stringify(blankBoard));
      $curBoard = blankBoard;
    } else {
      if (_curBoard.date !== days) {
        const blankBoard: App.boardState = {
          boardState: [],
          date: days,
          hasGuessed: false,
          solution: shuffled_primes[days + DAY_SKIP],
          colors,
          expertStrikes: 0,
          lines: 7,
        };
        $curBoard = blankBoard;
      } else {
        $curBoard = _curBoard;
      }
    }

    rightGuess = $curBoard.solution;
    // rightGuess = '49597';
    guessed = $curBoard.hasGuessed;
    pastGuesses = [...$curBoard.boardState];
    initialGuesses = [...pastGuesses];
    expertStrikes = $curBoard.expertStrikes ?? 0;
    lines = $curBoard.lines ?? 7;
    initialLines = JSON.parse(JSON.stringify(lines));

    (async () => {
      let tempColors = getColors(pastGuesses, curGuess, false);
      for (let i = 0; i < 5; i++) {
        revealed[i] = true;
        for (let y = 0; y < 7; y++) {
          const index = y * 5 + i;
          setTimeout(() => {
            if (y < lines) {
              colorStates[index] = tempColors[index];
            } else {
              colorStates[index] = 4;
            }
          }, 250);
        }
        await sleep(50);
      }
    })();
  });

  function handleKeydown(event) {
    const key: string = event.key;
    if (/^-?\d+$/.test(key) && curGuess.length < 5 && !guessed) {
      addToGuess(key);
    } else if (key === 'Backspace' && !guessed) {
      curGuess = curGuess.substring(0, curGuess.length - 1);
    } else if (key === 'Enter' && !guessed) {
      submitGuess();
    }
  }

  const updateExpert = (expert: boolean) => {
    const allRevaled = revealed.reduce((a, b) => a && b, true);

    if (expert && allRevaled) {
      for (let i = lines * 5; i < 35; i++) {
        colorStates[i] = 4;
      }
    } else {
      for (let i = lines * 5; i < 35; i++) {
        colorStates[i] = undefined;
      }
    }
  };

  const addToGuess = (n: number | string) => {
    if (curGuess.length < 5 && !guessed) {
      curGuess += `${n}`;
      const index = pastGuesses.length * 5 + curGuess.length - 1;
      states[index] = 'pop';
      setTimeout(() => {
        states[index] = 'idle';
      }, 100);
    }
  };

  const submitGuess = () => {
    if (curGuess.length === 5 && primes.includes(curGuess)) {
      pastGuesses.push(curGuess);
      curGuess = '';

      (async () => {
        for (
          let index = (pastGuesses.length - 1) * 5;
          index < pastGuesses.length * 5;
          index++
        ) {
          states[index] = 'flip-in';
          setTimeout(() => {
            states[index] = 'flip-out';
            colorStates[index] = colors[index];
            setTimeout(() => {
              states[index] = 'idle';
            }, 250);
          }, 250);

          await sleep(250);
        }
      })();
    } else if (curGuess.length === 5 && $expertMode) {
      const callInfo = () => {
        $infos = [...$infos, `Not a prime, ${expertStrikes}/3 strikes`];
        setTimeout(() => {
          $infos = [...$infos.slice(1, $infos.length)];
        }, 1000);

        animate[pastGuesses.length] = !animate[pastGuesses.length];
        _animate[pastGuesses.length] = true;
      };

      if (expertStrikes < 3) {
        expertStrikes++;
        updateCurBoard(pastGuesses, curGuess, guessed);
        callInfo();
      } else {
        callInfo();
        lines--;
        if (lines === pastGuesses.length) {
          endGame(false);
        } else {
          updateCurBoard(pastGuesses, curGuess, guessed);
          for (let i = lines * 5; i < 35; i++) {
            colorStates[i] = 4;
          }
        }
      }
    } else if (curGuess.length === 5) {
      $infos = [...$infos, 'Not in prime list'];
      setTimeout(() => {
        $infos = [...$infos.slice(1, $infos.length)];
      }, 1000);

      animate[pastGuesses.length] = !animate[pastGuesses.length];
      _animate[pastGuesses.length] = true;
    } else if (curGuess.length < 5) {
      $infos = [...$infos, 'Not enough numbers'];
      setTimeout(() => {
        $infos = [...$infos.slice(1, $infos.length)];
      }, 1000);

      animate[pastGuesses.length] = !animate[pastGuesses.length];
      _animate[pastGuesses.length] = true;
    }
  };

  const getValues = (pg: string[], cg: string) => {
    let final = [];
    pg.forEach((val) => {
      final = [...final, ...val];
    });
    return [...final, ...cg];
  };

  const getColors = (pg: string[], cg: string, test: boolean) => {
    let final = [];

    const relaplaceNumber = (s: String, n: number) => {
      return s.slice(0, n) + 'a' + s.slice(n + 1);
    };

    pg.forEach((val) => {
      let tempRight = new String(rightGuess);
      let tempFinal = [];
      let tempGreens = [];

      [...val].forEach((char, i) => {
        if (char === tempRight.charAt(i)) {
          tempRight = relaplaceNumber(tempRight, i);
          tempGreens.push(1);
          keypadColors[parseInt(char)] = 0;
        } else {
          tempGreens.push(0);
        }
      });

      [...val].forEach((char, i) => {
        if (tempGreens[i] === 1) {
          tempFinal.push(0);
        } else if (tempRight.includes(char)) {
          const index = tempRight.indexOf(char);
          tempRight = relaplaceNumber(tempRight, index);
          tempFinal.push(1);
          if (keypadColors[parseInt(char)] !== 0)
            keypadColors[parseInt(char)] = 1;
        } else {
          tempFinal.push(2);
          if (
            keypadColors[parseInt(char)] !== 1 &&
            keypadColors[parseInt(char)] !== 0
          )
            keypadColors[parseInt(char)] = 3;
        }
      });

      final = [...final, ...tempFinal];
      if (tempFinal.reduce((a, b) => a + b, 0) === 0 && test) endGame(true);
    });

    if (pg.length >= lines && !guessed) {
      endGame(false);
    }

    [...cg].forEach((char, i) => {
      final.push(3);
    });

    return final;
  };

  const endGame = (_win: boolean) => {
    guessed = true;
    $win = _win;

    const temp_stats = $stats;
    if (daysIntoYear(new Date()) !== temp_stats.lastDayAdded) {
      temp_stats.played++;
      temp_stats.lastDayAdded = daysIntoYear(new Date());
      if (_win) {
        temp_stats.wins++;
        temp_stats.streak++;
        if (temp_stats.streak > temp_stats.maxStreak)
          temp_stats.maxStreak = temp_stats.streak;
        temp_stats.guesses[pastGuesses.length.toString()]++;
      } else {
        temp_stats.streak = 0;
        temp_stats.guesses.fail++;
      }

      localStorage.setItem('board-stats', JSON.stringify(temp_stats));
      $stats = temp_stats;
    }

    setTimeout(() => {
      $show = true;
    }, 1000);

    if (_win) {
      switch (pastGuesses.length) {
        case 1:
          $infos = [...$infos, 'Prime form'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 2:
          $infos = [...$infos, 'Magnificent'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 3:
          $infos = [...$infos, 'Impressive'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 4:
          $infos = [...$infos, 'Splendid'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 5:
          $infos = [...$infos, 'Great'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 6:
          $infos = [...$infos, 'Phew'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
        case 7:
          $infos = [...$infos, 'Ouch'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
          break;
      }
    } else {
      $infos = [...$infos, rightGuess];
      setTimeout(() => {
        $infos = [...$infos.slice(1, $infos.length)];
      }, 5000);
    }
  };

  const sleep = (ms: number) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res('');
      }, ms);
    });
  };

  const updateCurBoard = (pg: string[], cg: string, g: boolean) => {
    if ($curBoard) {
      console.log($curBoard);
      $curBoard.hasGuessed = g;
      $curBoard.boardState = pg;
      $curBoard.colors = colorStates;
      $curBoard.expertStrikes = expertStrikes;
      $curBoard.lines = lines;
      localStorage.setItem('cur-board', JSON.stringify($curBoard));
    }
  };

  const daysIntoYear = (date) => {
    return (
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  };

  const deleteFunc = () => {
    curGuess = curGuess.substring(0, curGuess.length - 1);
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="w-screen h-full bg-[#121213]  flex flex-col justify-center items-center text-white"
>
  <Header />
  <main class="w-full grow">
    <div
      class="small:w-[320px] w-[240px] w-[calc(75vw+16px)] h-full mx-auto flex items-center justify-center"
    >
      <div
        class="grid grid-cols-1 grid-rows-7 small:w-[320px] w-[calc(75vw+16px)] small:h-[448px] h-[calc(105vw+28px)] text-center"
      >
        {#each x_s as _, x}
          {#key animate[x]}
            <div
              class={`grid grid-cols-5 grid-rows-1 small:w-[320px] w-[calc(75vw+16px)] small:h-[64px] h-[calc(15vw+4px)] text-center ${
                _animate[x] ? 'animate-shake' : ''
              }`}
            >
              {#each y_s as _, y}
                <div
                  class="tile"
                  data-state={colorStates[x * 5 + y] ?? 'empty'}
                  data-animation={states[x * 5 + y]}
                  data-reveal={(initialGuesses[x] || x >= initialLines) &&
                  revealed[y] &&
                  states[x * 5 + y] === 'idle'
                    ? 'yes'
                    : 'no'}
                >
                  {values[x * 5 + y] ?? ''}
                </div>
              {/each}
            </div>
          {/key}
        {/each}
      </div>
    </div>
  </main>
  <Footer {addToGuess} {deleteFunc} {keypadColors} {submitGuess} />
</div>

<style type="text/postcss">
  .tile {
    @apply small:w-[62px] small:h-[62px] w-[15vw] aspect-square small:aspect-auto flex items-center justify-center  text-3xl font-semibold;
  }

  .tile[data-state='empty'] {
    @apply border-[#3a3a3c] border-2;
  }

  .tile[data-state='0'] {
    @apply bg-[#538d4e];
  }

  .tile[data-state='1'] {
    @apply bg-[#B59F3B];
  }

  .tile[data-state='2'] {
    @apply bg-[#3a3a3c];
  }

  .tile[data-state='3'] {
    @apply border-[#565758] border-2;
  }

  .tile[data-state='4'] {
    @apply bg-[#3a3a3c] opacity-70;
  }

  .tile[data-animation='pop'] {
    animation-name: PopIn;
    animation-duration: 100ms;
  }

  @keyframes PopIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }

    40% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  .tile[data-animation='flip-in'] {
    animation-name: FlipIn;
    animation-duration: 250ms;
    animation-timing-function: ease-in;
  }

  @keyframes FlipIn {
    0% {
      transform: rotateX(0);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }

  .tile[data-animation='flip-out'] {
    animation-name: FlipOut;
    animation-duration: 250ms;
    animation-timing-function: ease-in;
  }

  @keyframes FlipOut {
    0% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
    }
  }

  @keyframes Reveal {
    0% {
      transform: rotateX(0);
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
    }
  }

  .tile[data-reveal='yes'] {
    animation: Reveal 500ms cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }
</style>
