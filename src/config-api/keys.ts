import { LinesCount, RiskLevel } from "@/module/settings-panel/types";

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
  leaderboard: ["leaderboard"],
  crash: ["crash"],
  plinko: ["plinko"],
  cases: ["cases"],
  mines: ["mines"],
  bonus: ["bonus"],
};

export const queryKeyFactories = {
  user: {
    current: () => queryKeys.user,
    detail: (id: string) => [...queryKeys.user, id],
  },
  games: {
    detail: (id: string) => [...queryKeys.games, id],
    history: (userId: string) => [...queryKeys.games, "history", userId],
  },
  leaderboard: {
    all: ["leaderboard"],
  },
  crash: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.crash,
      "user-history",
      limit,
      offset,
    ],
    getCurrent: () => [...queryKeys.crash, "current"],
  },
  plinko: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.plinko,
      "user-history",
      limit,
      offset,
    ],
    multipliers: (risk: RiskLevel, lines: LinesCount) => [
      ...queryKeys.plinko,
      "multipliers",
      risk,
      lines,
    ],
    recent: () => [...queryKeys.plinko, "recent"],
  },
  cases: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.cases,
      "user-history",
      limit,
      offset,
    ],
    all: () => [...queryKeys.cases],
    detail: (id: string) => [...queryKeys.cases, "detail", id],
  },
  mines: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.mines,
      "user-history",
      limit,
      offset,
    ],
    active: () => [...queryKeys.mines, "active"],
  },
  bonus: {
    status: () => [...queryKeys.bonus, "status"],
    claim: () => [...queryKeys.bonus, "claim"],
  },
};

// # React Query - Краткий конспект терминов

// ## Основные понятия

// **React Query (TanStack Query)** - Библиотека для управления серверным состоянием в React.

// **Query (Запрос)** - Запрос данных с сервера с автоматическим кэшированием.

// **Mutation (Мутация)** - Операция изменения данных на сервере (POST, PUT, DELETE).

// ---

// ## Кэширование

// **Кэш (Cache)** - Внутреннее хранилище данных в памяти, где React Query сохраняет все результаты запросов.

// **Query Key (Ключ запроса)** - Уникальный идентификатор для данных в кэше. Одинаковые ключи = одинаковые данные.

// **Stale Time (Время устаревания)** - Время, в течение которого данные считаются свежими. После истечения помечаются как устаревшие.

// ---

// ## Оптимистичное обновление

// **Оптимистичное обновление** - Обновление UI до получения ответа от сервера, предполагая успех операции.

// **getQueryData** - Читает данные из кэша без подписки на обновления. Не обновляет данные, только читает.

// **setQueryData** - Обновляет данные в кэше вручную, без запроса к серверу. Используется для оптимистичного обновления.

// ---

// ## Инвалидация

// **Инвалидация (Invalidation)** - Пометить данные в кэше как устаревшие, чтобы React Query обновил их при следующем использовании.

// **invalidateQueries** - Помечает данные как устаревшие. С `refetchType: "active"` - запрос делается сразу, без - при следующем использовании.

// **refetchQueries** - Принудительно обновляет данные, даже если они свежие. Делает запрос сразу.

// **removeQueries** - Полностью удаляет данные из кэша.

// ---

// ## Query Keys

// **queryKeys** - Базовые ключи для модулей, единый источник правды. Используются для групповой инвалидации.

// **queryKeyFactories** - Функции для создания ключей с параметрами. Обеспечивают type safety и консистентность.

// ---

// ## Методы работы с кэшем

// | Метод | Чтение | Запись | Запрос на сервер |
// |-------|--------|--------|------------------|
// | `getQueryData` | ✅ | ❌ | ❌ |
// | `setQueryData` | ❌ | ✅ | ❌ |
// | `invalidateQueries` | ❌ | ✅ | ⏳/✅ |
// | `refetchQueries` | ❌ | ✅ | ✅ |
// | `removeQueries` | ❌ | ❌ | ❌ |
