var test_input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const parse = (lines, feel_relief = true) => {
  return lines.split("\n\n").map((l) => parse_monkey(l, feel_relief));
};

const parse_monkey = (monkey_lines, feel_relief = true) => {
  const [
    monkey_name_line,
    items_line,
    operation_line,
    test_line,
    true_case_line,
    false_case_line,
  ] = monkey_lines.split("\n").map((l) => l.split(": ")[1]);

  const items = items_line.split(", ");
  const [it1, op, it2] = operation_line.split(" = ")[1].split(" ");
  const [test_op, by, test_item] = test_line.split(" ");
  const target_monkey_if_true = true_case_line.split(" ")[3];
  const target_monkey_if_false = false_case_line.split(" ")[3];

  const get_test_func = (test_item) => {
    switch (test_op) {
      case "divisible":
        return (item) => +item % +test_item;
    }
  };

  const get_inspection_func = (it1, op, it2) => {
    const term1 = (item) => (it1 == "old" ? item : +it1);
    const term2 = (item) => (it2 == "old" ? item : +it2);
    const operate = (a, b) => {
      switch (op) {
        case "+":
          return +a + +b;
        case "-":
          return +a - +b;
        case "*":
          return +a * +b;
        case "/":
          return +a / +b;
      }
    };

    return (item) => operate(term1(item), term2(item));
  };

  const test_func = get_test_func(test_item);
  const inspection_func = get_inspection_func(it1, op, it2);

  return {
    inspections: 0,
    items,
    test_value: +test_item,
    test: (item) => {
      const after_inspection_value = inspection_func(item);
      const after_feeling_relief = feel_relief
        ? Math.floor(after_inspection_value / 3)
        : after_inspection_value;

      if (test_func(after_feeling_relief) == 0)
        return {
          item: after_feeling_relief,
          target: target_monkey_if_true,
        };
      else
        return {
          item: after_feeling_relief,
          target: target_monkey_if_false,
        };
    },
  };
};

const do_round = (monkeys, cap) => {
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      const current_item = monkey.items.shift();

      const { item, target } = monkey.test(current_item);

      // console.log({ current_item, after: item, monkey: target });

      monkeys[target].items.push(!cap ? item : +item % +cap);
      monkey.inspections++;
    }
  });
};
const print_monkeys = (monkeys) => {
  console.table(monkeys.map(({ items }) => ({ items: items.join() })));
};

const solution_1 = (input, log = false) => {
  const monkeys = parse(input);

  for (let i = 0; i < 20; i++) {
    do_round(monkeys);
    if (log) print_monkeys(monkeys);
  }

  monkeys.sort((a, b) => +b.inspections - +a.inspections);
  const [first, second] = monkeys;

  return +first.inspections * +second.inspections;
};

console.assert(
  solution_1(test_input) == 10605,
  "The level of monkey business in this situation can be found by multiplying these together: 10605."
);

// part 2
const solution_2 = (input, log = false) => {
  const monkeys = parse(input, false);

  const cap = monkeys.reduce((a, { test_value }) => +a * +test_value, 1);

  for (let i = 0; i < 10000; i++) {
    do_round(monkeys, cap);
    if (log) print_monkeys(monkeys);
  }

  monkeys.sort((a, b) => b.inspections - a.inspections);
  const [first, second] = monkeys;

  return first.inspections * second.inspections;
};

console.assert(
  solution_2(test_input) == 2713310158,
  "Multiplying these together, the level of monkey business in this situation is now 2713310158"
);

const input = `Monkey 0:
  Starting items: 65, 58, 93, 57, 66
  Operation: new = old * 7
  Test: divisible by 19
    If true: throw to monkey 6
    If false: throw to monkey 4

Monkey 1:
  Starting items: 76, 97, 58, 72, 57, 92, 82
  Operation: new = old + 4
  Test: divisible by 3
    If true: throw to monkey 7
    If false: throw to monkey 5

Monkey 2:
  Starting items: 90, 89, 96
  Operation: new = old * 5
  Test: divisible by 13
    If true: throw to monkey 5
    If false: throw to monkey 1

Monkey 3:
  Starting items: 72, 63, 72, 99
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 4

Monkey 4:
  Starting items: 65
  Operation: new = old + 1
  Test: divisible by 2
    If true: throw to monkey 6
    If false: throw to monkey 2

Monkey 5:
  Starting items: 97, 71
  Operation: new = old + 8
  Test: divisible by 11
    If true: throw to monkey 7
    If false: throw to monkey 3

Monkey 6:
  Starting items: 83, 68, 88, 55, 87, 67
  Operation: new = old + 2
  Test: divisible by 5
    If true: throw to monkey 2
    If false: throw to monkey 1

Monkey 7:
  Starting items: 64, 81, 50, 96, 82, 53, 62, 92
  Operation: new = old + 5
  Test: divisible by 7
    If true: throw to monkey 3
    If false: throw to monkey 0`;

console.table({
  "part 1": solution_1(input),
});
console.table({
  "part 2": solution_2(input),
});
