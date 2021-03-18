/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

import { MapLayers } from "./MapLayers";
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
}
