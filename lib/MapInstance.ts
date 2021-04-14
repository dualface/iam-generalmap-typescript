/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

import { MapLayers } from "./MapLayers";
import { MapPosition } from "./MapPosition";
import { MapSize } from "./MapSize";

/**
 * 地图实例
 */
export class MapInstance {
    /**
     * 所有层
     */
    readonly layers: MapLayers;

    /**
     * 构造函数
     *
     * @param mapName 地图名字
     * @param mapSize 地图尺寸
     * @param tileSize 瓦片贴图尺寸
     */
    constructor(
        readonly mapName: string,
        readonly mapSize: MapSize,
        readonly tileSize: number
    ) {
        this.layers = new MapLayers(mapSize);
    }

    /**
     * 检查指定的位置是否是有效的地图位置
     *
     * @param position
     */
    checkPosition(
        ...args: [position: MapPosition] | [col: number, row: number]
    ): boolean {
        let col = 0;
        let row = 0;
        if (args.length === 2) {
            col = args[0];
            row = args[1];
        } else {
            col = args[0].col;
            row = args[0].row;
        }
        return (
            col >= 0 &&
            col < this.mapSize.cols &&
            row >= 0 &&
            row < this.mapSize.rows
        );
    }
}
