/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

/**
 * 地图尺寸单位
 */
export interface MapSize {
    /**
     * 多少列
     */
    cols: number;

    /**
     * 多少行
     */
    rows: number;
}

/**
 * 检查是否是有效的 MapSize 对象
 *
 * @param o
 */
export function isMapSize(o: any): o is MapSize {
    return (
        typeof o === "object" &&
        typeof o["cols"] === "number" &&
        typeof o["rows"] === "number"
    );
}
