var test_input = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const tick = (state) => {
  state.tick++;
  if ((+state.tick - 20) % 40 == 0)
    state.signals.push(+state.value * +state.tick);
};

const process_command = (command, state, tick) => {
  tick(state);
  if (command.type == "addx") {
    tick(state);
    state.value += +command.arg;
  }

  return state;
};
const solution_1 = (input, until = 220) => {
  const state = { tick: 0, value: 1, signals: [] };
  const commands = input.split("\n").map((line) => {
    const [type, arg] = line.split(" ");
    return { type, arg };
  });

  commands.every((command) => {
    process_command(command, state, tick);
    return state.tick <= until;
  });

  // console.log(state);

  return state.signals.reduce((a, c) => +a + +c, 0);
};

console.assert(
  solution_1(test_input) == 13140,
  "The sum of these signal strengths is 13140."
);

// part 2
const solution_2 = (input) => {
  const CRT_width = 40;
  const CRT_height = 6;

  const CRT = Array.from({ length: CRT_height }, (_) => Array(CRT_width));

  const state = { tick: 0, value: 1, signals: [] };
  const commands = input.split("\n").map((line) => {
    const [type, arg] = line.split(" ");
    return { type, arg };
  });

  commands.forEach((command) => {
    const crt_tick = (state) => {
      tick(state);

      // haha, tick offsets current coords by 1
      const x = (state.tick - 1) % CRT_width;
      const y = Math.floor(((state.tick - 1) / CRT_width) % CRT_height);

      const lit = state.value - 1 <= x && state.value + 1 >= x; // one before and one after

      // const marker = Array.from({ length: CRT_width }, (_, i) =>
      //   state.value - 1 <= i && state.value + 1 >= i ? "#" : "."
      // ).join(""); // func to vizualize marker position

      // console.log({ tick: state.tick, x, y, lit, value: state.value, marker });
      CRT[y][x] = lit ? "#" : ".";
    };

    process_command(command, state, crt_tick);

    // console.log(CRT.map((l) => l.join("")).join("\n"));
  });

  console.log(CRT.map((l) => l.join("")).join("\n"));
  return CRT.map((l) => l.join("")).join("\n");
};

console.assert(
  solution_2(test_input) ==
    `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
  "Allowing the program to run to completion causes the CRT to produce the following image:"
);

const input = `noop
addx 12
addx -5
addx -1
noop
addx 4
noop
addx 1
addx 4
noop
addx 13
addx -8
noop
addx -19
addx 24
addx 1
noop
addx 4
noop
addx 1
addx 5
addx -1
addx -37
addx 16
addx -13
addx 18
addx -11
addx 2
addx 23
noop
addx -18
addx 9
addx -8
addx 2
addx 5
addx 2
addx -21
addx 26
noop
addx -15
addx 20
noop
addx 3
noop
addx -38
addx 3
noop
addx 26
addx -4
addx -19
addx 3
addx 1
addx 5
addx 3
noop
addx 2
addx 3
noop
addx 2
noop
noop
noop
noop
addx 5
noop
noop
noop
addx 3
noop
addx -30
addx -4
addx 1
addx 18
addx -8
addx -4
addx 2
noop
addx 7
noop
noop
noop
noop
addx 5
noop
noop
addx 5
addx -2
addx -20
addx 27
addx -20
addx 25
addx -2
addx -35
noop
noop
addx 4
addx 3
addx -2
addx 5
addx 2
addx -11
addx 1
addx 13
addx 2
addx 5
addx 6
addx -1
addx -2
noop
addx 7
addx -2
addx 6
addx 1
addx -21
addx 22
addx -38
addx 5
addx 3
addx -1
noop
noop
addx 5
addx 1
addx 4
addx 3
addx -2
addx 2
noop
addx 7
addx -1
addx 2
addx 4
addx -10
addx -19
addx 35
addx -1
noop
noop
noop`;

console.table({
  "part 1": solution_1(input),
});
console.table({
  "part 2": solution_2(input),
});
