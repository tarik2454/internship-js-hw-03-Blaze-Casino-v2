export const queryKeys = {
  user: ["user"],
  balance: ["balance"],
  games: ["games"],
  auth: {
    all: ["auth"],
    login: ["auth", "login"],
    register: ["auth", "register"],
    logout: ["auth", "logout"],
  },
};

export const queryKeyFactories = {
  user: {
    detail: (id: string) => [...queryKeys.user, id],
  },
  games: {
    detail: (id: string) => [...queryKeys.games, id],
    history: (userId: string) => [...queryKeys.games, "history", userId],
  },
};
