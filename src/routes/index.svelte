<script lang="ts">
  import { DAY_SKIP, primes, shuffled_primes } from '../constants';
  import { show, curBoard, stats } from '../store';
  import { onMount } from 'svelte';

  let rightGuess;
  let guessed;

  let keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let keypadColors = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const temp = new Array(35);
  let curGuess = '';
  let pastGuesses: string[] = [];

  function handleKeydown(event) {
    const key: string = event.key;
    if (/^-?\d+$/.test(key) && curGuess.length < 5 && !guessed) {
      curGuess += `${key}`;
    } else if (key === 'Backspace') {
      curGuess = curGuess.substring(0, curGuess.length - 1);
    } else if (
      key === 'Enter' &&
      curGuess.length === 5 &&
      primes.includes(curGuess)
    ) {
      pastGuesses.push(curGuess);
      curGuess = '';
    }
  }
  const addToGuess = (n: number) => {
    if (curGuess.length < 5 && !guessed) {
      curGuess += `${n}`;
    }
  };
  const getValues = (pg: string[], cg: string) => {
    let final = [];

    pastGuesses.forEach((val) => {
      final = [...final, ...val];
    });

    return [...final, ...curGuess];
  };
  const getColors = (pg: string[], cg: string) => {
    let final = [];

    pastGuesses.forEach((val) => {
      let tempRight = new String(rightGuess);
      let tempFinal = [];
      [...val].forEach((char, i) => {
        if (char === tempRight.charAt(i)) {
          tempRight = tempRight.slice(0, i) + 'a' + tempRight.slice(i + 1);
          tempFinal.push(0);
          keypadColors[parseInt(char)] = 0;
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
      if (tempFinal.reduce((a, b) => a + b, 0) === 0) endGame(true);
    });

    if (pastGuesses.length === 7) endGame(false);

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
    }
  };

  $: values = getValues(pastGuesses, curGuess);
  $: colors = getColors(pastGuesses, curGuess);
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
    guessed = $curBoard.hasGuessed;
    pastGuesses = [...$curBoard.boardState];
  });

  const updateCurBoard = (pg: string[], cg: string, g: boolean) => {
    if ($curBoard) {
      $curBoard.hasGuessed = g;
      $curBoard.boardState = pg;
      $curBoard.colors = colors;
      localStorage.setItem('cur-board', JSON.stringify($curBoard));
    }
  };

  function daysIntoYear(date) {
    return (
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="w-screen h-full bg-[#121213]  flex flex-col justify-center items-center text-white"
>
  <header
    class="h-14 w-full flex items-center justify-center font-sans text-3xl font-semibold border-b border-[#3a3a3c]"
  >
    <p class="mx-auto">Prirdle</p>
    <span class="mx-2 text-white" on:click={() => ($show = !$show)}>
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
      class="small:w-[320px] w-[240px] h-full mx-auto flex items-center justify-center"
    >
      <div
        class="grid grid-cols-5 grid-rows-7 small:w-[320px] w-[240px] small:h-[448px] h-[336px] text-center"
      >
        {#each temp as _, i}
          {#key values[i]}
            <div
              class={`small:w-[62px] small:h-[62px] w-[46.5px] h-[46.5px] flex items-center justify-center  text-3xl font-semibold ${
                colors[i] === 2 || colors[i] === 1 || colors[i] === 0
                  ? 'border-none animate-none'
                  : values[i]
                  ? 'border-2 border-[#565758] animate-scale'
                  : 'border-2 border-[#3a3a3c] animate-none'
              } ${
                colors[i] === 0
                  ? 'bg-[#538d4e]'
                  : colors[i] === 1
                  ? 'bg-[#B59F3B]'
                  : colors[i] === 2
                  ? 'bg-[#3a3a3c]'
                  : ''
              }`}
            >
              {values[i] ?? ''}
            </div>
          {/key}
        {/each}
      </div>
    </div>
  </main>
  <footer class="mb-2">
    <div class="grid grid-cols-3 grid-rows-3 gap-2 w-[145px] mx-auto">
      {#each keypad as digit, i}
        <div
          on:click={() => {
            addToGuess(digit);
          }}
          class={`w-[43px] h-[58px] rounded text-xl font-semibold flex items-center justify-center  ${
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
        on:click={() => {
          if (curGuess.length === 5 && primes.includes(curGuess)) {
            pastGuesses.push(curGuess);
            curGuess = '';
          }
        }}
        class="w-[100px] h-[58px] rounded text-xl font-semibold flex items-center justify-center bg-[#818384]"
      >
        Enter
      </div>
      <div
        on:click={() => {
          addToGuess(0);
        }}
        class={`w-[43px] h-[58px] rounded text-xl font-semibold flex items-center justify-center ${
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
        class="w-[100px] h-[58px] rounded text-xl font-semibold flex items-center justify-center bg-[#818384]"
      >
        Backspace
      </div>
    </div>
  </footer>
</div>
