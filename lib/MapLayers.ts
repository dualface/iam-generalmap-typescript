/**
 * COPYRIGHT 2021 ALL RESERVED. (C) liaoyulei, https://github.com/dualface
 */

import { MapLayer } from "./MapLayer";
import { MapSize } from "./MapSize";

/**
 * 地图中的所有层
 */
export class MapLayers {
    /**
     * 所有层
     */
    readonly all: Array<MapLayer> = [];

    /**
     * 构造函数
     *
     * @param size
     */
    constructor(readonly size: MapSize) {}

    /**
     * 创建一个层并追加到层列表中
     *
     * @param name
     */
    create(name: string): MapLayer {
        const layer = new MapLayer(name, this.size);
        this.add(layer);
        return layer;
    }

    /**
     * 追加一个层
     *
     * @param layer
     */
    add(layer: MapLayer): void {
        const name = layer.name;
        if (this.has(name)) {
            throw new RangeError(
                `MapLayers.add(): layer ${name} already exist`
            );
        }
        this.all.push(layer);
    }

    /**
     * 检查指定名字的层是否存在
     *
     * @param name
     */
    has(name: string): boolean {
        return this._find(name) !== undefined;
    }

    /**
     * 取得指定名字的层
     *
     * @param name
     */
    get(name: string): MapLayer {
        const layer = this._find(name);
        if (!layer) {
            throw new RangeError(`MapLayers.get(): layer ${name} not found`);
        }
        return layer;
    }

    /**
     * 删除指定名字的层
     *
     * @param name
     */
    delete(name: string): void {
        for (let i = 0, l = this.all.length; i < l; i++) {
            if (this.all[i].name === name) {
                this.all.splice(i, 1);
                return;
            }
        }
        throw new RangeError(`MapLayers.delete(): layer ${name} not found`);
    }

    /**
     * 删除所有层
     */
    deleteAll(): void {
        this.all.length = 0;
    }

    //// private

    /**
     * 取得指定名字的层，如果不存在则返回 undefined
     *
     * @param name
     */
    private _find(name: string): MapLayer | undefined {
        for (const layer of this.all) {
            if (layer.name === name) return layer;
        }
        return undefined;
    }
}
