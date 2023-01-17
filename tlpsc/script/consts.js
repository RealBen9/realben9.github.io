
export const PIECES = {
  I: {
    shape: [[
      [0, 0, 0, 0],
      [1, 2, 2, 3],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ], [
      [0, 0, 4, 0],
      [0, 0, 5, 0],
      [0, 0, 5, 0],
      [0, 0, 6, 0],
    ], [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 2, 2, 3],
      [0, 0, 0, 0],
    ], [
      [0, 4, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 6, 0, 0],
    ]],
  },
  L: {
    shape: [[
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ], [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ], [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ], [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]],
  },
  O: {
    shape: [[
      [1, 1],
      [1, 1],
    ], [
      [1, 1],
      [1, 1],
    ], [
      [1, 1],
      [1, 1],
    ], [
      [1, 1],
      [1, 1],
    ]],
  },
  Z: {
    shape: [[
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ], [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ], [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ], [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ]],
  },
  T: {
    shape: [[
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ], [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ], [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ], [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ]],
  },
  J: {
    shape: [[
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ], [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ], [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ]],
  },
  S: {
    shape: [[
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ], [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ], [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ], [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ]],
  },
};
export const PIECE_SETS = {
  i: ['I'],
  standard: ['I', 'L', 'O', 'Z', 'T', 'J', 'S'],
  deluxe: ['I', 'T', 'Z', 'S', 'J', 'L', 'O'],
  standardUnfavored: ['O', 'Z', 'S'],
};
export const SPAWN_OFFSETS = {
  srs: {
    downShift: 1,
    I: [3, -2],
    L: [3, -2],
    O: [4, -2],
    Z: [3, -2],
    T: [3, -2],
    J: [3, -2],
    S: [3, -2],
  },
  retro: {
    downShift: 0,
    I: [3, -1],
    L: [4, -1],
    O: [4, 0],
    Z: [4, 0],
    T: [4, -1],
    J: [4, -1],
    S: [4, 0],
  },
  handheld: {
    downShift: 0,
    I: [3, 0],
    L: [3, 0],
    O: [4, 1],
    Z: [3, 1],
    T: [3, 0],
    J: [3, 0],
    S: [3, 1],
  },
  deluxe: {
    downShift: 0,
    I: [3, -1],
    L: [3, -1],
    O: [4, 0],
    Z: [3, 0],
    T: [3, -1],
    J: [3, -1],
    S: [3, 0],
  },
  ars: {
    downShift: 0,
    I: [3, -1],
    L: [3, -1],
    O: [4, 0],
    Z: [3, 0],
    T: [3, -1],
    J: [3, -1],
    S: [3, 0],
  },
};
SPAWN_OFFSETS.tetrax = {...SPAWN_OFFSETS.srs, downShift: 2, I: [3, -3]};
SPAWN_OFFSETS.oshisaure = {...SPAWN_OFFSETS.srs, downShift: 0};
SPAWN_OFFSETS.world = SPAWN_OFFSETS.srs;
SPAWN_OFFSETS.arsti = SPAWN_OFFSETS.ars;
SPAWN_OFFSETS.original = SPAWN_OFFSETS.retro;
export const INITIAL_ORIENTATION = {
  srs: {
    I: 0,
    L: 0,
    O: 0,
    Z: 0,
    T: 0,
    J: 0,
    S: 0,
  },
  retro: {
    I: 0,
    L: 2,
    O: 0,
    Z: 0,
    T: 2,
    J: 2,
    S: 0,
  },
};
INITIAL_ORIENTATION.tetrax = INITIAL_ORIENTATION.srs;
INITIAL_ORIENTATION.world = INITIAL_ORIENTATION.srs;
INITIAL_ORIENTATION.oshisaure = INITIAL_ORIENTATION.srs;
INITIAL_ORIENTATION.handheld = INITIAL_ORIENTATION.retro;
INITIAL_ORIENTATION.deluxe = INITIAL_ORIENTATION.retro;
INITIAL_ORIENTATION.ars = INITIAL_ORIENTATION.retro;
INITIAL_ORIENTATION.original = INITIAL_ORIENTATION.retro;
INITIAL_ORIENTATION.arsti = INITIAL_ORIENTATION.ars;
const KICK_TEMPLATES = {
  srs: {
    x: {
      right: [
        [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]], // 0 >> 1
        [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]], // 1 >> 2
        [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]], // 2 >> 3
        [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]], // 3 >> 0
      ],
      left: [
        [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]], // 0 >> 3
        [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]], // 1 >> 0
        [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]], // 2 >> 1
        [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]], // 3 >> 2
      ],
      double: [
        [[0, 0], [+1, 0], [+2, 0], [+1, +1], [+2, +1], [-1, 0], [-2, 0], [-1, +1], [-2, +1], [0, -1], [+3, 0], [-3, 0]],
        [[0, 0], [0, +1], [0, +2], [-1, +1], [-1, +2], [0, -1], [0, -2], [-1, -1], [-1, -2], [+1, 0], [0, +3], [0, -3]],
        [[0, 0], [-1, 0], [-2, 0], [-1, -1], [-2, -1], [+1, 0], [+2, 0], [+1, -1], [+2, -1], [0, +1], [-3, 0], [+3, 0]],
        [[0, 0], [0, +1], [0, +2], [+1, +1], [+1, +2], [0, -1], [0, -2], [+1, -1], [+1, -2], [-1, 0], [0, +3], [0, -3]],
      ],
    },
    I: {
      right: [
        [[0, 0], [-2, 0], [+1, 0], [-2, +1], [+1, -2]],
        [[0, 0], [-1, 0], [+2, 0], [-1, -2], [+2, +1]],
        [[0, 0], [+2, 0], [-1, 0], [+2, -1], [-1, +2]],
        [[0, 0], [+1, 0], [-2, 0], [+1, +2], [-2, -1]],
      ],
      left: [
        [[0, 0], [-1, 0], [+2, 0], [-1, -2], [+2, +1]],
        [[0, 0], [+2, 0], [-1, 0], [+2, -1], [-1, +2]],
        [[0, 0], [+1, 0], [-2, 0], [+1, +2], [-2, -1]],
        [[0, 0], [-2, 0], [+1, 0], [-2, +1], [+1, -2]],
      ],
      double: [
        [[0, 0], [-1, 0], [-2, 0], [+1, 0], [+2, 0], [0, +1]],
        [[0, 0], [0, +1], [0, +2], [0, -1], [0, -2], [-1, 0]],
        [[0, 0], [+1, 0], [+2, 0], [-1, 0], [-2, 0], [0, -1]],
        [[0, 0], [0, +1], [0, +2], [0, -1], [0, -2], [+1, 0]],
      ],
    },
  },
  tetrax: {
    x: {
      right: [
        [[0, 0], [0, +1], [-1, 0], [+1, 0], [-1, +1], [+1, +1], [0, -1], [-1, -1], [+1, -1]], // 0 >> 1
        [[0, 0], [0, +1], [-1, 0], [+1, 0], [-1, +1], [+1, +1], [0, -1], [-1, -1], [+1, -1]], // 1 >> 2
        [[0, 0], [0, +1], [-1, 0], [+1, 0], [-1, +1], [+1, +1], [0, -1], [-1, -1], [+1, -1]], // 2 >> 3
        [[0, 0], [0, +1], [-1, 0], [+1, 0], [-1, +1], [+1, +1], [0, -1], [-1, -1], [+1, -1]], // 3 >> 0
      ],
      left: [
        [[0, 0], [0, +1], [+1, 0], [-1, 0], [+1, +1], [-1, +1], [0, -1], [+1, -1], [-1, -1]], // 0 >> 3
        [[0, 0], [0, +1], [+1, 0], [-1, 0], [+1, +1], [-1, +1], [0, -1], [+1, -1], [-1, -1]], // 1 >> 0
        [[0, 0], [0, +1], [+1, 0], [-1, 0], [+1, +1], [-1, +1], [0, -1], [+1, -1], [-1, -1]], // 2 >> 1
        [[0, 0], [0, +1], [+1, 0], [-1, 0], [+1, +1], [-1, +1], [0, -1], [+1, -1], [-1, -1]], // 3 >> 2
      ],
      double: [
        [[0, 0], [0, +1], [0, -1], [-1, 0], [+1, 0]], // 0 >> 2
        [[0, 0], [0, +1], [0, -1], [-1, 0], [+1, 0]], // 1 >> 3
        [[0, 0], [0, +1], [0, -1], [-1, 0], [+1, 0]], // 2 >> 0
        [[0, 0], [0, +1], [0, -1], [-1, 0], [+1, 0]], // 3 >> 1
      ],
    },
    I: {
      right: [
        [[0, 0], [0, -1], [0, -2], [0, +1], [+1, -1], [-1, -1], [+1, -2], [-1, -2]], // 0 >> 1
        [[0, 0], [0, -1], [0, -2], [0, +1], [-1, 0], [+1, 0], [+2, 0]], // 1 >> 2
        [[0, 0], [0, +1], [0, +2], [0, -1], [+1, +1], [-1, +1], [+1, +2], [-1, +2]], // 2 >> 3
        [[0, 0], [0, -1], [0, -2], [0, +1], [+1, 0], [-1, 0], [-2, 0]], // 3 >> 0
      ],
      left: [
        [[0, 0], [0, -1], [0, -2], [0, +1], [-1, -1], [+1, -1], [-1, -2], [+1, -2]], // 0 >> 3
        [[0, 0], [0, -1], [0, -2], [0, +1], [-1, 0], [+1, 0], [+2, 0]], // 1 >> 0
        [[0, 0], [0, +1], [0, +2], [0, -1], [-1, +1], [+1, +1], [-1, +2], [+1, +2]], // 2 >> 1
        [[0, 0], [0, -1], [0, -2], [0, +1], [+1, 0], [-1, 0], [-2, 0]], // 3 >> 2
      ],
      double: [
        [[0, 0], [0, -1], [0, +1]], // 0 >> 2
        [[0, 0], [0, -1], [0, +1]], // 1 >> 3
        [[0, 0], [0, -1], [0, +1]], // 2 >> 0
        [[0, 0], [0, -1], [0, +1]], // 3 >> 1
      ],
    },
  },
  deluxe: {
    TLJ: {
      right: [
        [[0, 0], [+1, +1]], // 0 >> 1
        [[0, 0], [-1, +1]], // 1 >> 2
        [[0, 0], [-1, -1]], // 2 >> 3
        [[0, 0], [+1, -1]], // 3 >> 0
      ],
      left: [
        [[0, 0], [-1, +1]], // 0 >> 3
        [[0, 0], [+1, +1]], // 3 >> 2
        [[0, 0], [+1, -1]], // 2 >> 1
        [[0, 0], [-1, -1]], // 1 >> 0
      ],
      double: [
        [[0, 0], [0, -2]], // 0 >> 2
        [[0, 0], [-2, 0]], // 1 >> 3
        [[0, 0], [0, +2]], // 2 >> 0
        [[0, 0], [+2, 0]], // 3 >> 1
      ],
    },
    x: {
      right: [
        [[0, 0], [-1, -1]], // 0 >> 1
        [[0, 0], [+1, -1]], // 1 >> 2
        [[0, 0], [+1, +1]], // 2 >> 3
        [[0, 0], [-1, +1]], // 3 >> 0
      ],
      left: [
        [[0, 0], [+1, -1]], // 0 >> 3
        [[0, 0], [+1, +1]], // 1 >> 0
        [[0, 0], [-1, +1]], // 2 >> 1
        [[0, 0], [-1, -1]], // 3 >> 2
      ],
      double: [
        [[0, 0], [0, +2]], // 0 >> 2
        [[0, 0], [+2, 0]], // 1 >> 3
        [[0, 0], [0, -2]], // 2 >> 0
        [[0, 0], [-2, 0]], // 3 >> 1
      ],
    },
  },
  ars: {
    x: {
      right: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
      ],
      left: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
      ],
      double: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
      ],
    },
    I: {
      right: [
        [[0, 0], [0, -1], [0, -2]],
        [[0, 0], [1, 0], [2, 0], [-1, 0]],
        [[0, 0], [0, -1], [0, -2]],
        [[0, 0], [1, 0], [2, 0], [-1, 0]],
      ],
      left: [
        [[0, 0], [0, -1], [0, -2]],
        [[0, 0], [1, 0], [2, 0], [-1, 0]],
        [[0, 0], [0, -1], [0, -2]],
        [[0, 0], [1, 0], [2, 0], [-1, 0]],
      ],
      double: [
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
      ],
    },
    T: {
      right: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0], [0, -1]],
      ],
      left: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0], [0, -1]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
      ],
      double: [
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0]],
        [[0, 0], [1, 0], [-1, 0], [0, -1]],
        [[0, 0], [1, 0], [-1, 0]],
      ],
    },
  },
  oshisaure: {
    x: {
      right: [
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
      ],
      left: [
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
      ],
      double: [
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, -1], [1, -1], [-1, -1], [0, 2], [0, -2]],
        [[0, 0], [0, 1], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-1, -1], [1, -1], [0, 2], [0, -2]],
      ],
    },
    I: {
      right: [
        [[0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [1, -1], [0, 2], [1, 2], [-1, 0], [-1, 1], [-2, 0], [-2, 1], [-1, -1], [-2, -1], [-1, 2], [-2, 2]],
        [[1, 0], [1, 1], [2, 0], [2, 1], [1, -1], [2, -1], [1, -2], [2, -2], [0, 0], [0, 1], [-1, 0], [-1, 1], [0, -1], [-1, -1], [0, -2], [-1, -2]],
        [[0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [1, -1], [0, 2], [1, 2], [-1, 0], [-1, 1], [-2, 0], [-2, 1], [-1, -1], [-2, -1], [-1, 2], [-2, 2]],
        [[1, 0], [1, 1], [2, 0], [2, 1], [1, -1], [2, -1], [1, -2], [2, -2], [0, 0], [0, 1], [-1, 0], [-1, 1], [0, -1], [-1, -1], [0, -2], [-1, -2]],
      ],
      left: [
        [[-1, 0], [-1, 1], [-2, 0], [-2, 1], [-1, -1], [-2, -1], [-1, 2], [-2, 2], [0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [1, -1], [0, 2], [1, 2]],
        [[0, 0], [0, 1], [-1, 0], [-1, 1], [0, -1], [-1, -1], [0, -2], [-1, -2], [1, 0], [1, 1], [2, 0], [2, 1], [1, -1], [2, -1], [1, -2], [2, -2]],
        [[-1, 0], [-1, 1], [-2, 0], [-2, 1], [-1, -1], [-2, -1], [-1, 2], [-2, 2], [0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [1, -1], [0, 2], [1, 2]],
        [[0, 0], [0, 1], [-1, 0], [-1, 1], [0, -1], [-1, -1], [0, -2], [-1, -2], [1, 0], [1, 1], [2, 0], [2, 1], [1, -1], [2, -1], [1, -2], [2, -2]],
      ],
      double: [
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
      ],
    },
  },
  none: {
    all: {
      right: [
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
      ],
      left: [
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
      ],
      double: [
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
        [[0, 0]],
      ],
    },
  },
};
KICK_TEMPLATES.world = {
  x: {
    ...KICK_TEMPLATES.srs.x,
    double: [
      [[0, 0], [1, 0], [-1, 0], [0, -1], [0, 1], [0, -2], [0, 2]],
      [[0, 0], [0, 1], [0, - 1], [0, -2], [0, 2], [-1, 0], [1, 0]],
      [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [0, 2], [0, -2]],
      [[0, 0], [0, 1], [0, -1], [0, -2], [0, 2], [1, 0], [-1, 0]],
    ],
  },
  I: {
    right: [
      [[0, 0], [- 2, 0], [1, 0], [1, -2], [-2, 1]], // 0>>1
      [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], //  1>>2
      [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 1]], //  2>>3
      [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], //  3>>0
    ],
    left: [
      [[0, 0], [2, 0], [- 1, 0], [-1, -2], [2, 1]], // 0>>3
      [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], //  1>>0
      [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 1]], //  2>>1
      [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], //  3>>2
    ],
    double: [
      [[0, 0], [- 1, 0], [-2, 0], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, -1], [0, -2], [0, 2]],
      [[0, 0], [1, 0], [2, 0], [-1, 0], [-2, 0]],
      [[0, 0], [0, 1], [0, -1], [0, -2], [0, 2]],
    ],
  },
};
export const KICK_TABLES = {
  srs: {
    I: KICK_TEMPLATES.srs.I,
    L: KICK_TEMPLATES.srs.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.srs.x,
    T: KICK_TEMPLATES.srs.x,
    J: KICK_TEMPLATES.srs.x,
    S: KICK_TEMPLATES.srs.x,
  },
  world: {
    I: KICK_TEMPLATES.world.I,
    L: KICK_TEMPLATES.world.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.world.x,
    T: KICK_TEMPLATES.world.x,
    J: KICK_TEMPLATES.world.x,
    S: KICK_TEMPLATES.world.x,
  },
  tetrax: {
    I: KICK_TEMPLATES.tetrax.I,
    L: KICK_TEMPLATES.tetrax.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.tetrax.x,
    T: KICK_TEMPLATES.tetrax.x,
    J: KICK_TEMPLATES.tetrax.x,
    S: KICK_TEMPLATES.tetrax.x,
  },
  retro: {
    I: KICK_TEMPLATES.none.all,
    L: KICK_TEMPLATES.none.all,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.none.all,
    T: KICK_TEMPLATES.none.all,
    J: KICK_TEMPLATES.none.all,
    S: KICK_TEMPLATES.none.all,
  },
  deluxe: {
    I: KICK_TEMPLATES.deluxe.x,
    L: KICK_TEMPLATES.deluxe.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.deluxe.x,
    T: KICK_TEMPLATES.deluxe.x,
    J: KICK_TEMPLATES.deluxe.x,
    S: KICK_TEMPLATES.deluxe.x,
  },
  ars: {
    I: KICK_TEMPLATES.none.all,
    L: KICK_TEMPLATES.ars.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.ars.x,
    T: KICK_TEMPLATES.ars.x,
    J: KICK_TEMPLATES.ars.x,
    S: KICK_TEMPLATES.ars.x,
    exception: {
      L: [
        [[1, 0], [1, -1]],
        [],
        [[1, 2], [1, 0]],
        [],
      ],
      J: [
        [[1, 0], [1, -1]],
        [],
        [[1, 2], [1, 0]],
        [],
      ],
      T: [
        [[1, -1]],
        [],
        [[1, 0]],
        [],
      ],
    },
    unlessToWith: {
      L: [
        [[[]], [[]], [[]], [[0, -1], [1, 0]]],
        [[[]], [[]], [[]], [[]]],
        [[[]], [[]], [[]], [[0, 0], [1, 2]]],
        [[[]], [[]], [[]], [[]]],
      ],
      J: [
        [[[]], [[2, -1], [1, 0]], [[]], [[]]],
        [[[]], [[]], [[]], [[]]],
        [[[]], [[2, 0], [1, 2]], [[]], [[]]],
        [[[]], [[]], [[]], [[]]],
      ],
    },
  },
  oshisaure: {
    I: KICK_TEMPLATES.oshisaure.I,
    L: KICK_TEMPLATES.oshisaure.x,
    O: KICK_TEMPLATES.none.all,
    Z: KICK_TEMPLATES.oshisaure.x,
    T: KICK_TEMPLATES.oshisaure.x,
    J: KICK_TEMPLATES.oshisaure.x,
    S: KICK_TEMPLATES.oshisaure.x,
  },
};
KICK_TABLES.arsti = {
  ...KICK_TABLES.ars,
  I: KICK_TEMPLATES.ars.I,
  T: KICK_TEMPLATES.ars.T,
  killPieceLockDelay: {
    T: [
      [[-1], [-1], [-1], [-1]],
      [[3], [-1], [-1], [-1]],
      [[3], [-1], [-1], [-1]],
      [[3], [-1], [-1], [-1]],
    ],
    I: [
      [[-1], [1], [-1], [1]],
      [[-1], [-1], [-1], [-1]],
      [[-1], [1], [-1], [1]],
      [[-1], [-1], [-1], [-1]],
    ],
  },
  allowKickOffGround: {
    I: [false, true, false, true],
  },
};
KICK_TABLES.handheld = KICK_TABLES.retro;
KICK_TABLES.original = KICK_TABLES.retro;
export const PIECE_COLORS = {
  srs: {
    I: 'lightBlue',
    L: 'orange',
    O: 'yellow',
    Z: 'red',
    T: 'purple',
    J: 'blue',
    S: 'green',
  },
  tetrax: {
    I: 'orange',
    L: 'yellow',
    O: 'green',
    Z: 'red',
    T: 'purple',
    J: 'blue',
    S: 'lightBlue',
  },
  retro: {
    I: 'white',
    L: 'red',
    O: 'white',
    Z: 'blue',
    T: 'white',
    J: 'blue',
    S: 'red',
  },
  deluxe: {
    I: 'orange',
    L: 'red',
    O: 'yellow',
    Z: 'orange',
    T: 'green',
    J: 'lightBlue',
    S: 'purple',
  },
  handheldSpecial: {
    I: 'i',
    L: 'l',
    O: 'o',
    Z: 'z',
    T: 't',
    J: 'j',
    S: 's',
  },
  retroSpecial: {
    I: 'x',
    L: 'l',
    O: 'x',
    Z: 'l',
    T: 'x',
    J: 'r',
    S: 'r',
  },
  ars: {
    I: 'red',
    L: 'orange',
    O: 'yellow',
    Z: 'green',
    T: 'lightBlue',
    J: 'blue',
    S: 'purple',
  },
  oshisaure: {
    I: 'purple',
    L: 'red',
    O: 'orange',
    Z: 'blue',
    T: 'green',
    J: 'lightBlue',
    S: 'yellow',
  },
  original: {
    I: 'green',
    L: 'green',
    O: 'green',
    Z: 'green',
    T: 'green',
    J: 'green',
    S: 'green',
  },
};
PIECE_COLORS.world = PIECE_COLORS.srs;
PIECE_COLORS.handheld = PIECE_COLORS.retro;
PIECE_COLORS.arsti = PIECE_COLORS.ars;

export const NEXT_OFFSETS = {
  srs: {
    I: [0, 0],
    L: [0.5, 0.5],
    O: [1, 0.5],
    Z: [0.5, 0.5],
    T: [0.5, 0.5],
    J: [0.5, 0.5],
    S: [0.5, 0.5],
  },
  retro: {
    I: [0, 0],
    L: [0.5, -0.5],
    O: [1, 0.5],
    Z: [0.5, 0.5],
    T: [0.5, -0.5],
    J: [0.5, -0.5],
    S: [0.5, 0.5],
  },
};
NEXT_OFFSETS.world = NEXT_OFFSETS.srs;
NEXT_OFFSETS.tetrax = NEXT_OFFSETS.srs;
NEXT_OFFSETS.oshisaure = NEXT_OFFSETS.srs;
NEXT_OFFSETS.handheld = NEXT_OFFSETS.retro;
NEXT_OFFSETS.deluxe = NEXT_OFFSETS.retro;
NEXT_OFFSETS.ars = NEXT_OFFSETS.retro;
NEXT_OFFSETS.arsti = NEXT_OFFSETS.ars;
NEXT_OFFSETS.original = NEXT_OFFSETS.retro;

export const PIECE_OFFSETS = {
  srs: {
    I: [[0, 0], [0, 0], [0, 0], [0, 0]],
    L: [[0, 0], [0, 0], [0, 0], [0, 0]],
    O: [[0, 0], [0, 0], [0, 0], [0, 0]],
    Z: [[0, 0], [0, 0], [0, 0], [0, 0]],
    T: [[0, 0], [0, 0], [0, 0], [0, 0]],
    J: [[0, 0], [0, 0], [0, 0], [0, 0]],
    S: [[0, 0], [0, 0], [0, 0], [0, 0]],
  },
  retro: {
    I: [[0, 1], [0, 0], [0, 0], [1, 0]],
    L: [[0, 0], [0, 0], [0, 0], [0, 0]],
    O: [[0, 0], [0, 0], [0, 0], [0, 0]],
    Z: [[0, 1], [0, 0], [0, 0], [1, 0]],
    T: [[0, 0], [0, 0], [0, 0], [0, 0]],
    J: [[0, 0], [0, 0], [0, 0], [0, 0]],
    S: [[0, 1], [0, 0], [0, 0], [1, 0]],
  },
  handheld: {
    I: [[0, 1], [-1, 0], [0, 0], [0, 0]],
    L: [[0, 0], [0, 0], [0, 0], [0, 0]],
    O: [[0, 0], [0, 0], [0, 0], [0, 0]],
    Z: [[0, 1], [-1, 0], [0, 0], [0, 0]],
    T: [[0, 0], [0, 0], [0, 0], [0, 0]],
    J: [[0, 0], [0, 0], [0, 0], [0, 0]],
    S: [[0, 1], [-1, 0], [0, 0], [0, 0]],
  },
  ars: {
    I: [[0, 0], [0, 0], [0, -1], [1, 0]],
    L: [[0, 1], [0, 0], [0, 0], [0, 0]],
    O: [[0, 0], [0, 0], [0, 0], [0, 0]],
    Z: [[0, 1], [0, 0], [0, 0], [1, 0]],
    T: [[0, 1], [0, 0], [0, 0], [0, 0]],
    J: [[0, 1], [0, 0], [0, 0], [0, 0]],
    S: [[0, 1], [-1, 0], [0, 0], [0, 0]],
  },
  oshisaure: {
    I: [[0, 1], [0, 0], [0, 0], [1, 0]],
    L: [[0, 0], [0, 0], [0, 0], [0, 0]],
    O: [[0, 0], [0, 0], [0, 0], [0, 0]],
    Z: [[0, 0], [-1, 0], [0, -1], [0, 0]],
    T: [[0, 0], [0, 0], [0, 0], [0, 0]],
    J: [[0, 0], [0, 0], [0, 0], [0, 0]],
    S: [[0, 0], [0, 0], [0, -1], [1, 0]],
  },
};
PIECE_OFFSETS.world = PIECE_OFFSETS.srs;
PIECE_OFFSETS.tetrax = PIECE_OFFSETS.srs;
PIECE_OFFSETS.deluxe = PIECE_OFFSETS.srs;
PIECE_OFFSETS.arsti = PIECE_OFFSETS.ars;
PIECE_OFFSETS.original = {
  ...PIECE_OFFSETS.srs,
  I: [[0, 0], [0, 0], [0, -1], [1, 0]],
};
export const PIECE_BINARIES = {
  L: 0b000,
  J: 0b001,
  I: 0b010,
  O: 0b011,
  Z: 0b100,
  S: 0b101,
  T: 0b110,
};
export const SCORE_TABLES = {
  guideline: {
    erase1: 100,
    erase2: 300,
    erase3: 500,
    erase4: 800,
    tspin0: 400,
    tspin1: 700, // These add to the regular erase points
    tspin2: 900,
    tspin3: 1100,
    tspin4: 1200,
    tmini: 100,
    softDrop: 1,
    sonicDrop: 2,
    hardDrop: 2,
    updateSoftDropImmediately: true,
    hasSpins: true,
    hasCombo: true,
    levelAdditive: 0,
    levelMultiplied: ['erase1', 'erase2', 'erase3', 'erase4', 'tspin0', 'tspin1', 'tspin2', 'tspin3', 'tspin4', 'tmini', 'combo'],
    b2bMultiplier: 1.5,
    b2bMultiplied: ['erase1', 'erase2', 'erase3', 'erase4', 'tspin1', 'tspin2', 'tspin3', 'tspin4', 'tmini'],
    combo: 50,
  },
  tetrax: {
    erase1: 100,
    erase2: 200,
    erase3: 400,
    erase4: 800,
    tspin0: 50,
    tspin1: 100, // These add to the regular erase points
    tspin2: 150,
    tspin3: 200,
    tspin4: 250,
    tmini: 0,
    softDrop: 1,
    sonicDrop: 2,
    hardDrop: 2,
    updateSoftDropImmediately: true,
    hasSpins: true,
    hasCombo: true,
    levelAdditive: 0,
    levelMultiplied: ['erase1', 'erase2', 'erase3', 'erase4', 'tspin0', 'tspin1', 'tspin2', 'tspin3', 'tspin4', 'tmini', 'combo'],
    b2bMultiplier: 1.5,
    b2bMultiplied: ['erase1', 'erase2', 'erase3', 'erase4', 'tspin1', 'tspin2', 'tspin3', 'tspin4', 'tmini'],
    combo: 25,
  },
  retro: {
    erase1: 40,
    erase2: 100,
    erase3: 300,
    erase4: 1200,
    softDrop: 1,
    sonicDrop: 2,
    hardDrop: 2,
    updateSoftDropImmediately: false,
    levelAdditive: 1,
    levelMultiplied: ['erase1', 'erase2', 'erase3', 'erase4'],
    b2bMultiplier: 1,
    b2bMultiplied: [],
  },
  arcade: {
    erase1: 10,
    erase2: 20,
    erase3: 40,
    erase4: 80,
    softDrop: 1,
    sonicDrop: 2,
    hardDrop: 2,
    updateSoftDropImmediately: false,
    levelAdditive: 0,
    levelMultiplied: ['erase1', 'erase2', 'erase3', 'erase4'],
    b2bMultiplier: 1,
    b2bMultiplied: [],
    combo: 5,
  },
  blank: {
    erase1: 0,
    erase2: 0,
    erase3: 0,
    erase4: 0,
    softDrop: 0,
    sonicDrop: 0,
    hardDrop: 0,
    updateSoftDropImmediately: false,
    levelAdditive: 0,
    levelMultiplied: [],
    b2bMultiplier: 1,
    b2bMultiplied: [],
    combo: 0,
  },
};

export const SPIN_POINTS = {
  I: {
    high: [
      [[1, 0], [2, 2], [2, 0], [1, 2]],
      [[1, 1], [3, 2], [1, 2], [3, 1]],
      [[1, 1], [2, 3], [2, 1], [1, 3]],
      [[0, 1], [2, 2], [0, 2], [2, 1]]],
    low: [
      [[-1, 1], [4, 1], [-1, 1], [4, 1]],
      [[2, -1], [2, 4], [2, -1], [2, 4]],
      [[-1, 2], [4, 2], [-1, 2], [4, 2]],
      [[1, -1], [1, 4], [1, -1], [1, 4]]],
  },
  L: {
    high: [
      [[1, 0], [0, 0]],
      [[2, 1], [2, 0]],
      [[1, 2], [2, 2]],
      [[0, 1], [0, 2]]],
  },
  Z: {

  },
  T: {
    high: [
      [[0, 0], [2, 0]],
      [[2, 0], [2, 2]],
      [[0, 2], [2, 2]],
      [[0, 0], [0, 2]]],
    low: [
      [[0, 2], [2, 2]],
      [[0, 0], [0, 2]],
      [[0, 0], [2, 0]],
      [[2, 0], [2, 2]]],
  },
  J: {

  },
  S: {

  },
};
export const SPIN_SETS = {
  tOnly: ['T'],
  all: ['I', 'L', 'Z', 'T', 'J', 'S'],
  none: [],
};
export const SKIN_SETS = {
  srs: 'srsx',
  world: 'glossy',
  tetrax: 'standard',
  retro: 'retro',
  handheld: 'handheld',
  deluxe: 'handheld',
  ars: 'arika',
  arsti: 'arika',
  oshisaure: 'oshisaure',
  original: 'bone',
};
export const SOUND_SETS = {
  srs: 'standard',
  world: 'tgm3',
  tetrax: 'standard',
  retro: 'nes',
  handheld: 'handheld',
  deluxe: 'deluxe',
  ars: 'tgm3',
  arsti: 'tgm3',
  oshisaure: 'standard',
  original: 'standard',
};
