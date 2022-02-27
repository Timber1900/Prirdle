<script lang="ts">
  import { DAY_SKIP, primes, shuffled_primes } from '../constants';
  import { show, curBoard, stats, infos } from '../store';
  import { onMount } from 'svelte';

  let rightGuess;
  let guessed;
  let revealed = new Array(5).fill(false);
  let states: string[] = new Array(35).fill('idle');
  let colorStates: number[] = new Array(35).fill(undefined);

  let keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let keypadColors = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  let animate: boolean[] = new Array(7).fill(false);
  let _animate: boolean[] = new Array(7).fill(false);
  let initialGuesses: string[] = [];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const x_s = new Array(7);
  const y_s = new Array(5);
  let curGuess = '';
  let pastGuesses: string[] = [];

  function handleKeydown(event) {
    const key: string = event.key;
    if (/^-?\d+$/.test(key) && curGuess.length < 5 && !guessed) {
      addToGuess(key);
    } else if (key === 'Backspace') {
      curGuess = curGuess.substring(0, curGuess.length - 1);
    } else if (key === 'Enter') {
      submitGuess();
    }
  }

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
    } else if (curGuess.length === 5) {
      $infos = [...$infos, 'Not in prime list'];
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

    pastGuesses.forEach((val) => {
      let tempRight = new String(rightGuess);
      let tempFinal = [];
      let tempGreens = [];

      [...val].forEach((char, i) => {
        if (char === tempRight.charAt(i)) {
          tempRight = tempRight.slice(0, i) + 'a' + tempRight.slice(i + 1);
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
          tempRight =
            tempRight.slice(0, index) + 'a' + tempRight.slice(index + 1);
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

    if (pastGuesses.length === 7 && !guessed) {
      endGame(false);
    }

    [...curGuess].forEach((char, i) => {
      final.push(3);
    });

    return final;
  };

  const endGame = (win: boolean) => {
    guessed = true;

    const temp_stats = $stats;
    if (daysIntoYear(new Date()) !== temp_stats.lastDayAdded) {
      temp_stats.played++;
      temp_stats.lastDayAdded = daysIntoYear(new Date());
      if (win) {
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
        if (win) {
          $infos = [...$infos, 'Ouch'];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
        } else {
          $infos = [...$infos, rightGuess];
          setTimeout(() => {
            $infos = [...$infos.slice(1, $infos.length)];
          }, 5000);
        }
        break;
    }
  };

  $: values = getValues(pastGuesses, curGuess);
  $: colors = getColors(pastGuesses, curGuess, true);
  $: {
    updateCurBoard(pastGuesses, curGuess, guessed);
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

    const days = daysIntoYear(new Date());

    if (!_curBoard) {
      const blankBoard: App.boardState = {
        boardState: [],
        date: days,
        hasGuessed: false,
        solution: shuffled_primes[days + DAY_SKIP],
        colors,
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

    (async () => {
      let tempColors = getColors(pastGuesses, curGuess, false);
      for (let i = 0; i < 5; i++) {
        revealed[i] = true;
        for (let y = 0; y < 7; y++) {
          const index = y * 5 + i;
          setTimeout(() => {
            colorStates[index] = tempColors[index];
          }, 250);
        }
        await sleep(50);
      }
    })();
  });

  const sleep = (ms: number) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res('');
      }, ms);
    });
  };

  const updateCurBoard = (pg: string[], cg: string, g: boolean) => {
    if ($curBoard) {
      $curBoard.hasGuessed = g;
      $curBoard.boardState = pg;
      $curBoard.colors = colors;
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
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="w-screen h-full bg-[#121213]  flex flex-col justify-center items-center text-white"
>
  <header
    class="relative h-14 w-full flex items-center justify-center font-sans text-3xl font-semibold border-b border-[#3a3a3c]"
  >
    <p class="mx-auto">Prirdle</p>
    <span
      class="absolute inset-y-auto right-2 text-white"
      on:click={() => ($show = !$show)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        fill="#fff"
      >
        <path
          d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"
        />
      </svg>
    </span>
  </header>
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
                  data-reveal={initialGuesses[x] &&
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
  <footer class="mb-2">
    <div
      class="grid grid-cols-3 grid-rows-3 gap-2 small:w-[145px] w-[calc(30vw+16px)] mx-auto"
    >
      {#each keypad as digit, i}
        <div
          on:click={() => {
            addToGuess(digit);
          }}
          class={`small:w-[43px] small:h-[58px] aspect-[43/58] w-[10vw] rounded small:text-xl text-base font-semibold flex items-center justify-center  ${
            keypadColors[i + 1] === 0
              ? 'bg-[#538d4e]'
              : keypadColors[i + 1] === 1
              ? 'bg-[#B59F3B]'
              : keypadColors[i + 1] === 3
              ? 'bg-[#3a3a3c]'
              : 'bg-[#818384]'
          }`}
        >
          {digit}
        </div>
      {/each}
    </div>
    <div class="flex flex-row gap-2 mt-2">
      <div
        on:click={submitGuess}
        class="small:w-[100px] small:h-[58px] aspect-[100/58] w-[20vw] rounded small:text-xl text-base font-semibold flex items-center justify-center bg-[#818384]"
      >
        Enter
      </div>
      <div
        on:click={() => {
          addToGuess(0);
        }}
        class={`small:w-[43px] small:h-[58px] aspect-[43/58] w-[10vw] rounded small:text-xl text-base font-semibold flex items-center justify-center ${
          keypadColors[0] === 0
            ? 'bg-[#538d4e]'
            : keypadColors[0] === 1
            ? 'bg-[#B59F3B]'
            : keypadColors[0] === 3
            ? 'bg-[#3a3a3c]'
            : 'bg-[#818384]'
        }`}
      >
        0
      </div>
      <div
        on:click={() => {
          curGuess = curGuess.substring(0, curGuess.length - 1);
        }}
        class="small:w-[100px] small:h-[58px] aspect-[100/58] w-[20vw] rounded small:text-xl text-base font-semibold flex items-center justify-center bg-[#818384]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path
            fill="#fff"
            d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
          />
        </svg>
      </div>
    </div>
  </footer>
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
