<script lang="ts">
  import { onMount } from 'svelte';
  import { createShareString } from '../logic/createShareString';
  export let _show: boolean;
  import { stats, curBoard, show } from '../store';

  const getTimeToNextDay = () => {
    //calculate time to next day
    const now = new Date();
    const nextDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const diff = nextDay.getTime() - now.getTime();
    //turn dif to hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    return `${hours < 10 ? `0${hours.toFixed(0)}` : hours.toFixed(0)}:${
      minutes < 10 ? `0${minutes.toFixed(0)}` : minutes.toFixed(0)
    }:${seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)}`;
  };

  let time = getTimeToNextDay();

  onMount(() => {
    const animate = () => {
      time = getTimeToNextDay();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });

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

  const mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    return check;
  };
  $: guessesArray = [...Object.entries($stats?.guesses ?? {})];
</script>

<div
  class={`border border-[#1a1a1b] sm:w-[500px] h-max sm:aspect-auto w-11/12 aspect-square sm:aspect-auto bg-[#121213] rounded-md absolute inset-0 m-auto z-20  origin-bottom transition-all flex items-center justify-center${
    _show
      ? 'opacity-100 pointer-events-auto scale-100'
      : 'opacity-0 pointer-events-none scale-0'
  }`}
>
  <div
    class="sm:w-[500px] sm:aspect-auto w-11/12 aspect-square relative flex flex-col text-white px-2 py-4 items-center justify-center mx-auto"
  >
    <span
      class="absolute top-4 right-4 aspect-square"
      on:click={() => {
        $show = false;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          fill="#fff"
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
      </svg>
    </span>
    <span
      class="m-3 flex items-center justify-center h-5 text-lg font-semibold"
    >
      STATISTICS
    </span>
    <span
      class="flex items-center justify-center h-20 flex-row items-center justify-center gap-2"
    >
      <div class="flex flex-col w-14 h-[70px]">
        <span class="text-4xl font-semibold flex items-center justify-center">
          {$stats?.played}
        </span>
        <span class="text-xs flex items-center justify-center text-center"
          >Played</span
        >
      </div>
      <div class="flex flex-col w-14 h-[70px]">
        <span class="text-4xl font-semibold flex items-center justify-center">
          {$stats?.played
            ? ((100 * $stats?.wins) / $stats?.played).toFixed(0)
            : 0}
        </span>
        <span class="text-xs flex items-center justify-center text-center"
          >Win %</span
        >
      </div>
      <div class="flex flex-col w-14 h-[70px]">
        <span class="text-4xl font-semibold flex items-center justify-center">
          {$stats?.streak}
        </span>
        <span class="text-xs flex items-center justify-center text-center">
          Current Streak
        </span>
      </div>
      <div class="flex flex-col w-14 h-[70px]">
        <span class="text-4xl font-semibold flex items-center justify-center">
          {$stats?.maxStreak}
        </span>
        <span class="text-xs flex items-center justify-center text-center"
          >Max Streak</span
        >
      </div>
    </span>
    <span
      class="m-3 flex items-center justify-center h-5 text-lg font-semibold"
    >
      GUESS DISTRIBUTION
    </span>
    <span class="flex flex-col items-center justify-center h-56 w-full px-14">
      {#each guessesArray as guess}
        {#if guess[0] !== 'fail'}
          <span class="flex flex-row w-full">
            <span>{guess[0]}</span>
            <span
              class="bg-[#3a3a3c] my-[2px] mx-2 px-2 rounded-sm"
              style={`width: ${(guess[1] * 100) / $stats.wins}%`}
            >
              <p class="ml-auto w-min">{guess[1]}</p>
            </span>
          </span>
        {/if}
      {/each}
    </span>
    {#if $curBoard?.hasGuessed}
      <span class="divide-x-2 divide-white grid w-full grid-cols-2 grid-rows-1">
        <div class="flex flex-col gap-2">
          <span
            class="smallish:text-lg text-sm font-semibold uppercase text-cente flex items-center justify-center"
            >Next Prirdle</span
          >
          <span
            class="smallish:text-4xl text-2xl font-semibold uppercase text-cente flex items-center justify-center"
            >{time}</span
          >
        </div>
        <div class="w-full h-full flex items-center justify-center">
          <button
            class="bg-[#538d4e] hover:bg-[#4c8048] smallish:px-6 smallish:py-2 px-4 py-2 smallish:text-2xl text-lg font-semibold rounded-md flex flex-row gap-4 items-center justify-center"
            on:click={() => {
              const shareString = createShareString(
                daysIntoYear(new Date()),
                $curBoard
              );
              if (navigator) {
                if (navigator.share) {
                  const isMobile = mobileAndTabletCheck();
                  if (isMobile) {
                    const shareData = {
                      title: 'Prirdle Game',
                      text: shareString,
                      url: 'https://www.prirdle.com',
                    };
                    navigator.share(shareData);
                  } else {
                    navigator.clipboard.writeText(shareString);
                  }
                }
              }
            }}
          >
            <p class="h-full">Share</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="small:h-[24px] small:w-[24px] w-[16px] h-[16px]"
            >
              <path
                fill="#fff"
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
              />
            </svg>
          </button>
        </div>
      </span>
    {/if}
  </div>
</div>
