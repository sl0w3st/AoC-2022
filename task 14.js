var test_input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const Tiles = {
  Air: "⬛",
  Sand: "🟡",
  Wall: "🟫",
};

const make_map = (lines, floor = false) => {
  const aa = { x: 1000, y: 0 };
  const bb = { x: -1, y: -1 };

  lines.forEach((line) =>
    line.forEach(({ x, y }) => {
      if (+aa.x > +x) aa.x = +x;
      if (+bb.x < +x) bb.x = +x;
      if (+bb.y < +y) bb.y = +y;
    })
  );

  aa.x -= floor ? 200 : 1;
  bb.x += floor ? 200 : 1;
  bb.y += 2;

  const width = +bb.x - +aa.x;
  const height = +bb.y - +aa.y;

  const tiles = Array.from({ length: +height }, (_) =>
    Array.from({ length: +width }, (_) => Tiles.Air)
  );

  const at = (x, y) => {
    if (floor && y == bb.y) return Tiles.Wall;

    return tiles[+y - +aa.y][+x - +aa.x];
  };
  const set = (x, y, what) => {
    tiles[+y - +aa.y][+x - +aa.x] = what;
  };
  const boundary_check = (x, y) => {
    if (+x - +aa.x < 0) return false;
    if (+y - +aa.y < 0) return false;
    if (+x - +bb.x > 0) return false;
    if (+y - +bb.y > 0) return false;

    return true;
  };

  lines.forEach((line) => {
    const [start_point, ...rest_points] = line;
    const brush = { ...start_point };

    set(brush.x, brush.y, Tiles.Wall);

    rest_points.forEach((p) => {
      do {
        if (+brush.x != +p.x) brush.x += p.x > brush.x ? 1 : -1;
        if (+brush.y != +p.y) brush.y += p.y > brush.y ? 1 : -1;
        set(brush.x, brush.y, Tiles.Wall);
      } while (+p.x != +brush.x || +p.y != +brush.y);
    });
  });

  const start = { x: 500, y: aa.y };

  return { tiles, aa, bb, at, set, start, boundary_check };
};

const sand_step = (map, { x, y }) => {
  const target = { x, y };

  target.y++;

  if (!map.boundary_check(target.x, target.y)) {
    map.set(x, y, Tiles.Air);
    throw "out of bounds";
  }
  if (map.at(target.x, target.y) == Tiles.Air) {
    map.set(x, y, Tiles.Air);
    map.set(target.x, target.y, Tiles.Sand);
    return target;
  }

  target.x--;

  if (!map.boundary_check(target.x, target.y)) {
    map.set(x, y, Tiles.Air);
    throw "out of bounds";
  }
  if (map.at(target.x, target.y) == Tiles.Air) {
    map.set(x, y, Tiles.Air);
    map.set(target.x, target.y, Tiles.Sand);
    return target;
  }

  target.x += 2;

  if (!map.boundary_check(target.x, target.y)) {
    map.set(x, y, Tiles.Air);
    throw "out of bounds";
  }
  if (map.at(target.x, target.y) == Tiles.Air) {
    map.set(x, y, Tiles.Air);
    map.set(target.x, target.y, Tiles.Sand);
    return target;
  }

  map.set(x, y, Tiles.Sand);
  return null;
};

const solution_1 = (input, log = false) => {
  const lines = input.split("\n").map((l) =>
    l.split(" -> ").map((p) => {
      const [x, y] = p.split(",");
      return { x: +x, y: +y };
    })
  );

  const map = make_map(lines);

  let sand = map.start;

  if (log) {
    let t = setInterval(() => {
      try {
        sand = sand_step(map, sand);
        if (!sand) sand = map.start;
        print_map(map);
      } catch (e) {
        clearInterval(t);
        console.log("Done with sand, total:", count_sand(map));
      }
    }, 50);
  } else {
    while (true) {
      try {
        sand = sand_step(map, sand);
        if (!sand) sand = map.start;
      } catch (e) {
        break;
      }
    }
    print_map(map);
    return count_sand(map) - 1;
  }
};

const count_sand = (map) =>
  map.tiles.reduce(
    (a, l) => +a + l.reduce((ac, t) => +ac + (t == Tiles.Sand ? 1 : 0), 0),
    0
  );

const print_map = (map) => {
  // console.clear();
  // map.set(500, 0, Tiles.Wall);
  console.log(map.tiles.map((l) => l.join("")).join("\n"));
};

console.assert(
  solution_1(test_input) == 24,
  "Once all 24 units of sand shown above have come to rest, all further sand flows out the bottom, falling into the endless void"
);

// part 2
const solution_2 = (input, log = false) => {
  const lines = input.split("\n").map((l) =>
    l.split(" -> ").map((p) => {
      const [x, y] = p.split(",");
      return { x: +x, y: +y };
    })
  );

  const map = make_map(lines, true);

  let sand = map.start;

  if (log) {
    let t = setInterval(() => {
      try {
        sand = sand_step(map, sand);
        if (!sand) sand = map.start;
        if (map.at(map.start.x, map.start.y) == Tiles.Sand)
          throw "Source blocked";
        print_map(map);
      } catch (e) {
        clearInterval(t);
        console.log("Done with sand, total:", count_sand(map));
      }
    }, 50);
  } else {
    while (true) {
      try {
        sand = sand_step(map, sand);
        if (!sand) sand = map.start;
        if (map.at(map.start.x, map.start.y) == Tiles.Sand)
          throw "Source blocked";
      } catch (e) {
        break;
      }
    }
    print_map(map);
    return count_sand(map);
  }
};

console.assert(
  solution_2(test_input) == 93,
  "In the example above, the situation finally looks like this after 93 units of sand come to rest"
);

const input = document.body.innerText.trim();
console.table({
  "part 1": solution_1(input),
});
console.table({
  "part 2": solution_2(input),
});
