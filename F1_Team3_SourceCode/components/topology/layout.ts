export interface Point {
  x: number;
  y: number;
}

export interface TopologyLayout {
  width: number;
  height: number;
  client: Point;
  proxy: Point;
  servers: Record<string, Point>;
}

export const VIEW_WIDTH = 900;
export const CLIENT_BOX = { width: 130, height: 70 };
export const PROXY_BOX = { width: 170, height: 90 };
export const SERVER_BOX = { width: 190, height: 56 };

const CLIENT_X = 90;
const PROXY_X = 440;
const SERVER_X = 785;
const ROW_HEIGHT = 80;
const MIN_HEIGHT = 260;

/** Client on the left, proxy in the middle, servers stacked on the right. */
export function computeLayout(serverIds: string[]): TopologyLayout {
  const height = Math.max(MIN_HEIGHT, serverIds.length * ROW_HEIGHT);
  const centerY = height / 2;
  const firstRowY = (height - serverIds.length * ROW_HEIGHT) / 2 + ROW_HEIGHT / 2;

  const servers: Record<string, Point> = {};
  serverIds.forEach((id, index) => {
    servers[id] = { x: SERVER_X, y: firstRowY + index * ROW_HEIGHT };
  });

  return {
    width: VIEW_WIDTH,
    height,
    client: { x: CLIENT_X, y: centerY },
    proxy: { x: PROXY_X, y: centerY },
    servers,
  };
}
